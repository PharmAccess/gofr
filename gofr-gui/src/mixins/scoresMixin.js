import axios from 'axios'
import { generalMixin } from './generalMixin'
import { eventBus } from '../main'

const CancelToken = axios.CancelToken
export const scoresMixin = {
  mixins: [generalMixin],
  data () {
    return {
      loadingSource2Unmatched: false,
      loadingSource1Unmatched: false,
      topTree: ''
    }
  },
  methods: {
    scoreProgressCheckTimeout () {
      this.$store.state.scoresProgressData.scoreProgressTitle = 'Server is busy with automatching, please be patient'
      clearInterval(this.$store.state.scoresProgressData.progressReqTimer)
      let percent = parseInt(this.$store.state.scoresProgressData.scoreProgressPercent)
      if (percent !== 100 || (percent === 100 && this.$store.state.scoresProgressData.stage !== 'last')) {
        this.$store.state.scoresProgressData.requestCancelled = true
        this.$store.state.scoresProgressData.cancelTokenSource.cancel('Cancelling request.')
        setTimeout(() => {
          this.checkScoreProgress()
        }, 2000);
      } else {
        this.$store.state.scoresProgressData.scoreProgressTitle = 'Please be patient, waiting for server response'
      }
    },
    scoreSavingProgressCheckTimeout () {
      clearInterval(this.$store.state.scoreSavingProgressData.progressReqTimer)
      this.$store.state.scoreSavingProgressData.requestCancelled = true
      this.$store.state.scoreSavingProgressData.cancelTokenSource.cancel('Cancelling request.')
      this.checkScoreSavingStatus()
      this.saveProgressTimedout = true
    },
    checkScoreProgress () {
      // if the req takes one minute without responding then display a message to user
      this.$store.state.scoresProgressData.cancelTokenSource = CancelToken.source()
      let time
      let percent = parseInt(this.$store.state.scoresProgressData.scoreProgressPercent)
      if (percent > 96) {
        time = 402382
      } else {
        time = 10000
      }
      this.$store.state.scoresProgressData.progressReqTimer = setInterval(this.scoreProgressCheckTimeout, time)
      const clientId = this.$store.state.clientId
      axios.get('/progress/scoreResults/' + clientId, {
        cancelToken: this.$store.state.scoresProgressData.cancelTokenSource.token
      }).then((scoreProgress) => {
        clearInterval(this.$store.state.scoresProgressData.progressReqTimer)
        if (!scoreProgress.data ||
          (!scoreProgress.data.status && !scoreProgress.data.percent && !scoreProgress.data.error && this.$store.state.scoreResults.length === 0)) {
          // clearInterval(this.$store.state.scoresProgressData.scoreProgressTimer)
          this.$store.state.scoresProgressData.scoreDialog = false
          this.$store.state.scoresProgressData.scoreProgressTitle = 'Waiting for progress status'
          this.$store.state.errorTitle = 'An error has occured'
          this.$store.state.errorDescription = 'An error has occured while reaching out to server, please click recalculate scores to restart automatch'
          this.$store.state.errorColor = 'error'
          this.$store.state.dialogError = true
          this.clearProgress('scoreResults')
          // this.$store.state.scoreSavingProgressData.savingMatches = true
          // this.checkScoreSavingStatus()
          return
        } else if ((scoreProgress.data.status === null && scoreProgress.data.percent === null && scoreProgress.data.error === null && this.$store.state.scoreResults.length > 0)) {
          this.$store.state.scoresProgressData.scoreDialog = false
          this.$store.state.scoresProgressData.scoreProgressTitle = 'Waiting for progress status'
          this.clearProgress('scoreResults')
          // this.$store.state.scoreSavingProgressData.savingMatches = true
          // this.checkScoreSavingStatus()
          return
        }
        this.$store.state.scoresProgressData.scoreProgressTitle = scoreProgress.data.status
        if (scoreProgress.data.percent) {
          if (this.$store.state.scoresProgressData.progressType !== 'percent') {
            this.$store.state.scoresProgressData.progressType = 'percent'
          }
          this.$store.state.scoresProgressData.scoreProgressPercent = scoreProgress.data.percent
          this.$store.state.scoresProgressData.stage = scoreProgress.data.stage
        }
        if (scoreProgress.data.status === 'Done' && this.$store.state.scoreResults.length === 0) {
          this.clearProgress('scoreResults')
          // this.$store.state.scoreSavingProgressData.savingMatches = true
          // this.checkScoreSavingStatus()
          this.loadingSource1Unmatched = false
          this.loadingSource2Unmatched = false
          let scoresData = scoreProgress.data.responseData
          this.$store.state.source2UnMatched = scoresData.source2Unmatched
          this.$store.state.source1UnMatched = []
          this.$store.state.matchedContent = []
          this.$store.state.noMatchContent = []
          this.$store.state.ignoreContent = []
          this.$store.state.flagged = []
          this.$store.state.scoreResults = scoresData.scoreResults
          this.$store.state.source2TotalRecords = scoresData.source2TotalRecords
          this.$store.state.source2TotalAllRecords = scoresData.source2TotalAllRecords
          this.$store.state.totalAllMapped = scoresData.totalAllMapped
          this.$store.state.totalAllFlagged = scoresData.totalAllFlagged
          this.$store.state.totalAllNoMatch = scoresData.totalAllNoMatch
          this.$store.state.totalAllIgnore = scoresData.totalAllIgnore
          this.$store.state.source1TotalAllNotMapped = scoresData.source1TotalAllNotMapped
          this.$store.state.source1TotalAllRecords = scoresData.source1TotalAllRecords
          for (let scoreResult of this.$store.state.scoreResults) {
            if (scoreResult.source1.hasOwnProperty('tag') && scoreResult.source1.tag === 'flagged') {
              this.$store.state.flagged.push({
                source1Name: scoreResult.source1.name,
                source1Id: scoreResult.source1.id,
                source1IdHierarchy: scoreResult.source1.source1IdHierarchy,
                source1Parents: scoreResult.source1.parents,
                source2Name: scoreResult.exactMatch.name,
                source2Id: scoreResult.exactMatch.id,
                source2IdHierarchy: scoreResult.exactMatch.source2IdHierarchy,
                mappedParentName: scoreResult.exactMatch.mappedParentName,
                source2Parents: scoreResult.exactMatch.parents,
                flagComment: scoreResult.source1.flagComment
              })
            } else if (scoreResult.source1.hasOwnProperty('tag') && scoreResult.source1.tag === 'noMatch') {
              let parents = scoreResult.source1.parents
              this.$store.state.noMatchContent.push({
                source1Name: scoreResult.source1.name,
                source1Id: scoreResult.source1.id,
                parents: parents
              })
            } else if (scoreResult.source1.hasOwnProperty('tag') && scoreResult.source1.tag === 'ignore') {
              let parents = scoreResult.source1.parents
              this.$store.state.ignoreContent.push({
                source1Name: scoreResult.source1.name,
                source1Id: scoreResult.source1.id,
                parents: parents
              })
            } else if (Object.keys(scoreResult.exactMatch).length > 0) {
              this.$store.state.matchedContent.push({
                source1Name: scoreResult.source1.name,
                source1Id: scoreResult.source1.id,
                source1Parents: scoreResult.source1.parents,
                source2Name: scoreResult.exactMatch.name,
                source2Id: scoreResult.exactMatch.id,
                source2IdHierarchy: scoreResult.exactMatch.source2IdHierarchy,
                mappedParentName: scoreResult.exactMatch.mappedParentName,
                source2Parents: scoreResult.exactMatch.parents,
                matchComments: scoreResult.exactMatch.matchComments
              })
            } else {
              let addTree = this.topTree
              for (let i = scoreResult.source1.parents.length - 1; i >= 0; i--) {
                if (!addTree[scoreResult.source1.parents[i]]) {
                  addTree[scoreResult.source1.parents[i]] = {}
                }
                addTree = addTree[scoreResult.source1.parents[i]]
              }
              this.$store.state.source1UnMatched.push({
                name: scoreResult.source1.name,
                id: scoreResult.source1.id,
                parents: scoreResult.source1.parents
              })
            }
          }
          this.$store.state.source1Parents = this.topTree
          this.$store.state.scoresProgressData.scoreDialog = false
          this.$store.state.scoresProgressData.scoreProgressTitle = 'Waiting for progress status'
        } else {
          setTimeout(() => {
            this.checkScoreProgress()
          }, 2000);
        }
      }).catch(() => {
        if (this.$store.state.scoresProgressData.requestCancelled) {
          this.$store.state.scoresProgressData.requestCancelled = false
        } else {
          clearInterval(this.$store.state.scoresProgressData.progressReqTimer)
          setTimeout(() => {
            this.checkScoreProgress()
          }, 2000);
        }
      })
    },
    checkScoreSavingStatus () {
      // if the req takes one minute without responding then display a message to user
      this.$store.state.scoreSavingProgressData.cancelTokenSource = CancelToken.source()
      this.$store.state.scoreSavingProgressData.progressReqTimer = setInterval(this.scoreSavingProgressCheckTimeout, 10000)
      const clientId = this.$store.state.clientId
      axios.get('/progress/scoreSavingStatus/' + clientId, {
        cancelToken: this.$store.state.scoreSavingProgressData.cancelTokenSource.token
      }).then((scoreSavingStatus) => {
        clearInterval(this.$store.state.scoreSavingProgressData.progressReqTimer)
        if (!scoreSavingStatus.data ||
          (!scoreSavingStatus.data.status && !scoreSavingStatus.data.percent && !scoreSavingStatus.data.error && this.$store.state.scoreSavingProgressData.savingMatches)) {
          this.$store.state.errorTitle = 'An error has occured'
          this.$store.state.errorDescription = 'An error has occured while checking saving status'
          this.$store.state.errorColor = 'error'
          this.$store.state.dialogError = true
          this.$store.state.scoreSavingProgressData.savingMatches = false
          this.$store.state.scoreSavingProgressData.percent = 0
          this.clearProgress('scoreSavingStatus')
          return
        } else if ((!scoreSavingStatus.data.status && !scoreSavingStatus.data.percent && !scoreSavingStatus.data.error && !this.$store.state.scoreSavingProgressData.savingMatches)) {
          this.$store.state.scoreSavingProgressData.savingMatches = false
          this.$store.state.scoreSavingProgressData.percent = 0
          this.clearProgress('scoreSavingStatus')
          return
        }
        if (scoreSavingStatus.data.percent) {
          this.$store.state.scoreSavingProgressData.percent = scoreSavingStatus.data.percent
        }
        if (scoreSavingStatus.data.percent === 100) {
          this.$store.state.scoreSavingProgressData.savingMatches = false
          this.$store.state.scoreSavingProgressData.percent = 0
          this.clearProgress('scoreSavingStatus')
        } else {
          this.checkScoreSavingStatus()
        }
      }).catch(() => {
        if (this.$store.state.scoreSavingProgressData.requestCancelled) {
          this.$store.state.scoreSavingProgressData.requestCancelled = false
        } else {
          clearInterval(this.$store.state.scoreSavingProgressData.progressReqTimer)
          this.checkScoreSavingStatus()
        }
      })
    },
    getScores (getPotential) {
      if (!getPotential) {
        getPotential = false
      }
      let partition1 = this.$store.state.activePair.source1.name
      let partition2 = this.$store.state.activePair.source2.name
      let mappingPartition = this.$store.state.activePair.name
      this.$store.state.source1UnMatched = []
      this.$store.state.source2UnMatched = []
      this.$store.state.matchedContent = []
      this.$store.state.noMatchContent = []
      this.$store.state.ignoreContent = []
      this.$store.state.flagged = []
      this.$store.state.source1TotalAllRecords = 0
      this.$store.state.totalAllMapped = 0
      this.$store.state.totalAllFlagged = 0
      this.$store.state.totalAllNoMatch = 0
      this.$store.state.totalAllIgnore = 0
      this.$store.state.source2TotalRecords = 0
      this.$store.state.scoreResults = []
      if (!partition1 || !partition2 || !mappingPartition) {
        return
      }
      this.loadingSource1Unmatched = true
      this.loadingSource2Unmatched = true
      this.$store.state.scoresProgressData.scoreDialog = true
      this.$store.state.scoresProgressData.scoreProgressTitle = 'Waiting for progress status'
      this.$store.state.scoresProgressData.progressType = 'indeterminate'
      let recoLevel = this.$store.state.recoLevel
      let totalSource1Levels = this.$store.state.totalSource1Levels
      let totalSource2Levels = this.$store.state.totalSource2Levels
      const clientId = this.$store.state.clientId
      this.topTree = this.$store.state.source1Parents.slice(0, this.$store.state.source1Parents.length)

      // generating levels
      this.$store.state.levelArray = []
      for (var k = 1; k < this.$store.state.totalSource1Levels; k++) {
        let text
        if (k + 1 > this.$store.state.recoLevel) {
          continue
        }
        text = this.translateDataHeader('source1', k)
        this.$store.state.levelArray.push({
          text: text,
          value: k + 1
        })
      }
      let source1LimitOrgId = this.getLimitOrgIdOnActivePair().source1LimitOrgId
      let source2LimitOrgId = this.getLimitOrgIdOnActivePair().source2LimitOrgId
      source1LimitOrgId = JSON.stringify(source1LimitOrgId)
      source2LimitOrgId = JSON.stringify(source2LimitOrgId)
      let parentConstraint = JSON.stringify(this.$store.state.config.generalConfig.reconciliation.parentConstraint)
      let path = `partition1=${partition1}&partition2=${partition2}&mappingPartition=${mappingPartition}&source1LimitOrgId=${source1LimitOrgId}`
      path += `&source2LimitOrgId=${source2LimitOrgId}&totalSource1Levels=${totalSource1Levels}&totalSource2Levels=${totalSource2Levels}`
      path += `&recoLevel=${recoLevel}&clientId=${clientId}&parentConstraint=${parentConstraint}&getPotential=${getPotential}`
      axios.get('/match/reconcile/?' + path).then(() => {
        setTimeout(() => {
          this.checkScoreProgress()
        }, 2000);
      })
      // this.$store.state.scoresProgressData.scoreProgressTimer = setInterval(this.checkScoreProgress, 2000)
    },
    getSource1 () {
      let source = this.$store.state.activePair.source1.display
      if (source) {
        source = this.toTitleCase(source)
      }
      return source
    },
    getSource2 () {
      let source = this.$store.state.activePair.source2.display
      if (source) {
        source = this.toTitleCase(source)
      }
      return source
    },
    getSource1Name () {
      return this.$store.state.activePair.source1.display
    },
    getSource2Name () {
      return this.$store.state.activePair.source2.display
    }
  },
  created () {
    eventBus.$on('changeCSVHeaderNames', () => {
      this.$store.state.levelArray = []
      for (var k = 1; k < this.$store.state.totalSource1Levels; k++) {
        let text
        if (k + 1 > this.$store.state.recoLevel) {
          continue
        }
        text = this.translateDataHeader('source1', k)
        this.$store.state.levelArray.push({
          text: text,
          value: k + 1
        })
      }
    })
    // this.$store.state.scoresProgressData.scoreProgressTitle = this.$store.state.scoresProgressData.scoreProgressTitle
    // this.$store.state.scoresProgressData.scoreProgressPercent = this.$store.state.scoresProgressData.scoreProgressPercent
    // if (this.$store.state.scoresProgressData.scoreDialog) {
    //   this.$store.state.scoresProgressData.scoreDialog = this.$store.state.scoresProgressData.scoreDialog
    // } else {
    //   this.$store.state.scoresProgressData.scoreDialog = false
    // }
    // this.$store.state.scoresProgressData.progressType = this.$store.state.scoresProgressData.progressType
    // this.$store.state.scoresProgressData.scoreProgressTimer = this.$store.state.scoresProgressData.scoreProgressTimer
    // if (this.$store.state.scoresProgressData.scoreDialog) {
    //   this.$store.state.scoresProgressData.scoreProgressTimer = setInterval(this.checkScoreProgress, 1000)
    // }
  }
  // destroyed () {
  //   this.$store.state.scoresProgressData.scoreProgressTitle = this.$store.state.scoresProgressData.scoreProgressTitle
  //   this.$store.state.scoresProgressData.scoreProgressPercent = this.$store.state.scoresProgressData.scoreProgressPercent
  //   this.$store.state.scoresProgressData.scoreDialog = this.$store.state.scoresProgressData.scoreDialog
  //   this.$store.state.scoresProgressData.progressType = this.$store.state.scoresProgressData.progressType
  //   this.$store.state.scoresProgressData.scoreProgressTimer = this.$store.state.scoresProgressData.scoreProgressTimer
  //   // clearInterval(this.$store.state.scoresProgressData.scoreProgressTimer)
  // }
}
