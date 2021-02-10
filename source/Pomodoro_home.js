// times that we will want to count down from

const POMO_TIME = 25;

const SHORT_BREAK = 5;

const LONG_BREAK = 15;

//displays time on html
function setTime(minutes, seconds){
    //two digits nums for mins and secs
    document.getElementById("time").innerHTML = minutes.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
         + " : " + seconds.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
}

// function to actually run the timer with input length
function startTimer(durationInMinutes){
    //starting time
    let minutes = durationInMinutes-1;
    let seconds = 59;
    let finished = false;
    //runs every second
    let timer = setInterval(function() {
        setTime(minutes, seconds);
     
        if (seconds <= 0) {
            minutes --;
            seconds = 60;
            if (minutes < 0) {
                finished = true;
            }
        }
        seconds--;
        if (finished == true){
            clearInterval(timer);
            return;
        }
    }, 1000);
    startButton.disabled = false;
}
//this is what we will call for starting a pomo
let startButton = document.getElementById("start");
startButton.addEventListener("click", function(){
    startTimer(POMO_TIME);
    startButton.disabled = true;
});
