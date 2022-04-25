# In progress

- Trying to refactor everything to an offscreen-canvas (run the app and you'll know from where to continue).

# Notes

- Resizing might not reset canvas's size as all widths and heights are currently static.

- If deep copy poses some problems, then we'll have to abuse useEffect and custom dispatch function to trigger changes to the onMessage mapper -- but just focus on the migration for now. And if that is the case then we actually don't even need react MutableRefs anymore.

## TODO

- Experiment with offscreen canvas

- Move all context provider to App.tsx.

- refactor folder structures, especially utils folder.

- New landing page

- Package it nicely by composing a music for the application.

- Save state

Write tests for the generateNodes -- kinda complicated

Make the rerender toggle global.

A better folder structure, please.

Refactor tooltip out as a wrapper so that you can use it with anything.

Instant draw

Canvas // eventlistener multi-threading for better performance. Watch out for non-atomic operations.
https://medium.com/techtrument/multithreading-javascript-46156179cf9a

The ability to change colors

use another cycloid as the base for drawing.

Node as control for cycloid relationship.
