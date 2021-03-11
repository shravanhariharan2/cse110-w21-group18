# CSS and HTML modification in JS

## Status
Accepted

## Context
Some dynamic content is easier to implement as an inline style change in JS than as a separate class in CSS/html. These dynamic features often change minimally and are based on the current state of a running function. We feel that it is more intuitive to modify these features along with its dependent function rather than simply modifying the CSS classes and specifying the actual styles within the CSS. Since these changes are generally small, the overhead difference is negligible.

## Decision
For some dynamic content (i.e. Session state labels, button text, current timer status), we change their corresponding CSS/html with inline JS scripting (setting innerHTML, or textStyle).

## Consequences
- Reduces development overhead for dynamic content
- Worsens code readability slightly by mixing style/html changes with functionality all in the same file
