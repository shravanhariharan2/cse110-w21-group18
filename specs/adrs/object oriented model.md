# Object Oriented Application Model

## Status
Accepted, implemented

## Context
Currently, our program model follows a "function" only model, similar to scripting. Initially, "function" only coding
can easily gauge/verify the feasibility of an application, but in the long run, is harder to test and more importantly
harder to improve upon. Adopting and object oriented model increases the code complexity in the short term but
significantly increases the ability to test and improve our code.

## Decision
The current application should be refactored into the following classes:
- A session class which handles running a timer and session related fields
  - decides between "work", "rest", "long-rest/idle"
  - automatically sets and runs the timer (interprets the applications state machine)
- A timer class that handles running a timer
  - the timing function should be asynchronous
  - configurable time resolution

## Consequences
- Unit testing becomes easier
- Adding more modules/classes become easier
- conceptualizing the application model (and data flow) become slightly more complex
  - async functions are harder to understand but improve program modularity
- Writing applications become slightly more complex
