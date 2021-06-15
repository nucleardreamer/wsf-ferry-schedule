(function($) {
  const setScheduleData = (schedule, position) => {
    var routeEl = $(`.route${position}`)
    $('.title span', routeEl).text(schedule.DepartingTerminalName)
    
    var routeTimes = schedule.Times;
    $('.times .time:nth-child(1)', routeEl).text(_.get(routeTimes[0], 'DepartingTime') || '-')
    $('.times .time:nth-child(2)', routeEl).text(_.get(routeTimes[1], 'DepartingTime') || '-')
    $('.times .time:nth-child(3)', routeEl).text(_.get(routeTimes[2], 'DepartingTime') || '-')
  }

  const fetchRouteAndSchedule = () => {
    $.getJSON(`http://localhost:8080/api/schedule/${departingID}/${arrivingID}`, result => {
      console.log(`Fetched schedules for ${departingID} to ${arrivingID}:`, result)
      $('.route1').removeClass('hide')
      $('.loading1').addClass('hide')
      setScheduleData(result, 1)
    })
    $.getJSON(`http://localhost:8080/api/schedule/${arrivingID}/${departingID}`, result => {
      console.log(`Fetched schedules for ${arrivingID} to ${departingID}:`, result)
      $('.route2').removeClass('hide')
      $('.loading2').addClass('hide')
      setScheduleData(result, 2)
    })
  }

  // deal with the clock
  let clockEl = $('.clock')
  const updateClock = () => {
    let now = moment().format('h:mma')
    clockEl.text(now)
  }

  const runUpdateClock = () => {
    updateClock()
    setTimeout(runUpdateClock, 1000)
  }
  runUpdateClock()

  const runFetchRouteAndSchedule = () => {
    fetchRouteAndSchedule()
    setTimeout(runFetchRouteAndSchedule, 60000)
  }
  runFetchRouteAndSchedule()

})(jQuery);
