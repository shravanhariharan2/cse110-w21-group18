# Requirements

## Basic Pomodoro timer
* Start button for starting initial work session
* Stop button to stop work session
  * Should set timer to 0

## To-do List
* Text input for task name
* Number input for # Pomodoros for each task
  * 1 Pomodoro =  25 minutes work + 5 minute break
* Text input for notes
  * Can add to-dos initially and during the sessions

## Automated work/breaks
* 25 minutes of work immediately followed by 5 minutes break (automatically starting after work session ends)
* After 5 minutes of break, timer then stops and waits for user to start next Pomodoro
* After 4 Pomodoro sessions, a longer 30 minute break is started
* Finally, after the longer 30 minute break, the user can start another session
* User can check a box to specify if they want to auto-start work sessions after breaks (so there's no stopping after the 5 minutes)


## Distraction metrics
* If a user gets distracted during a Pomodoro session, they can optionally mark down that distraction (as a count) on that current task


## Activity metrics
* When a user checks off a task, the number of actual Pomodoros it took to complete the task is recorded
* Users can open up an activity window to see expected vs. actual Pomdoros for each task
* Total work time is displayed
* Number of distractions is displayed per task
* Total number of distractions is displayed