var history = [];
var dateTime =luxon.DateTime;
var dT= dateTime.now();
var currentCity = "Austin";
var lat, long;
var api = 'dfecf031e9c329254bf19d276d4240d8';

//create array of objects for week
var week = [
    {
        index: 1,
        dateDay: dT.day,
        dateMonth:dT.month,
        dateYear: dT.year,
        temp: "",
        wind: "",
        humidity: "",
        uvindex: ""
    },
    {
        index: 2,
        dateDay: dT.plus({days:1}).day,
        dateMonth:dT.plus({days:1}).month,
        dateYear: dT.plus({days:1}).year,
        temp: "",
        wind: "",
        humidity: "",
    },
    {
        index: 3,
        dateDay: dT.plus({days:2}).day,
        dateMonth:dT.plus({days:2}).month,
        dateYear: dT.plus({days:2}).year,
        temp: "",
        wind: "",
        humidity: "",
    },
    {
       index: 4,
       dateDay: dT.plus({days:3}).day,
       dateMonth:dT.plus({days:3}).month,
       dateYear: dT.plus({days:3}).year,
       temp: "",
       wind: "",
       humidity: "",
    },
    {
        index: 5,
        dateDay: dT.plus({days:4}).day,
        dateMonth:dT.plus({days:4}).month,
        dateYear: dT.plus({days:4}).year,
        temp: "",
        wind: "",
        humidity: "",
    },
    {
        index: 6,
        dateDay: dT.plus({days:5}).day,
        dateMonth:dT.plus({days:5}).month,
        dateYear: dT.plus({days:5}).year,
        temp: "",
        wind: "",
        humidity: "",
    },
]

//get any past history inputs from the local storage
var loadHistory = function(){
    //check to see if there is a history array already created, then sync it
    history = JSON.parse(localStorage.getItem("history"));
    if(history){
        for(i=0; i<history.length(); i++){
            addToHistory(history[i]);
        }
    }
};

//save searches to localStorage
var saveHistory = function (){
    localStorage.setItem("history", JSON.stringify(history));
}

//function to take a string value and create a button under the history list
var addToHistory = function(cityInput){
    //create a button for the search
    var addCity = $("<button>")
        .addClass("history-btn mt-3")
        .text(cityInput);
    //add the city name into the history array
    $("#historyList").append(addCity);
    //reset the input value
    $("#search-input").val("");

    saveHistory();
};

//function to get the current date and fill in the array
var setDates = function(){
    //set banner date
    $("#current-date").text("("+week[0].dateMonth+"/"+week[0].dateDay+"/"+week[0].dateYear+") ");
    //input days in cards
    for (var i=1; i<week.length; i++){
        var month =week[i].dateMonth;
        var day =week[i].dateDay;
        var year =week[i].dateYear;
        $(".day-"+i +" h6").text(month+"/"+day+"/"+year);
    }
}

//In order to use the openweather api to get weather stats, we need to get the lat and lon coordinates of the cities entered
var getLocationApi = function(city){
    var requestLocationUrl = 'https://api.openweathermap.org/geo/1.0/direct?q='+currentCity+'&limit=1&appid=' + api;

    fetch(requestLocationUrl)
        .then(function (response) {
        return response.json();
        })
        .then(function (data) {
            lat = data[0].lat;
            long = data[0].lon;
            getWeather();
        });
}

//uses the oneCall weather API to get the stats for each day of the week
var getWeather = function(){
    var requestCurrentUrl = 'https://api.openweathermap.org/data/3.0/onecall?lat='+lat+'&lon='+long+'&exclude=hourly,minutely,alerts&units=imperial&appid='+ api;

    fetch(requestCurrentUrl)
        .then(function (response) {
        return response.json();
        })
        .then(function (data) {
            console.log(data);
            for(var i=0; i<6;i++){
                week[i].temp = data.daily[i].temp.day;
                week[i].wind = data.daily[i].wind_speed;
                week[i].humidity = data.daily[i].humidity;
                week[i].uvindex = data.daily[i].uvi;
            }
    });
}

//will update the page information with the new stats
var updateInfo = function(index){
    //get a degree icon
    // $('span').addClass('degreeSym')
    //     .text('&#8457');

    // //fist fill in the banner information
    // $('.city-temp').text = week[i].temp + $('.degreeSym') + " F";
    // $('.city-wind').text = week[i].wind + " MPH";
    // $('.city-humidity').text = week[i].humidity + " %";
    // $('#index-fav').text =week[i].uvindex;


}

//event listener to get text inputed in search
$("#search-btn").on("click", function(event){
    event.preventDefault();
    //get the text input
    currentCity = $("#search-input").val();

    //Add the city name into the banner text
    $("#cityName").text(currentCity);    

    //immedietely add the search as a button to refer to later
    addToHistory(currentCity);
    getLocationApi(currentCity);
    updateInfo();
});

setDates();