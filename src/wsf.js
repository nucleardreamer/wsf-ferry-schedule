const axios = require('axios')
const moment = require('moment')
const _ = require('lodash')

axios.defaults.baseURL = 'https://www.wsdot.wa.gov/ferries/api/schedule/rest'
axios.defaults.params = {
  apiaccesscode: process.env.WSF_API_KEY || 'f68dac82-1e43-4c02-8589-c875a5b9663a'
}

const getScheduleToday = async function (departingID, arrivingID) {
  try {
    let res = await axios.get(`/scheduletoday/${departingID}/${arrivingID}/true`)
    let data = await res.data
    return data
  } catch (err) {
    return err
  }
}

const getAllRoutes = async function () {
  try {
    let res = await axios.get(`/routes/${today()}`)
    let data = await res.data
    return data
  } catch (err) {
    return err
  }
}

const getRoutes = async function (departingID, arrivingID) {
  try {
    let res = await axios.get(`/routes/${today()}/${departingID}/${arrivingID}`)
    let data = await res.data
    return data
  } catch (err) {
    return err
  }
}

const getSchedule = async function (departingID, arrivingID) {
  try {
    let schedule = await getScheduleToday(departingID, arrivingID)
    schedule = schedule.TerminalCombos[0]
    if (schedule === undefined) {
      throw new Error(`Schedule fetch for ${departingID} ${arrivingID} returned an error`)
    }
    schedule.Times = _.map(schedule.Times, time => {
      let parsedDate = parseStupidDate(time.DepartingTime)[1].split('-')[0]
      time.DepartingTime = moment(Number(parsedDate)).format('h:mma')
      return time
    })
    return schedule
  } catch (err) {
    console.error(err)
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
  let formatted = moment().format('YYYY-MM-DD')
  return formatted
}

function parseStupidDate (dateString) {
  return dateString.match(/\(([^\)]+)\)/)
}

module.exports = {
  getSchedule,
  getRoutes,
  getAllRoutes,
  getTerminals,
  getTerminalsAndMates,
  needCacheFlush
}
