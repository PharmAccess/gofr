FROM node:fermium

# for wget
RUN apt-get -qq update && apt-get install -y -qq git && apt-get install -y --no-install-recommends wget


COPY . /src/

WORKDIR /src/gofr-backend
RUN npm install

RUN cp /src/gofr-backend/mamatoto/config/default.json.example /src/gofr-backend/mamatoto/config/default.json

WORKDIR /src/gofr-backend/mamatoto
RUN npm install

ARG FHIR_BASE_URL=http://host.docker.internal:8080/fhir
ENV mCSD__server__protocal=http
ENV mCSD__server__host=host.docker.internal
ENV mCSD__server__port=8080
ENV mCSD__server__basePath=fhir
ENV FHIR_BASE_URL=${FHIR_BASE_URL}
ENV DOCKERIZE_VERSION v0.6.1
ENV APP__SITE__PATH=/src/gofr-backend/mamatoto
ENV APP__CORE__PATH=/src/gofr-backend/lib


# TODO: Remove when pushing to container registry
#ENV app__idp=keycloak
#ENV keycloak__baseURL=https://hdckeycloak.azurewebsites.net/auth
#ENV REDIS_HOST=host.docker.internal

RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz

# CMD ["npm", "start"]

ENTRYPOINT dockerize -wait-retry-interval 5s -timeout 120s -wait ${FHIR_BASE_URL}/DEFAULT/metadata npm run dev