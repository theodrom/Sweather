//
//
'use strict'

var inpt = document.querySelector('#searchInput'),
  sugg = document.querySelector('#suggestionsUl'),
  headSection = document.querySelector('#headSection'),
  hourlySection = document.querySelector('#hourlySection'),
  mapHolder = document.getElementById('cityLocation'),
  lat,lon,lt,ln,qName,q,
  city = $('#cityName')

// *********** The search function ***********   

// The input event is fired when the value of an <input> element is changed
inpt.addEventListener('input', function () {
  let cityName = inpt.value,
    hit = '',

    // var to remove cities from results, cities=0
    empty = 0
  if (cityName.length != 0) {
    empty = ''
  }

  // xhr request for city suggestions
  var req = new XMLHttpRequest(),
    content = function () {
      if (req.readyState === 4 && req.status === 200) {
        var resp = JSON.parse(req.response)
        // if input has a value
        if (cityName.length != 0 && hit != null) {
          sugg.style.display = 'block'

          for (var i = 0; i < resp.RESULTS.length; i++) {
            // split the result, because it is of type 'city, Sweden'
            hit += '<li class="hit">' + resp.RESULTS[i].name.split(',', 1) + '</li>'
            lat = resp.RESULTS[i].lat
            lon = resp.RESULTS[i].lon
            q = resp.RESULTS[i].name.split(',', 1)
          }
          // empty the container on every call
          sugg.innerHTML = ''
          sugg.innerHTML = hit
        }else {
          sugg.style.display = 'none'
        }
      }
  }
  req.onreadystatechange = content
  req.open('GET', 'http://autocomplete.wunderground.com/aq?query=' + cityName + '&c=SE&cities=' + empty, true)
  req.send()
})

// *********** Get current location function ***********
$(window).on('load', function () {
  var cityReq = new XMLHttpRequest(),
    content = function () {
      if (cityReq.readyState === 4 && cityReq.status === 200) {
        var cityResp = JSON.parse(cityReq.response),
        // the responses
        qName = cityResp.cityName
        lt = cityResp.latitude
        ln = cityResp.longitude
        // inserts the current city name
        city.text(qName)
        // place the mapHolder display before the googleMap call
        mapHolder.style.display = 'block'

        // call the functions with the above parameters
        hourlyWeather(qName)
        tenDaysWeather(qName)
        myCityMap(lt, ln)

        headSection.style.display = 'block'
        hourlySection.style.display = 'block'
      }
  }
  cityReq.onreadystatechange = content
  cityReq.open('GET', 'http://api.ipinfodb.com/v3/ip-city/?key=64a852056985e959ce39323db1db0200a9f8459a6a6d722914042680c74c73f4&format=json', true)
  cityReq.send()
})

// *********** Hourly weather function ***********
function hourlyWeather (q) {
  // xhr call for every city in Sweden
  $.getJSON('http://api.wunderground.com/api/4c0fff77b0215157/hourly/lang:SW/q/Sweden/' + q + '.json', function (data) {
    //gets data from the index 0 for the present hour
    var fc = data.hourly_forecast[0]
    $('#weatherIcon').attr('src', fc.icon_url)
    $('#curCondition').html(fc.condition)
    $('#curTemp').html(fc.temp.metric + '°')
    $('#curDay').html(fc.FCTTIME.weekday_name)
    $('#curDate').html(fc.FCTTIME.mday)
    $('#curMonth').html(fc.FCTTIME.month_name)
    $('#curHighestTemp').html(fc.dewpoint.metric + '°')

    //gets data from the other indexes
    var e = ''
    for (var i = 0; i < 25; i++) {
      var fcIn = data.hourly_forecast[i]
      e += '<div id="hourInfo-holder' + i + '" class="hourInfo-holder">'
      e += '<h5 id="theHour' + i + '">' + fcIn.FCTTIME.hour + '</h5>'
      e += '<img class="weatherIcon" src="' + fcIn.icon_url + '" alt="' + fcIn.icon + '">'
      e += '<h5 id="highestTemp' + i + '">' + fcIn.temp.metric + '°' + '</h5>'
      e += '</div>'
    }
    $('#hourlySection').html(e)
  })
}

// *********** 10Days weather function ***********
function tenDaysWeather (q) {
  // xhr call for every city in Sweden
  var url = 'http://api.wunderground.com/api/4c0fff77b0215157/forecast10day/lang:SW/q/Sweden/' + q + '.json'
  var reqAjax = $.ajax({
    url: url,
    method: 'GET',
    dataType: 'json'
  })

  reqAjax.done(function (data) {
    $('#curText').text(data.forecast.txt_forecast.forecastday[0].fcttext_metric)
    var d = ''
    for (var i = 1; i < 8; i++) {
      let fc = data.forecast.simpleforecast.forecastday[i]
      d += '<li>'
      d += '<span>' + fc.date.weekday + '</span>'
      d += '<img src="' + fc.icon_url + '" alt="' + fc.icon + '">'
      d += '<div class="maxMinWrapper"><span>' + fc.high.celsius + '</span>'
      d += '<span>' + fc.low.celsius + '</span></div>'
      d += '</li>'
    }

    $('#dailyUl').html(d)
  })
}

// *********** Google map function ***********
function myCityMap (lat, lon) {
  var mapOptions = {
    center: new google.maps.LatLng(lat, lon),
    zoom: 10,
    mapTypeId: google.maps.MapTypeId.HYBRID
  }
  var map = new google.maps.Map(mapHolder, mapOptions),
    marker = new google.maps.Marker({
      position: mapOptions.center
    })
  marker.setMap(map)
}

// *********** Click on hit function ***********
$('#suggestionsUl').on('click', '.hit', function () {
  // uses a parent element to fire the event on dynamicly created element
  $(this).each(function () {
    inpt.value = $(this).text()
    // changes the values with the city name
    city.text($(this).text())

    sugg.style.display = 'none'
    headSection.style.display = 'block'
    hourlySection.style.display = 'block'
    mapHolder.style.display = 'block'
    // the 'this' has already the same value from above
    q = city.text()

    // calls to the functions
    hourlyWeather(q)
    tenDaysWeather(q)
    myCityMap(lat, lon)
  })
})

// *********** Click on button function ***********
$('#searchBtn').on('click', function () {
  sugg.style.display = 'none'
  headSection.style.display = 'block'
  hourlySection.style.display = 'block'
  mapHolder.style.display = 'block'
  q = inpt.value
  city.text(q)

  // calls to the functions
  hourlyWeather(q)
  tenDaysWeather(q)
  myCityMap(lat, lon)
})
