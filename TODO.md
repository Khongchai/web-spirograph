Pause + continue

reset canvas

Draw with dotted lines

Clearing the canvas doesn't really clear everything

Refactor tooltip out as a wrapper so that you can use it with anything.

Settings for cycloid radius.

turn somthing on or off

New zoom in and out behavior

Allow dragging

Instant draw

The ability to say cycloid should be inside or outside the main circle

Need to come up with custom controls

Note: To allow for nested cycloids, each cycloid must have not be responsible for drawing their parent cycloid. Make a class for circles and then extend drawing and moving abilitites from a shared mixin.

Canvas // eventlistener multi-threading for better performance. Watch out for non-atomic operations.
https://medium.com/techtrument/multithreading-javascript-46156179cf9a

Handle pan with lerp

The ability to change colors

Manage Draggable settings + pass in the steps to increment by
