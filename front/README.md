# This is a work in progress; more info will be added to this readme incrementally.

A spirograph generator that allows some wacky params.

This system allows nested cycloid relationship. With this, you can produce a seemingly random pattern than, despite its superficial
randomness, is guaranteed to NOT be random, thanks to the base cycloid that is bound by the static circle.

# The Architecture

There are three main cycloid classes, each created to serve different purposes.

1. CycloidControls
2. DrawNode
3. Cycloid

We'll gloss over why the three are necessary first, and then we'll look each of these more in detail.

TODO

# The Controls

## Relationship Editor

For generating the tree graph for the relationship editor.

### Positioning

All nodes are iterated over once and stored in a Record inside the DrawNodeLevel instance as a property.

The levels are a list of objects, where each object is a level.
Using a manager like levels, in which, the nodes are stored in maps.
is better in that all we can retrieve some information related to any node at almost _O(1)_ time.

For example, we can retrieve all the nodes at level 3 at _O(1)_ time
to calculate the X position by checking if they have the same parents before we draw them.

With breadth-first, all nodes in the previous levels will have to be traversed to find the nodes at the level we want.

To use BFS, we'd also need to know a node's children, which is not possible with the current implementation.
The current implementation is modeled after the physical spirograph relationship,
where the child knows its parent, not vice versa. And this also helps with drawing, as we need to know
the parent's position to draw the child and whether we should offsetX when there are multiple nodes that
share the same parent.

#### Drawing

For drawing, the current implementation is capable of drawing both depth-first and breadth-first.
We are doing breadth-first.

# Examples

![Example 1](example-images/ex1.png)
![Example 2](example-images/ex2.png)
![Example 3](example-images/ex3.png)
![Example 4](example-images/ex4.png)
![Example 5](example-images/ex5.png)

This project has no dependencies other than React and, regrettably, Tailwind (I hate this crap). The drawing api is just plain html5's canvas api.
