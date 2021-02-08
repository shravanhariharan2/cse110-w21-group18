# CSE 110 Group 18 - Meeting X

## Starting Pitch, CI/CD Builds
### Attendees: 
### Details: Zoom @ 10AM PST Sunday 2/7/21

## General Minutes:
* 

## Discussion Points
* Finish Starting Pitch assignment
* Discuss Github Workflow
  * Feature branches
    * We shouldn't push any actual code straight to main (meeting notes is fine), since main should always have properly functioning code
    * When coding, work off a new branch, and commit often
  * Pull requests
    * As soon as you have a working prototype of the feature, push your code to Github and create a PR
    * Request at least 3 people to review the PR
    * We will require only 2 approvals, but the more people you request, the earlier 2 people can get their eyes on your code
    * PRs must pass all CI/CD checks before being merged

* Start CI/CD Build assignment
  * Possible pipeline:
    * Git Push -> Build -> Unit Tests -> Lint -> Generate Docs -> Deploy to Heroku
  * Tasks:
    * Setup CI/CD with Github Actions
    * Create file directories for HTML, CSS, JS, and tests
    * Configure a testing framework (e.g. Jest)
    * Configure a linter (e.g. ESLint)
    * Configure a docs generator (e.g. JSDoc)
    * Configure a free Heroku server
    * Draw diagram of build pipeline
    * Write status report on build pipeline (what works and what doesn't)
    * Record short video on demoing the build pipeline

## Action Items
* 
