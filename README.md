# Sweather
Weather app for Swedish weather http://www.ruserious.se/sweather/index.html

## Info
This is the kick-of version of Sweather. It started as a school project in JavaScriptutvecklare-Frontend_distans_2016 from Stockholm as one of Lernia's courses.

In this first version only temperature info is presented. As the app is developed more info will be added.

###Description
The styling of the app was meant to be simple but effective also. Due to the purpose of the app the focus is putted on the Ajax calls. Here are a few words about the development process.
####Styling
- This page is based on HTML5 and CSS3 standards. 
- I have used Bootstrap v.3 framework for the menu and styling, especially the grid styling system.
- The SASS pre-processor has been used, with some benefits that SASS has to offer. 
- I 've used media-queries inside the sass code for specific styles.
- To set the SASS pre-processor on VS Code, I used Gulp to set and run the task.

####Ajax calls – APIs
-	The app sends XMLHttpRequest(xhr) calls to five different APIs.

i. When it loads, the first request is sent to the http://api.ipinfodb.com/v3/ . The response is a json string with info based on the client’s IP number. The name of the city and the latitude and longitude are sent as parameters to

ii. the second api http://api.wunderground.com/api/hourly/ which responds with a json string of the hourly weather forecast of the chosen city,

iii. the third api http://api.wunderground.com/api/forecast10day/ which responds with a json string including a 10day weather forecast and

iv. the fourth api https://maps.googleapis.com/maps/api/ which responds with a jsonp callback function from googlemaps. 

To pass the SOP, all the above APIs need a user key to respond back.

v. Finally the fifth request takes place when the user is typing a city in the input field. The API being called is http://autocomplete.wunderground.com/aq . This doesn’t need a user key to respond but the response is a jsonp callback and the data is already parsed to a json string. In its turn when the user clicks on a suggestion the calls ii, iii and iv are implemented. 

The same process is executed when the user clicks on the search button or on a city name on the static menu. 

- A loader appears on every ajax call and disappears when all the calls succeed.

####DOM Manipulation
- Regarding the DOM, I 've used the jQuery library to insert effects and style elements.

The project is developed entirely by me, Theo Matskas,
linkedIn: https://www.linkedin.com/in/theo-matskas-40600b32

####ToDo list – Buggs
- The next step is to make the menu dynamic with favorite cities a user saves. This needs a database and a multiuser control.
- The app's biggest problem is the language. It must be found a way all the words on the screen would be in Swedish.
- A problem appears also on cities which have the same name i.e. Lund.
- Create an exception when the response lacks of info i.e. Umea.
