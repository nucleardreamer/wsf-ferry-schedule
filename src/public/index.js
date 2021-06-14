(function($) {
  console.log('ready')

  var currentRouteAndSchedule = null
  var routesEl = $('.routes')
  var loadingEl = $('.loading')
  var route1 = $('.route1', routesEl)
  var route2 = $('.route2', routesEl)

  const setScheduleData = schedules => {
    $('.title span', route1).text(schedules[0].DepartingTerminalName)
    $('.title span', route2).text(schedules[1].DepartingTerminalName)
  }

  const fetchRouteAndSchedule = () => {
    // routeID is set globally when this page is rendered
    $.getJSON(`http://localhost:8080/api/routeAndSchedule/${routeID}`, result => {
      console.log('RESULT', result)
      currentRouteAndSchedule = result
      routesEl.removeClass('hide')
      loadingEl.addClass('hide')
      setScheduleData(result.Schedules)
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
  fetchRouteAndSchedule()

})(jQuery);
