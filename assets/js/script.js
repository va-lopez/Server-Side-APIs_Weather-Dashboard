var history = [];
var dateTime =luxon.DateTime;
var dT= dateTime.now();
var currentCity = "Austin";
var geo =  [];
var api = 'dfecf031e9c329254bf19d276d4240d8';
var defaultCity = "Austin";

//create array of objects for week
var week = [
    {
        dateDay: dT.day,
        dateMonth:dT.month,
        dateYear: dT.year,
        temp: "",
        wind: "",
        humidity: "",
        uvindex: "",
        icon:""
    },
    {
        dateDay: dT.plus({days:1}).day,
        dateMonth:dT.plus({days:1}).month,
        dateYear: dT.plus({days:1}).year,
        temp: "",
        wind: "",
        humidity: "",
        icon:""
    },
    {
        dateDay: dT.plus({days:2}).day,
        dateMonth:dT.plus({days:2}).month,
        dateYear: dT.plus({days:2}).year,
        temp: "",
        wind: "",
        humidity: "",
        icon: ""
    },
    {
       dateDay: dT.plus({days:3}).day,
       dateMonth:dT.plus({days:3}).month,
       dateYear: dT.plus({days:3}).year,
       temp: "",
       wind: "",
       humidity: "",
       icon: ""
    },
    {
        dateDay: dT.plus({days:4}).day,
        dateMonth:dT.plus({days:4}).month,
        dateYear: dT.plus({days:4}).year,
        temp: "",
        wind: "",
        humidity: "",
        icon: ""
    },
    {
        dateDay: dT.plus({days:5}).day,
        dateMonth:dT.plus({days:5}).month,
        dateYear: dT.plus({days:5}).year,
        temp: "",
        wind: "",
        humidity: "",
        icon: ""
    },
];

var setPage = function(){
    //starting page when user hasn't entered a city yet.
    currentCity = defaultCity;
    $("#cityName").text(currentCity); 
    //insert the stats for the weather of Austin
    getLocationApi(currentCity);
}

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
};

//function to take a string value and create a button under the history list
var addToHistory = function(cityInput){
    //create a button for the search
    var addCity = $("<button>")
        .addClass("history-btn mt-3 btn")
        .text(cityInput)
        .attr({type:"button"});
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
};

//In order to use the openweather api to get weather stats, we need to get the lat and lon coordinates of the cities entered
var getLocationApi = function(city){
    var requestLocationUrl = 'https://api.openweathermap.org/geo/1.0/direct?q='+city+'&limit=1&appid=' + api;
    var coordinates;
    fetch(requestLocationUrl)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            coordinates=[data[0].lat,data[0].lon];
            getWeather(coordinates);
        });
};

//uses the oneCall weather API to get the stats for each day of the week
var getWeather = function(coordinates){
    var requestCurrentUrl = 'https://api.openweathermap.org/data/3.0/onecall?lat='+coordinates[0]+'&lon='+coordinates[1]+'&exclude=hourly,minutely,alerts&units=imperial&appid='+ api;

    fetch(requestCurrentUrl)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            for (var i = 0; i <6; i++) {
                week[i].temp = data.daily[i].temp.day;
                week[i].wind = data.daily[i].wind_speed;
                week[i].humidity = data.daily[i].humidity;
                if (i==0)
                    week[i].uvindex = data.daily[i].uvi;
                week[i].icon = data.daily[i].weather[0].icon;
                console.log(week[i].icon);
            }
            updateInfo();
        });
};

var updateUVColor = function(){
    var scale = week[0].uvindex;
    if(scale<3)
        $('.index').attr("id","index-fav");
    else if(scale>=3 && scale <8)
        $('.index').attr("id","index-mod");
    else
        $('.index').attr("id","index-severe");
}

//will update the page information with the new stats
var updateInfo = function(index){
    for(var i=0; i<6;i++){
        $('.day'+i+'-temp').text('Temp: '+week[i].temp +'°');
        $('.day'+i+'-wind').text('Wind: '+week[i].wind +' MPH');
        $('.day'+i+'-humidity').text('Humidity: '+week[i].humidity +" %");
        //<img class="w-icons"></img>
        console.log(week[i].icon);
        $('.day'+i+'-icons').attr('src','http://openweathermap.org/img/wn/'+week[i].icon+'@2x.png');
        if(i===0){
            console.log(week[0].uvindex);
            $('.day0-uv').html('UV index: <span class = "index">'+ week[0].uvindex + '</span>');
            updateUVColor();
        }
    }

};

//event listener to get text inputed in search
$("#search-btn").on("click", function(event){
    event.preventDefault();
    //get the text input
    if(!$('#search-input').val())
        alert("Please enter a valid city name.");
    else{
        currentCity = $("#search-input").val().toLowerCase();

        //make sure that city always displays gramatically correct despite how the user enters it. 
        const cityWords =currentCity.split(" ");
        for(var i=0; i<cityWords.length; i++){
            cityWords [i] = cityWords[i][0].toUpperCase() +cityWords[i].substr(1);
        }
        currentCity = cityWords.join(" ");

        //Add the city name into the banner text
        $("#cityName").text(currentCity);    

        //immedietely add the search as a button to refer to later
        addToHistory(currentCity);
        getLocationApi(currentCity);
    }
});

//listen for click on dynamically created buttons
$(document).on('click', '#historyList .btn', function(){
    var currentCity = $(this).text();
        $("#cityName").text(currentCity); 
        getLocationApi(currentCity);
});

setDates();
setPage();