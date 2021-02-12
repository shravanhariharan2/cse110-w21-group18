// times that we will want to count down from

const POMO_TIME = 25;

const SHORT_BREAK = 5;

const LONG_BREAK = 15;

const NUM_OF_SESSIONS_IN_POMO = 4;

let sessionNumber = 0;
let isBreak = false;

//listens to start initial pomo session
let startButton = document.getElementById("start");
startButton.addEventListener("click", startSession);


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
    let endedEarly = false;

    //runs every second
    let timer = setInterval(function() {

        setTime(minutes, seconds);

        //listens to end the timer
        let eventListenerAdded = false;
        if (!eventListenerAdded) {
            startButton.addEventListener("click", endSession);
            eventListenerAdded = true;
        }
        //function to update variables to indicate early session termination
        function endSession() {
            finished = true;
            eventListenerAdded = false;
            startButton.disabled = false;
            endedEarly = true;
            startButton.removeEventListener("click", endSession);
        }

        //end timer
        if (finished == true){
            clearInterval(timer);
            //go to next session
            if (!endedEarly) {
                //update session indicators
                if (isBreak) {
                    isBreak = false;
                }
                else {
                    sessionNumber++;
                    isBreak = true;
                }
            }
            updateUIForSessionEnd();
            document.getElementById("start").value = "Start";
            startButton.addEventListener("click", startSession);
            return;
        }
     
        if (seconds <= 0) {
            minutes --;
            seconds = 60;
            if (minutes < 0) {
                finished = true;
            }
        }
        seconds--;

    }, 1000);
    startButton.disabled = false;
}

//this is what we will call for starting a timer session
function startSession() {
    startButton.removeEventListener("click", startSession);
    document.getElementById("start").value = "End";
    startButton.disabled = false;

    //start pomo session
    if (!isBreak) {
        startTimer(POMO_TIME);
    }
    else {
        //start short break
        if (sessionNumber != NUM_OF_SESSIONS_IN_POMO) {
            startTimer(SHORT_BREAK);
        }
        //start long break
        else {
            startTimer(LONG_BREAK);
            sessionNumber = 0;
        }
    }
};

//this is what we will call for updating UI elements
function updateUIForSessionEnd() {
    document.getElementById("pomo").style.textDecoration = "none";
    document.getElementById("short-break").style.textDecoration = "none";
    document.getElementById("long-break").style.textDecoration = "none";
    
    //is pomo session
    if (!isBreak) {
        document.getElementById("timer-box").style.background = "#9FEDD7";
        document.getElementById("pomo").style.textDecoration = "underline";
        setTime(POMO_TIME, 0);
    }
    else {
        //is short break
        if (sessionNumber != NUM_OF_SESSIONS_IN_POMO) {
            document.getElementById("timer-box").style.background = "#FEF9C7";
            document.getElementById("short-break").style.textDecoration = "underline";
            setTime(SHORT_BREAK, 0);
        }
        //is long break
        else {
            document.getElementById("timer-box").style.background = "#FCE181";
            document.getElementById("long-break").style.textDecoration = "underline";
            setTime(LONG_BREAK, 0);
        }
    }
}