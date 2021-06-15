(function($) {

  var currentRouteAndSchedule = null
  var routesEl = $('.routes')
  var loadingEl = $('.loading')
  var route1 = $('.route1', routesEl)
  var route2 = $('.route2', routesEl)

  const setScheduleData = schedules => {
    $('.title span', route1).text(schedules[0].DepartingTerminalName)
    $('.title span', route2).text(schedules[1].DepartingTerminalName)

    var route1times = schedules[0].Times;
    $('.times .time:nth-child(1)', route1).text(_.get(route1times[0], 'DepartingTime') || '-')
    $('.times .time:nth-child(2)', route1).text(_.get(route1times[1], 'DepartingTime') || '-')
    $('.times .time:nth-child(3)', route1).text(_.get(route1times[2], 'DepartingTime') || '-')

    var route2times = schedules[1].Times;
    $('.times .time:nth-child(1)', route2).text(_.get(route2times[0], 'DepartingTime') || '-')
    $('.times .time:nth-child(2)', route2).text(_.get(route2times[1], 'DepartingTime') || '-')
    $('.times .time:nth-child(3)', route2).text(_.get(route2times[2], 'DepartingTime') || '-')

  }

  const fetchRouteAndSchedule = () => {
    // routeID is set globally when this page is rendered
    $.getJSON(`http://localhost:8080/api/routeAndSchedule/${routeID}`, result => {
      console.log('Fetched schedules:', result)
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

  const runFetchRouteAndSchedule = () => {
    fetchRouteAndSchedule()
    setTimeout(runFetchRouteAndSchedule, 60000)
  }
  runFetchRouteAndSchedule()

})(jQuery);
