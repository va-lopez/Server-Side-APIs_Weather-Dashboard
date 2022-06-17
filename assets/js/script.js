var history = [];

//get any past history inputs from the local storage
var loadHistory = function(){
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
    var addCity = $("<button>")
        .addClass("history-btn mt-3")
        .text(cityInput);
    $("#historyList").append(addCity);
    $("#search-input").val("");

    saveHistory();
};

//event listener to get text inputed in search
$("#search-btn").on("click", function(event){
    event.preventDefault();
    var searchCity = $("#search-input").val();
    console.log(searchCity);
    addToHistory(searchCity);
});