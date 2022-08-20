The scale for the stars and the instant drawer.

Fetch for current user configs.

After fetching, the UI state for the configs should reflect the fetched result.

After logging out, the UI state should return to the default value.

Algo for determining the complexity of a shape (we need to find out how many points to draw) but also clamp it at some value because otherwise for some shapes, it'll just take forever.

> > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > >

Write test a test for the instant.tsx Look for todo in instantDrawerCanvas test, once that's done, work on the rerender of the instantdrawer canvas and then springboot time!<<< After this, integrate the otp thing for now.

An algorithm that determines the complexity of the shape so that we can give it the appropriate amount of points to draw.

Able to save and load configurations. // Maybe have a simple backend service for this? (requires authentication, of course, should be done with GO maybe).

Unit tests...?

Apply the instantdrawermapper so that we can change only the value that really changed.

- Refactor pan and zoom out as they don't really need to be a part of the whole instant or animated draw thing.

- Right now, the worker cannot clone the entire CycloidControls object because some of the properties are functions. However, we don't actually need all of that anyway and we should make a separate object for the request that has only the required properties for generating the points.

- Instant mode <<
- Some rotation interaction? << not sure >>
- Take care of resize for the stars.

- New landing page
  Translate 3d coordinate to 2d screen position. <<< you will need this anyway for the mouse thing. This is useful to know too for future 3js references.>>>
  Find out why after expanding, everything kind of get attracted to the center.
  Continue with rotation.

- Package it nicely by composing music for the application.

- Save state

Write tests for the generateNodes -- kinda complicated

Refactor tooltip out as a wrapper so that you can use it with anything.

Instant draw: or instead of this, make the bg stars do the final shape.....

The ability to change colors

use another cycloid as the base for drawing.

Node as control for cycloid relationship.
