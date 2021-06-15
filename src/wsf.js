const axios = require('axios')
const moment = require('moment')
const _ = require('lodash')

axios.defaults.baseURL = 'https://www.wsdot.wa.gov/ferries/api/schedule/rest'
axios.defaults.params = {
  apiaccesscode: process.env.WSF_API_KEY || 'f68dac82-1e43-4c02-8589-c875a5b9663a'
}

const getScheduleToday = async function (routeID) {
  try {
    let res = await axios.get(`/scheduletoday/${routeID}/true`)
    let data = await res.data
    return data
  } catch (err) {
    return err
  }
}

const getRoutes = async function () {
  try {
    let res = await axios.get(`/routes/${today()}`)
    let data = await res.data
    return data
  } catch (err) {
    return err
  }
}

const getRouteAndSchedule = async function (routeID) {
  try {
    let routeObj = null
    let routes = await getRoutes()
    routes.forEach(v => {
      if (v.RouteID == routeID) routeObj = v
    })

    let schedules = (await getScheduleToday(routeID)).TerminalCombos

    schedules = _.map(schedules, (terminal => {
      terminal.Times = _.map(terminal.Times, time => {
        let parsedDate = parseStupidDate(time.DepartingTime)[1].split('-')[0]
        time.DepartingTime = moment(Number(parsedDate)).format('h:mma')
        return time
      })
      return terminal
    }))

    routeObj.Schedules = schedules

    return routeObj
  } catch (err) {
    return err
  }
}

const getTerminalsAndMates = async function () {
  try {
    let res = await axios.get(`/terminalsandmates/${today()}`)
    let data = await res.data
    return data
  } catch (err) {
    return err
  }
}

const getTerminals = async function () {
  try {
    let res = await axios.get(`/terminals/${today()}`)
    let data = await res.data
    return data
  } catch (err) {
    return err
  }
}

var lastCacheFlushString = null
const needCacheFlush = async function () {
  // we dont need to evaluate the actual response here. If it's changed at all from the last time, it's time for a flush
  try {
    let res = await axios.get('/cacheflushdate')
    let data = await res.data
    // set the data if its the first time running this call
    if (lastCacheFlushString === null) {
      lastCacheFlushString = data
    }
    let needFlush = lastCacheFlushString !== data
    lastCacheFlushString = data
    return needFlush
  } catch (err) {
    return err
  }
}

function today () {
  return moment().format('YYYY-MM-DD')
}

function parseStupidDate (dateString) {
  return dateString.match(/\(([^\)]+)\)/)
}

module.exports = {
  getRouteAndSchedule,
  getScheduleToday,
  getRoutes,
  getTerminals,
  getTerminalsAndMates,
  needCacheFlush
}
