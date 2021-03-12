# Singleton Classes and Factory Pattern

## Status
Accepted

## Context

The controllers we use within the codebase are all classes that store references to dependent classes within their instances (e.g. a pomodoro session controller having access to a task list controller). When multiple instances of these controllers are present, duplicate modifications happen within the DOM and local storage, ultimately breaking the functionality of the application. 

## Decision

Controller classes will be refactored to apply the singleton pattern, where at most 1 instance of that class can exist at a time. Controllers that use other controllers will share the same instance of a class so that no duplicate data is written to the DOM/storage. To make this sharing even easier, the singleton factory pattern will be applied, where any class that requires a controller as a dependency can call the factory to obtain a shared instance of that class

## Consequences
- Development overhead increases slightly due to refactoring
- Development difficulty increases slightly due to the introduction of a somewhat-complex design pattern
- Classes can freely be used within the app with the guarantee that no duplicate data will be written
- Memory usage will be more efficient since less instances of objects exist
