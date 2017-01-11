//
//
'use strict'
// Search for city

var inpt = document.getElementById('searchInput'),
  sugg = document.getElementById('suggestions')

inpt.addEventListener('input', function () {
  let cityName = inpt.value,
    hit = ' ',
    empty = 0
  if (cityName.length != 0) {
    empty = ''
  }
  var req = new XMLHttpRequest(),
    content = function () {
      if (req.readyState === 4 && req.status === 200) {
        var resp = JSON.parse(req.response)

        if (cityName.length != 0 && hit != null) {

          for (var i = 0; i < resp.RESULTS.length; i++) {
            hit += '<span class="hit">' + resp.RESULTS[i].name.split(',', 1) + '</span> <br>'
          }
          sugg.innerHTML = ''
          sugg.innerHTML = hit
        }else {
          sugg.innerHTML = ''
        }
      }
  }
  req.onreadystatechange = content
  req.open('GET', 'http://autocomplete.wunderground.com/aq?query=' + cityName + '&c=SE&cities=' + empty, true)
  req.send()
});

    var city = $("#cityName");
    $("#suggestions").on("click", ".hit", function(){
    $(this).each(function(){
    
        inpt.value = $(this).text()
        city.text($(this).text())
        sugg.innerHTML = ''

    // Hourly weather
var ic = $('#weatherIcon'),
  btn = $('#btn'),
  qName = $(this).text();
  
//$("#searchInput").on('change', function () {
    
  $.getJSON('http://api.wunderground.com/api/4c0fff77b0215157/hourly/lang:SW/q/Sweden/' + qName + '.json', function (data) {
    ic.attr('src', data.hourly_forecast[0].icon_url)
    // $("#cityName").html(data.hourly_forecast[0].)
    $('#curCondition').html(data.hourly_forecast[0].condition)
    $('#curTemp').html(data.hourly_forecast[0].temp.metric + '°')
    $('#curDay').html(data.hourly_forecast[0].FCTTIME.weekday_name)
    $('#curHighestTemp').html(data.hourly_forecast[0].dewpoint.metric + '°')
    var e = '';
    for (var i = 0; i < 25; i++) {
      e += '<h5>' + data.hourly_forecast[i].FCTTIME.hour + qName +'</h5>'
      e += '<img id="weatherIcon" src="' + data.hourly_forecast[i].icon_url + '" alt="">'
      e += '<h5 id="highestTemp">' + data.hourly_forecast[i].temp.metric + '°' + '</h5>'
    }
    $('#hourInfo-holder').html(e)
  })
//})
})
})






