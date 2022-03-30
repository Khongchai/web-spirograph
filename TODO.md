bug => Error when adding a new cycloid.

Continue refactoring for logic encapsulation before moving on to removing or adding cycloid. // Look for todo in cycloidControls

Try writing tests for each of the utils as a start.

Instead of a show-all button, make it so that you can kind of choose what to show and what not to show.

Bug: Left nodes can't be dragged to the right, while right nodes always can be dragged over the left ones.... << postion alignment problem

Bug: Nodes position in relationshipManager bug. Check to see if it is caused by the new sorting method.

Can now drag and drop but circles still won't rerender

BoundingCircle should be able to be used as the parent, but not child

Move nodes => continue in svgCircle.tsx // on rerender, circles do not rerender, but lines do...

Write tests for the generateNodes -- kinda complicated

Current cycloid should be multi-selection

Make the rerender toggle global.

A better folder structure, please.

reset canvas

Draw with dotted lines

Refactor tooltip out as a wrapper so that you can use it with anything.

Instant draw

Ability to add or remove cycloid

Canvas // eventlistener multi-threading for better performance. Watch out for non-atomic operations.
https://medium.com/techtrument/multithreading-javascript-46156179cf9a

The ability to change colors

use another cycloid as the base for drawing.

Node as control for cycloid relationship.
