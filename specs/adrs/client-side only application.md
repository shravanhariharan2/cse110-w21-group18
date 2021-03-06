# Client-side vs Server-side

## Status
Accepted

## Context
Applications can be computationally heavy and therefore server-dependent. Because our application is not computationally
heavy, we decided to forgo implementing a server-side backend.

## Decision
Implement all application functionality as client-side scripts. Use local-storage for per user metric logging.

## Consequences
- Removes the development overhead of writing a backend.
- Decreases the code complexity for logging metrics:
  - localStorage is easier to interact with
- Decreases interaction latency when viewing metrics:
  - does not need to fetch and read data from a remote
- metric logs are less secure:
  - stored as unprotected local storage
  - Not logging identifying data, so information security is not a priority
