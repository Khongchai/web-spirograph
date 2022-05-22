Look for TODO in instant.tsx
Right now this the instant drawer worker does not work so migrate this entire project to a newer version of react.

1. Draw with equation on the main thread.
2. Focus on instant draw canvas on the worker thread and don't do anything else just yet. Draw with equation seems to be the best....

Able to save and load configurations. // Maybe have a simple backend service for this? (requires authentication, of course, should be done with GO maybe).

Unit tests...?

- Refactor pan and zoom out as they don't really need to be a part of the whole instant or animated draw thing.

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

Refactor tooltip out as a wrapper so that you can use it with anything.

Instant draw: or instead of this, make the bg stars do the final shape.....

The ability to change colors

use another cycloid as the base for drawing.

Node as control for cycloid relationship.
