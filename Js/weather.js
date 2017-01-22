//
//
'use strict'

// dom and new variables
var inpt = document.querySelector('#searchInput'),
  sugg = document.querySelector('#suggestionsUl'),
  headSection = document.querySelector('#headSection'),
  hourlySection = document.querySelector('#hourlySection'),
  mapHolder = document.getElementById('cityLocation'),
  lat,lon,lt,ln,qName,q,
  city = $('#cityName'),
  menuName = $('.menuName')

// *********** The search function ***********   

// The input event is triggered when the value of an <input> element is changed
inpt.addEventListener('input', function () {
  var cityName = inpt.value,
    hit = '',

    // var to remove cities from results, cities=0
    empty = 0
  if (cityName.length != 0) {
    empty = ''
  }


    // call to api with callback function. The data we get are already a parsed json string
    var url = 'http://autocomplete.wunderground.com/aq?query=' + cityName + '&c=SE&cities=' + empty + '&cb=?'
    $.ajax({
      url: url,
      dataType: 'jsonp',
      crossDomain: true,
      success: function (resp) {
        if (cityName.length != 0 && hit != null) {

          // if no results where found
          if (resp.RESULTS.length == 0) {
            sugg.style.display = 'none'
            return false
          }
          // show the container
          sugg.style.display = 'block'

          for (var i = 0; i < resp.RESULTS.length; i++) {
            // split the result, because it is of type 'city, Sweden'
            hit += '<li class="hit" data-lat="' + resp.RESULTS[i].lat + '" data-lon="' + resp.RESULTS[i].lon + '">' + resp.RESULTS[i].name.split(',', 1) + '</li>'
          }
          // empty the container on every call
          sugg.innerHTML = ''
          sugg.innerHTML = hit
        }else {
          sugg.style.display = 'none'
        }
      }
    })
  })


// *********** Get current location function ***********
$(function () {
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
          // ** place the mapHolder display before the googleMap call**
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
})

// *********** Hourly weather function ***********
function hourlyWeather (q) {
  // xhr call for every city in Sweden
  $.getJSON('http://api.wunderground.com/api/4c0fff77b0215157/hourly/lang:SW/q/Sweden/' + q + '.json', function (data) {
    // gets data from the index 0 for the present hour
    var fc = data.hourly_forecast[0]
    $('#weatherIcon').attr('src', fc.icon_url)
    $('#curCondition').html(fc.condition)
    $('#curTemp').html(fc.temp.metric + '°')
    $('#curDay').html(fc.FCTTIME.weekday_name)
    $('#curDate').html(fc.FCTTIME.mday)
    $('#curMonth').html(fc.FCTTIME.month_name)
    $('#curHighestTemp').html(fc.dewpoint.metric + '°')

    // gets data from the other indexes
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
      var fc = data.forecast.simpleforecast.forecastday[i]
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

// *********** Google map call and function ***********

$.ajax({
  url: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBsODDimVJfwfPLKMWNH6BhKkUAH2hxUyM&callback=?',
  dataType: 'jsonp',
  jsonpCallback: 'myCityMap'
})

function myCityMap (lat, lon) {
  // show the map
  var mapOptions = {
    center: new google.maps.LatLng(lat, lon),
    zoom: 10,
    mapTypeId: google.maps.MapTypeId.HYBRID
  }
  // show the marker
  var map = new google.maps.Map(mapHolder, mapOptions),
    marker = new google.maps.Marker({
      position: mapOptions.center
    })
  marker.setMap(map)
}

// *********** Click on menu-name proccess ***********
  menuName.on('click', function(e){
  $('.collapse').removeClass('in')
    // changes the values with the city name
  city.text($(e.target).data('name'))

  // the event target element text
  q = $(e.target).data('name')

  // calls to functions
  hourlyWeather(q)
  tenDaysWeather(q)

  // the event target element data
  lat = $(e.target).data('lat')
  lon = $(e.target).data('lon')
  myCityMap(lat, lon)
  })


// *********** Click on hit proccess ***********
$('#suggestionsUl').on('click', '.hit', function (e) {
  // uses a parent element to fire the event on dynamicly created element

  inpt.value = $(e.target).text()
  // changes the values with the city name
  city.text($(e.target).text())

  // DOM manipulation
  sugg.style.display = 'none'

  // the event target element text
  q = $(e.target).text()

  // calls to functions
  hourlyWeather(q)
  tenDaysWeather(q)

  // the event target element data
  lat = $(e.target).data('lat')
  lon = $(e.target).data('lon')
  myCityMap(lat, lon)
})

// *********** Click on search-button proccess ***********
$('#searchBtn').on('click', function () {
  // DOM manipulation
  sugg.style.display = 'none'

  q = inpt.value

  var url = 'http://autocomplete.wunderground.com/aq?query=' + q + '&c=SE&cities=&cb=?'
  $.ajax({
    url: url,
    dataType: 'jsonp',
    crossDomain: true,
    success: function (resp) {
      var cityInfo = []
      // takes the results and pusses them to an empty array
      for (var i = 0; i < resp.RESULTS.length; i++) {
        var cityHit = resp.RESULTS[i].name.split(',', 1)
        cityInfo.push(cityHit[0], resp.RESULTS[i].lat, resp.RESULTS[i].lon)
      }


      for (var y = 0; y < cityInfo.length; y += 3) {
        // slices the array in groups of three elements
        var cityArr = cityInfo.slice(y, y + 3)
        var c = cityArr
        // compares the 0 value of every 'sliced' array... 
        if ((q.toLowerCase()) == (c[0].toLowerCase())) {
          lat = c[1]
          lon = c[2]
          city.text(c[0])

          // empty the container on every call
          sugg.innerHTML = ''

          // calls to the functions
          hourlyWeather(q)
          tenDaysWeather(q)
          myCityMap(lat, lon)
          // if the city name is equal it breakes the loop
          break
        }else {
          sugg.innerHTML = ''
        }
      }
    }
  })
})

// *********** Show the year ***********
var d = new Date(),
  y = '- ' + d.getFullYear()
document.getElementById('dateYear').innerHTML = y

// *********** Global function on every ajax call ***********
// on the first Ajax request, the loader shows up
$(document).ajaxStart(function () {
  $('.loader').show('slow')
})
  // when all the requests have complete, the loader hides
  .ajaxSuccess(function () {
    $('.loader').hide('slow')
  })
