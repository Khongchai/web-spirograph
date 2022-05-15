- Showing and tracing all cycloids should be separate options.
- clear all event listeners when one of the canvases is disposed.
- Pause offloading stuff to instantdrawercycloidParams and make it work first cus I think we might need to offload the tracing to another canvas entirely. => now working on another canvas

- Right now, the worker cannot clone the entire CycloidControls object because some of the properties are functions. However, we don't actually need all of that anyway and we should make a separate object for the request that has only the required properties for generating the points.

- Instant mode <<
- Some rotation interaction? << not sure >>
- Take care of resize for the stars.

- New landing page
  Translate 3d coordinate to 2d screen position. <<< you will need this anyway for the mouse thing. This is useful to know too for future 3js references.>>>
  Find out why after expanding, everything kind of get attracted to the center.
  Continue with rotation.

- Package it nicely by composing a music for the application.

- Save state

Write tests for the generateNodes -- kinda complicated

Make the rerender toggle global.

A better folder structure, please.

Refactor tooltip out as a wrapper so that you can use it with anything.

Instant draw: or instead of this, make the bg stars do the final shape.....

The ability to change colors

use another cycloid as the base for drawing.

Node as control for cycloid relationship.
