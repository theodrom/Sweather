//
//
'use strict'

var ic = $("#weatherIcon"),
    btn = $("#btn"),
    e = "";
$(window).on('load', function() {
    $.getJSON("http://api.wunderground.com/api/4c0fff77b0215157/hourly/lang:SW/q/Sweden/Lulea.json", function (data) {
        ic.attr('src', data.hourly_forecast[0].icon_url);
    //$("#cityName").html(data.hourly_forecast[0].);
    $("#curCondition").html(data.hourly_forecast[0].condition);
    $("#curTemp").html(data.hourly_forecast[0].temp.metric + '°');
    $("#curDay").html(data.hourly_forecast[0].FCTTIME.weekday_name);
    $("#curHighestTemp").html(data.hourly_forecast[0].dewpoint.metric + '°');

    for(var i = 0; i <25; i++){

        
           e += "<h5>" + data.hourly_forecast[i].FCTTIME.hour + "</h5>"
           e += '<img id="weatherIcon" src="' + data.hourly_forecast[i].icon_url + '" alt="">'
           e += '<h5 id="highestTemp">' + data.hourly_forecast[i].temp.metric + '°' + '</h5>'
        
    }
$("#hourInfo-holder").append(e);

    });
})