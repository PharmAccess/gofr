/* eslint-disable func-names */
const request = require('request');
const uuid4 = require('uuid/v4');
const URI = require('urijs');
const http = require('http');
const https = require('https');
const isJSON = require('is-json');
const redis = require('redis');
const mixin = require('./mixin');
const logger = require('./winston');
const fhirAxios = require('./modules/fhirAxios');
const config = require('./config');
const uploadToSql = require("./modules/uploadToSql")

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST || '127.0.0.1',
});

const credentials = {
  dhis2URL: '',
  username: '',
  password: '',
  name: '',
};

const dhis = {
  processMetaData: (full, dousers, doservices) => {
    const {
      clientId,
    } = credentials;
    let dhisSyncRequestId = `dhisSyncRequest${clientId}`;
    let dhisSyncRequest = JSON.stringify({
      status: '1/2 - Loading all DHIS2 data from host',
      error: null,
      percent: null,
    });
    redisClient.set(dhisSyncRequestId, dhisSyncRequest);

    // const hasKey = true // await checkLoaderDataStore();
    /* let lastUpdate = false;
    if (!full && hasKey) {
      lastUpdate = await getLastUpdate(credentials.name, credentials.dhis2URL, credentials.auth);
      // Convert to yyyy-mm-dd format (dropping time as it is ignored by DHIS2)
      lastUpdate = new Date(Date.parse(lastUpdate)).toISOString().substr(0, 10);
    } */
    const database = credentials.name;
    dhis.getLastUpdate(database, credentials.dhis2URL, credentials.auth, (lastUpdate) => {
      if (!full && lastUpdate) {
        lastUpdate = new Date(Date.parse(lastUpdate)).toISOString().substr(0, 10);
      }
      let uflag = 'false';
      if (dousers) {
        uflag = 'true';
      }
      let sflag = 'false';
      if (doservices) {
        sflag = 'true';
      }

      const metadataOpts = [
        'assumeTrue=false',
        'organisationUnits=true',
        'organisationUnitGroups=true',
        'organisationUnitLevels=true',
        'organisationUnitGroupSets=true',
        `categoryOptions=${sflag}`,
        `optionSets=${sflag}`,
        `dataElementGroupSets=${sflag}`,
        `categoryOptionGroupSets=${sflag}`,
        `categoryCombos=${sflag}`,
        `options=${sflag}`,
        `categoryOptionCombos=${sflag}`,
        `dataSets=${sflag}`,
        `dataElementGroups=${sflag}`,
        `dataElements=${sflag}`,
        `categoryOptionGroups=${sflag}`,
        `categories=${sflag}`,
        `users=${uflag}`,
        `userGroups=${uflag}`,
        `userRoles=${uflag}`,
      ];

      if (!full && lastUpdate) {
        metadataOpts.push(`filter=lastUpdated:gt:${lastUpdate}`);
      }
      const {
        dhis2URL,
      } = credentials;
      const {
        auth,
      } = credentials;
      logger.info(`GETTING ${dhis2URL.protocol()}://${dhis2URL.hostname()}:${dhis2URL.port()}${dhis2URL.path()}api/metadata.json?${metadataOpts.join('&')}`);
      let reqMod = https;
      if (dhis2URL.protocol() === 'http') {
        reqMod = http;
      }
      reqMod.request({
        hostname: dhis2URL.hostname(),
        port: dhis2URL.port(),
        path: `${dhis2URL.path()}api/metadata.json?${metadataOpts.join('&')}`,
        headers: {
          Authorization: auth,
        },
        timeout: 300000,
        method: 'GET',
      }, (res) => {
        logger.info(`Request to get Metadata responded with code ${res.statusCode}`);
        let body = '';
        res.on('data', (chunk) => {
          body += chunk;
        });
        res.on('end', () => {
          if (!isJSON(body)) {
            logger.error(body);
            logger.error('Non JSON response received while getting DHIS2 data');
            dhisSyncRequestId = `dhisSyncRequest${clientId}`;
            dhisSyncRequest = JSON.stringify({
              status: '1/2 - Getting DHIS2 Data',
              error: `Invalid response with code ${res.statusCode} received while getting DHIS2 data,cross check the host name,username and password`,
              percent: null,
            });
            redisClient.set(dhisSyncRequestId, dhisSyncRequest);
          } else {
            let metadata;
            try {
              metadata = JSON.parse(body);
            } catch (error) {
              logger.error(error);
              logger.error(body);
              logger.error('An error occured while parsing response from DHIS2 server');
            }

            if (!metadata.hasOwnProperty('organisationUnits')) {
              logger.info('No organization unit found in metadata');
              dhisSyncRequestId = `dhisSyncRequest${clientId}`;
              dhisSyncRequest = JSON.stringify({
                status: 'Done',
                error: null,
                percent: 100,
              });
              redisClient.set(dhisSyncRequestId, dhisSyncRequest);
              const thisRunTime = new Date().toISOString();
              setLastUpdate(lastUpdate, thisRunTime);
            } else {
              processOrgUnit(metadata, lastUpdate);
            }
          }
        });
        res.on('error', (e) => {
          logger.error(`ERROR: ${e.message}`);
        });
      }).end();
    });
  },
  sync: (host, username, password, name, clientId, topOrgName, reset, full, dousers, doservices) => {
    if(!host.endsWith("/")) {
      host += "/"
    }
    const dhis2URL = new URI(host);
    const auth = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;
    credentials.dhis2URL = dhis2URL;
    credentials.clientId = clientId;
    credentials.auth = auth;
    credentials.name = name;
    const database = name;
    credentials.topOrgId = mixin.getTopOrgId(database, 'Location');
    credentials.topOrgName = topOrgName;

    if (reset) {
      logger.info(`Attempting to reset time on ${host}\n`);
      let reqMod = https;
      if (dhis2URL.protocol() === 'http') {
        reqMod = http;
      }
      reqMod.request({
        hostname: dhis2URL.hostname(),
        port: dhis2URL.port(),
        path: `${dhis2URL.path()}api/dataStore/CSD-Loader-Last-Export/${database}`,
        headers: {
          Authorization: auth,
        },
        method: 'DELETE',
      }, (res) => {
        logger.info(`Reset request returned with code ${res.statusCode}`);
        res.on('end', () => {});
        res.on('error', (e) => {
          console.log(`ERROR: ${e.message}`);
        });
      }).end();
    } else {
      dhis.processMetaData(full, dousers, doservices);
    }
  },
  getLastUpdate: (name, dhis2URL, auth, callback) => {
    logger.info('getting last updated time');
    if (dhis2URL.port() < 0 || dhis2URL.port() >= 65536) {
      logger.error('port number is out of range');
      return callback(false);
    }
    let reqMod = https;
    if (dhis2URL.protocol() === 'http') {
      reqMod = http;
    }
    const req = reqMod.request({
      hostname: dhis2URL.hostname(),
      port: dhis2URL.port(),
      path: `${dhis2URL.path()}api/dataStore/CSD-Loader-Last-Export/${name}`,
      headers: {
        Authorization: auth,
      },
      method: 'GET',
    });
    req.on('response', (res) => {
      logger.info(`Request to get last updated time has responded with code ${res.statusCode}`);
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        let dataStore;
        try {
          dataStore = JSON.parse(body);
        } catch (error) {
          return callback(false);
        }
        if (!dataStore.hasOwnProperty('value')) {
          return callback(false);
        }
        return callback(dataStore.value);
      });
      res.on('error', (e) => {
        logger.error(`ERROR: ${e.message}`);
        return callback(false);
      });
    });
    req.on('error', (err) => {
      logger.error(err);
      return callback(false);
    });
    req.end();
  },
};

async function processOrgUnit(metadata, hasKey) {
  logger.info('Now writing org units into the database');
  // logger.info(credentials)
  const {
    name,
    clientId,
  } = credentials;

  const database = name;
  let counter = 0;
  const max = metadata.organisationUnits.length;
  // adding the fake orgid as the top orgid
  const fhir = {
    resourceType: 'Location',
    id: credentials.topOrgId,
    status: 'active',
    mode: 'instance',
  };
  fhir.identifier = [{
    system: 'https://digitalhealth.intrahealth.org/source1',
    value: credentials.topOrgId,
  }];
  fhir.physicalType = {
    coding: [{
      system: 'http://hl7.org/fhir/location-physical-type',
      code: 'jdn',
      display: 'Jurisdiction',
    }],
    text: 'Jurisdiction',
  };
  let hostURL = URI(fhirAxios.__genUrl(database))
    .segment('Location')
    .segment(fhir.id)
    .toString();
  let options = {
    url: hostURL.toString(),
    headers: {
      'Content-Type': 'application/fhir+json',
    },
    json: fhir,
  };
  request.put(options, (err, res, body) => {
    if (err) {
      logger.error('An error occured while saving the top org of hierarchy, this will cause issues with reconciliation');
    }
  });

  let queries = []
  let fakeOrgId = {
    name: config.get('mCSD:fakeOrgName'),
    parent: null,
    uuid: credentials.topOrgId,
    parentUUID: null,
  };
  // TODO: check why table is being created in pg directly also why pg use is assumed
  // await uploadToSql.createTable(database).catch((err) => {
  //   console.log(err);
  // })
  // uploadToSql.buildSQL(fakeOrgId, queries, database)
  let bundle = {
    id: uuid4(),
    resourceType: 'Bundle',
    type: 'transaction',
    entry: [],
  }
  let i = 0;
  metadata.organisationUnits.sort((a, b) => a.level - b.level);
  for(org of metadata.organisationUnits) {
    logger.info(`Processing (${++i}/${max}) ${org.id}`);
    let location = {
      uuid: org.id,
      id: [org.id],
      code: [],
      name: org.name,
      lat: "",
      long: "",
      parent: "",
      parentUUID: "",
    }
    if(org.code) {
      location.code.push(org.code)
    }
    const fhir = {
      meta: {
        profile: [],
      },
      resourceType: 'Location',
      id: org.id,
      status: 'active',
      mode: 'instance',
    };
    fhir.identifier = [{
      system: 'https://kmhfl.health.go.ke/',
      value: org.code,
    },
    {
      system: 'http://dhis2.org/id',
      value: org.id,
    },
    ];
    fhir.meta = {
      lastUpdated: org.lastUpdated,
    };
    const path = org.path.split('/');
    let level;
    if (metadata.hasOwnProperty('organisationUnitLevels')) {
      level = metadata.organisationUnitLevels.find(x => x.level == path.length - 1);
    }
    if (level) {
      fhir.meta.tag = [{
        system: 'https://digitalhealth.intrahealth.org/organistionUnitLevels',
        code: level.id,
        display: level.name,
      }];
    }
    fhir.name = org.name;
    fhir.alias = [org.shortName];
    if (metadata.organisationUnits.find(x => x.parent && x.parent.id && x.parent.id == org.id)) {
      fhir.meta.profile = config.get('profiles:jurisdiction');
      fhir.type = {
        coding: [{
          system: 'urn:ietf:rfc:3986',
          code: 'urn:ihe:iti:mcsd:2019:jurisdiction',
          display: 'Jurisdiction',
        }],
      };
      fhir.physicalType = {
        coding: [{
          system: 'http://hl7.org/fhir/location-physical-type',
          code: 'area',
          display: 'Area',
        }],
        text: 'Administrative Area',
      };
    } else {
      fhir.meta.profile = config.get('profiles:facility');
      fhir.type = {
        coding: [{
          system: 'urn:ietf:rfc:3986',
          code: 'urn:ihe:iti:mcsd:2019:facility',
          display: 'Facility',
        }],
      };
      fhir.physicalType = {
        coding: [{
          system: 'http://hl7.org/fhir/location-physical-type',
          code: 'bu',
          display: 'Building',
        }],
        text: 'Facility',
      };
    }

    if (org.featureType == 'POINT' && org.coordinates) {
      try {
        const coords = JSON.parse(org.coordinates);
        location.lat = coords[1]
        location.long = coords[0]
        fhir.position = {
          longitude: coords[0],
          latitude: coords[1],
        };
      } catch (e) {
        logger.error(`Failed to load coordinates. ${e.message}`);
      }
    }
    if (org.hasOwnProperty('parent') && org.parent.id) {
      fhir.partOf = {
        reference: `Location/${org.parent.id}`,
      };
      location.parentUUID = org.parent.id
    } else {
      fhir.partOf = {
        reference: `Location/${credentials.topOrgId}`,
        display: credentials.topOrgName,
      };
      location.parentUUID = credentials.topOrgId
    }
    if (org.attributeValues) {
      for (const attr of org.attributeValues) {
        if (attr.attribute.id == 'XxZsKNpu4nB') {
          fhir.identifier.push({
            system: 'http://dhis2.org/id',
            value: attr.value,
          });
          location.id.push(attr.value)
        }
        if (attr.attribute.id == 'Ed6SCy0OXfx') {
          fhir.identifier.push({
            system: 'http://dhis2.org/code',
            value: attr.value,
          });
          location.code.push(attr.value)
        }
      }
    }
    bundle.entry.push({
      resource: fhir,
      request: {
        method: 'PUT',
        url: `Location/${fhir.id}`,
      }
    })
    uploadToSql.buildSQL(location, queries, database)
    counter++
    if(bundle.entry.length > 250) {
      await fhirAxios.create(bundle, database).then(() => {
        bundle.entry = []
        const percent = parseFloat((counter * 100 / max).toFixed(2));
        let status = '2/2 - Saving DHIS2 locations into FHIR server';
        if (counter === max) {
          status = 'Done';
        }
        const dhisSyncRequestId = `dhisSyncRequest${clientId}`;
        const dhisSyncRequest = JSON.stringify({
          status,
          error: null,
          percent,
        });
        redisClient.set(dhisSyncRequestId, dhisSyncRequest);
      }).catch((err) => {
        logger.error(err);
      })
      // await uploadToSql.saveSQL(queries)
      queries = []
    }
  }
  if(queries.length > 0) {
    // uploadToSql.saveSQL(queries)
  }
  if(bundle.entry.length > 0) {
    await fhirAxios.create(bundle, database).then(() => {
      bundle.entry = []
      const dhisSyncRequestId = `dhisSyncRequest${clientId}`;
      const dhisSyncRequest = JSON.stringify({
        status: "Done",
        error: null,
        percent: 100,
      });
      redisClient.set(dhisSyncRequestId, dhisSyncRequest);
    }).catch((err) => {
      logger.error(err);
    })
  }
  const thisRunTime = new Date().toISOString();
  setLastUpdate(hasKey, thisRunTime);
}

function checkLoaderDataStore() {
  const name = credentials.name;
  const dhis2URL = credentials.dhis2URL;
  const auth = credentials.auth;
  logger.info('Checking loader datastore');
  return new Promise((resolve, reject) => {
    const req = (dhis2URL.protocol == 'https:' ? https : http).request({
      hostname: dhis2URL.hostname,
      port: dhis2URL.port,
      path: `${dhis2URL.path}api/dataStore/CSD-Loader-Last-Export/${name}`,
      headers: {
        Authorization: auth,
      },
      method: 'GET',
    });
    req.on('response', (res) => {
      logger.info(`Loader datastore responded with code ${res.statusCode}`);
      if (res.statusCode == 200 || res.statusCode == 201) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
    req.on('error', (err) => {
      reject(err);
    });
    req.end();
  });
}

function setLastUpdate(hasKey, lastUpdate) {
  const {
    name,
    auth,
    dhis2URL,
  } = credentials;
  const database = name;
  logger.info('setting lastupdated time');
  let reqMod = https;
  if (dhis2URL.protocol() === 'http') {
    reqMod = http;
  }
  const req = reqMod.request({
    hostname: dhis2URL.hostname(),
    port: dhis2URL.port(),
    path: `${dhis2URL.path()}api/dataStore/CSD-Loader-Last-Export/${database}`,
    headers: {
      Authorization: auth,
      'Content-Type': 'application/json',
    },
    method: (hasKey ? 'PUT' : 'POST'),
  }, (res) => {
    logger.info(`request to set lastupdated time has responded with code ${res.statusCode}`);
    if (res.statusCode == 200 || res.statusCode == 201) {
      logger.info('Last update dataStore set.');
    } else {
      logger.error('Last update dataStore FAILED.');
    }
    let body = '';
    res.on('data', (chunk) => {
      body += chunk;
    });
    res.on('end', () => {
      const dataStore = JSON.parse(body);
      logger.info(dataStore);
    });
    res.on('error', (e) => {
      logger.error(`ERROR: ${e.message}`);
    });
  });
  const payload = {
    value: lastUpdate,
  };
  req.write(JSON.stringify(payload));
  req.end();
}

module.exports = dhis;
