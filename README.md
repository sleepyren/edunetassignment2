# RectangleDrawer

RectangleDrawer is a JavaScript class that allows users to draw and resize rectangles in the browser. Users can create rectangles by clicking and dragging, and resize them by grabbing their borders or corners.

## Features

Draw rectangles by clicking and dragging
Resize rectangles by grabbing their borders or corners
Display rectangle dimensions while drawing & resizing
Minimum rectangle size of 10x10 pixels
Handles window resizing and scrolling

# Resizing

## Corners

Each corner of a rectangle can be used to resize it. The corners are identified and calculated using Gauss' area formula (also known as the shoelace formula). The four corners are:

1. Top-left corner: Changes both the width and height, as well as the top and left position.
2. Top-right corner: Changes both the width and height, as well as the top position.
3. Bottom-right corner: Changes both the width and height.
4. Bottom-left corner: Changes both the width and height, as well as the left position.

## Borders 

Each border of a rectangle can also be used to resize it. The borders are:

1. Top border: Changes the height and the top position.
2. Right border: Changes the width.
3. Bottom border: Changes the height.
4. Left border: Changes the width and the left position.

## Use!

To see the RectangleDrawer in action, open the HTML file in your browser and use the mouse to draw and resize rectangles.