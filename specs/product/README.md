# Product Info

This product is a Pomodoro timer with the ability to easily structure, control, and automate users' productivity sessions at their will. The application is built to be intuitive, customizable, and efficient to integrate into any user’s workflows. It includes features such as automated Pomodoro sessions, task management, distraction markers, and other smaller tools for ease of customizability.

## The Pomodoro technique
The Pomodoro technique is a method of time management used to break the user's work sessions into smaller intervals of work immediately followed by break sessions. The idea is to make the process of working healthier and more digestable, and thus more productive for the user.

This timer defaults to the standard specs of work/break sessions that are described in the Pomodoro source:
* 25 minutes of work
* 5 minutes of break
* After 4 work sessions, a longer, 30 minute break

These exact numbers can be customized by the user in the settings popup on the top-right corner of the screen.

## Pomodoro Sessions
In this app, Pomodoro sessions are automated, in that immediately after 25 minutes of work, 5 minutes of break time is started. This automation allows the user to not worry about interacting with the application and instead give more focus to the work that they are doing and the time they have remaining. 

Note that this automation can be enabled/disabled in the settings.

## Tasks

This app also supports the management of tasks as an embedded to-do list that is integraded into the Pomodoro technique itself.

The user can add, edit, and remove tasks on the right side of the screen, and can select tasks that they want to work on for a session to bring that task to focus. 

The task mechanism automatically keeps track of how many sessions (i.e. how many 25 minute intervals) have been worked on for each task. This allows users to keep track of their expected vs. actual number of sessions before completion of any tasks they work on. A task's session count only if a work session has been exhausted on that task's selection.

## Distraction Markers
The option to keep track of the number of distractions encountered during a session/task is provided via. the distraction marker functionality. One of the principles of the Pomodoro technique is noting down distractions when one is encountered to help the user gauge their overall attention level over time.

During a work session, if a user gets distracted for any reason, they can click the thought-bubble icon on the top-right corner of the screen to increment the distraction count for the current task. Distraction counts are reset after completion of a task, and are stored within each task card for every task completed.

## Settings

As mentioned earlier, there are a few settings that the user can customize within the settings pane on the top-right corner of the screen. These include the lengths of sessions, the number of sessions before long breaks, and other boolean options for the timer and notifications.
