
class rectangleDrawer
{

//operating modes
//-1 = wait
//0 = create
//1 = border grab
//2 = corner grab

coord(x,y)  
{
return {x:x, y:y};
   
}

init()
{
    this.sensitivity = 8;


    this.dimensionBox = document.createElement("div");
    this.dimensionBox.className = 'dimension-box';
    this.operatingMode = -1;
    this.currNode = null;
    this.createdNodeStartPos = null;
    this.cornerOrSide = -1;
    //this.exampleDiv.appendChild(dimensionBox);
  //  dimensionBox.innerText = '50 x 50';

    //add event listeners here

    //bind() is used to create a new function with 
    //a specific this value and optionally initial arguments.
    document.addEventListener('mousedown', this.scanForDivGrabs.bind(this));
    document.addEventListener('mousedown', this.addDimensionBox.bind(this));


    document.addEventListener('mousemove', this.handleMouseMove.bind(this) )

    document.addEventListener('mouseup', this.handleMouseUp.bind(this) )



    

}

//find area of a triangle by its 3 points
// Gauss' area formula / shoelace formula (determinant method)
// https://math.stackexchange.com/questions/516219/finding-out-the-area-of-a-triangle-if-the-coordinates-of-the-three-vertices-are
//function shoelaceFormula(x1,y1,x2,y2,x3,y3)
Area(coord1, coord2, coord3) 
{
   // console.log(coord1,coord2,coord3);
    return Math.abs(coord1.x * (coord2.y - coord3.y) + coord2.x * 
(coord3.y - coord1.y) + coord3.x * (coord1.y - coord2.y) ) / 2;

}



drawRectangle(xPos, yPos, width, height)
{
    const div = document.createElement("div");
    div.style.height = height + 'px';
    div.style.width = width + 'px';
    div.style.left = xPos + 'px';
    div.style.top = yPos + 'px';
    div.className = 'rectangle'
    return document.body.appendChild(div);
}

// If it is a corner, return the corner type (0 to 3), else return -1
isCorner(div, currPos) 
{
    const domRectangle = div.getBoundingClientRect();

    // Check for each corner
    const nearTopLeftCorner = this.shouldCalculateTriangleAreas(currPos, domRectangle, 0);
    const nearTopRightCorner = this.shouldCalculateTriangleAreas(currPos, domRectangle, 1);
    const nearBottomRightCorner = this.shouldCalculateTriangleAreas(currPos, domRectangle, 2);
    const nearBottomLeftCorner = this.shouldCalculateTriangleAreas(currPos, domRectangle, 3);

    if (nearTopLeftCorner) {
        const cornerPos = this.coord(domRectangle.left, domRectangle.top);
        if (this.trianglesAreEqual(currPos, cornerPos, 0)) return 0; // Top-left corner
    } else if (nearTopRightCorner) {
        const cornerPos = this.coord(domRectangle.right, domRectangle.top);
        if (this.trianglesAreEqual(currPos, cornerPos, 1)) return 1; // Top-right corner
    } else if (nearBottomRightCorner) {
        const cornerPos = this.coord(domRectangle.right, domRectangle.bottom);
        if (this.trianglesAreEqual(currPos, cornerPos, 2)) return 2; // Bottom-right corner
    } else if (nearBottomLeftCorner) {
        const cornerPos = this.coord(domRectangle.left, domRectangle.bottom);
        if (this.trianglesAreEqual(currPos, cornerPos, 3)) return 3; // Bottom-left corner
    }

    return -1;
}

// Check if the cursor is trying to grab the border, excluding corners
isBorderGrab(div, currPos) 
{
    const domRectangle = div.getBoundingClientRect();
    const sensitivity = this.sensitivity;
    
    // Top border (excluding left and right sensitivity areas)
    if (currPos.y >= domRectangle.top - sensitivity && currPos.y <= domRectangle.top + sensitivity &&
        currPos.x > domRectangle.left + sensitivity && currPos.x < domRectangle.right - sensitivity) {
        return 0; // Top
    }

    // Right border (excluding top and bottom sensitivity areas)
    else if (currPos.x >= domRectangle.right - sensitivity && currPos.x <= domRectangle.right + sensitivity &&
        currPos.y > domRectangle.top + sensitivity && currPos.y < domRectangle.bottom - sensitivity) {
        return 1; 
    }

    // Bottom border (excluding left and right sensitivity areas)
    else if (currPos.y >= domRectangle.bottom - sensitivity && currPos.y <= domRectangle.bottom + sensitivity &&
        currPos.x > domRectangle.left + sensitivity && currPos.x < domRectangle.right - sensitivity) {
        return 2;
    }

    // Left border (excluding top and bottom sensitivity areas)
    else if (currPos.x >= domRectangle.left - sensitivity && currPos.x <= domRectangle.left + sensitivity &&
        currPos.y > domRectangle.top + sensitivity && currPos.y < domRectangle.bottom - sensitivity) {
        return 3;
    }

    return -1;
}

isWithinRectangle(currPos, topLeftCoord, bottomRightCoord) 
{
    const validX = currPos.x >= topLeftCoord.x && currPos.x <= bottomRightCoord.x;
    const validY = currPos.y >= topLeftCoord.y && currPos.y <= bottomRightCoord.y;

    return validX && validY;
}

// Boolean for if the cursor is close enough to corner to calculate shaded region
// Parameters = div.getBoundingClientRect(), corner type (0: topLeft, 1: topRight, 2: bottomRight, 3: bottomLeft)
shouldCalculateTriangleAreas(currPos, domRectangle, cornerType) 
{
    let point;
    if (cornerType === 0) {
        point = this.coord(domRectangle.left, domRectangle.top);
    } else if (cornerType === 1) {
        point = this.coord(domRectangle.right, domRectangle.top);
    } else if (cornerType === 2) {
        point = this.coord(domRectangle.right, domRectangle.bottom);
    } else if (cornerType === 3) {
        point = this.coord(domRectangle.left, domRectangle.bottom);
    }

    let topLeftProjection = this.coord(point.x - this.sensitivity, point.y - this.sensitivity);
    let bottomRightProjection = this.coord(point.x + this.sensitivity, point.y + this.sensitivity);

    return this.isWithinRectangle(currPos, topLeftProjection, bottomRightProjection);
}

// Add the two triangles' partial values and compare to the isosceles triangle
trianglesAreEqual(currPos, cornerPos, cornerType) 
{
    const targetArea = (this.sensitivity ** 2) / 2;

    let xProjection1, yProjection1, xProjection2, yProjection2;

    if (cornerType === 0 || cornerType === 2) { // Top-left or Bottom-right corner
        xProjection1 = this.coord(cornerPos.x - this.sensitivity, cornerPos.y);
        yProjection1 = this.coord(cornerPos.x, cornerPos.y - this.sensitivity);
        xProjection2 = this.coord(cornerPos.x + this.sensitivity, cornerPos.y);
        yProjection2 = this.coord(cornerPos.x, cornerPos.y + this.sensitivity);
    } else if (cornerType === 1 || cornerType === 3) { // Top-right or Bottom-left corner
        xProjection1 = this.coord(cornerPos.x + this.sensitivity, cornerPos.y);
        yProjection1 = this.coord(cornerPos.x, cornerPos.y - this.sensitivity);
        xProjection2 = this.coord(cornerPos.x - this.sensitivity, cornerPos.y);
        yProjection2 = this.coord(cornerPos.x, cornerPos.y + this.sensitivity);
    }

    const t1PartialArea1 = this.Area(currPos, xProjection1, cornerPos);
    const t1PartialArea2 = this.Area(currPos, xProjection1, yProjection1);
    const t1PartialArea3 = this.Area(currPos, yProjection1, cornerPos);

    const t2PartialArea1 = this.Area(currPos, xProjection2, cornerPos);
    const t2PartialArea2 = this.Area(currPos, xProjection2, yProjection2);
    const t2PartialArea3 = this.Area(currPos, yProjection2, cornerPos);

    const t1Area = t1PartialArea1 + t1PartialArea2 + t1PartialArea3;
    const t2Area = t2PartialArea1 + t2PartialArea2 + t2PartialArea3;

    return t1Area === targetArea || t2Area === targetArea;
}

/*

//returns which mode is active
mode -1 means do nothing when mouse moves


}*/    

initializeCreateMode(currPos)
{
    this.operatingMode = 0;
    this.createdNodeStartPos = currPos;
    const div = document.createElement("div");
    div.className = "rectangle";
    document.body.appendChild(div);
    div.style.left= currPos.x + 'px';
    div.style.top = currPos.y + 'px';
    this.currNode = div;
}

createModeSizeChange(currPos)
{
    //lengths always positive
    const width = Math.abs(currPos.x - this.createdNodeStartPos.x);
    const height = Math.abs(currPos.y - this.createdNodeStartPos.y);
    this.currNode.style.width = width + 'px';
    this.currNode.style.height = height + 'px';


    //if it is less than the original corner in either dimension switch it
    if (currPos.x <= this.createdNodeStartPos.x) this.currNode.style.left = currPos.x + 'px';
    
    if (currPos.y <= this.createdNodeStartPos.y) this.currNode.style.top = currPos.y + 'px';


}

endCreateMode()
{
    const domRectangle = this.currNode.getBoundingClientRect();
    if (domRectangle.height < 10 || domRectangle.width < 10)
        this.currNode.remove();

    this.operatingMode = -1;
    this.currNode = null;
    this.createdNodeStartPos = null;
}

editTopSide(div, newTop) 
{
    const rect = div.getBoundingClientRect();
    const currentBottom = rect.top + rect.height;
    const newHeight = currentBottom - newTop;

    if (newHeight >= 10) {
        div.style.height = newHeight + 'px';
        div.style.top = newTop + 'px';
    }
}

editLeftSide(div, newLeft) 
{
    const rect = div.getBoundingClientRect();
    const currentRight = rect.left + rect.width;
    const newWidth = currentRight - newLeft;

    if (newWidth >= 10) {
        div.style.width = newWidth + 'px';
        div.style.left = newLeft + 'px';
    }
}

editBottomSide(div, newBottom) 
{
    const rect = div.getBoundingClientRect();
    const currentTop = rect.top;
    const newHeight = newBottom - currentTop;

    if (newHeight >= 10) {
        div.style.height = newHeight + 'px';
    }
}

editRightSide(div, newRight) 
{
    const rect = div.getBoundingClientRect();
    const currentLeft = rect.left;
    const newWidth = newRight - currentLeft;

    if (newWidth >= 10) {
        div.style.width = newWidth + 'px';
    }
}

handleBorderGrab(currPos)
{
    const div = this.currNode;
    const side = this.cornerOrSide;

    if (side == 0) this.editTopSide(div, currPos.y);
    else if (side == 1) this.editRightSide(div, currPos.x);
    else if (side == 2) this.editBottomSide(div, currPos.y);
    else if (side == 3) this.editLeftSide(div, currPos.x);

}


handleCornerGrab(currPos)
{
    const div = this.currNode;
    const corner = this.cornerOrSide;

    if (corner==0)
    {
        this.editTopSide(div, currPos.y);
        this.editLeftSide(div, currPos.x);
    }
    else if (corner==1)
    {
        this.editTopSide(div, currPos.y);
        this.editLeftSide(div, currPos.x);
    }

    else if (corner == 2)
    {
        this.editBottomSide(div, currPos.y);
        this.editRightSide(div, currPos.x);
    }

    else if (corner == 3)
    {
        this.editBottomSide(div, currPos.y);
        this.editLeftSide(div, currPos.x);
    }

}

endEditMode()
{
    this.operatingMode = -1;
    this.currNode = null;
    this.cornerOrSide = -1;
}

scanForDivGrabs(event)
{

    const currPos = this.coord(event.clientX, event.clientY);

    for (const div of document.body.children){

        if (window.getComputedStyle(div).position !== 'absolute' 
    || div.tagName !== 'DIV') 
            continue;
        const borderGrab = this.isBorderGrab(div, currPos);
        const cornerGrab = this.isCorner(div, currPos);
        
        if (borderGrab != -1)
        {
            this.operatingMode = 1;
            this.currNode = div;
            this.cornerOrSide = borderGrab;
            //dont start create mode
            return;
        }

        else if (cornerGrab!= -1)
        {
            this.operatingMode = 2;
            this.currNode = div;
            this.cornerOrSide = cornerGrab;
            return;
        }
        //initialize and break if grabbing div or corner
        //break;
    }
    
    this.initializeCreateMode(currPos);
}

handleMouseMove(event)
    {
        //this. will refer to the event if not rebound

        const currPos = this.coord(event.clientX, event.clientY);
        if (this.operatingMode == 0)
            this.createModeSizeChange(currPos);  //create mode

        else if (this.operatingMode == 1)
            this.handleBorderGrab(currPos);
            //resize mode

        else if (this.operatingMode == 2)
            this.handleCornerGrab(currPos);
        
        if (this.operatingMode!=-1)
            this.setDimensionBoxDimensions(this.currNode);

    } 

handleMouseUp(event)
{ //this. will refer to the event if not rebound
    if (this.operatingMode == 0) this.endCreateMode();
    else this.endEditMode();

    //remove dimension box from dom
    this.dimensionBox.remove();

    //else end the edit mode cuz mouse up was triggered by one of the two
}

setDimensionBoxDimensions(div)
{
    const domRectangle = div.getBoundingClientRect();
    const text = domRectangle.width + ' x ' + domRectangle.height;
    this.dimensionBox.textContent = text;
}
addDimensionBox()
{
    this.setDimensionBoxDimensions(this.currNode);
    this.currNode.appendChild(this.dimensionBox);
}



}

/*
function divRectangleObject(xPos, yPos, width, height){
    this.xPos = xPos;
    this.yPos = yPos;
    this.width = width;
    this.height = height;

    */

    var rectDrawer = new rectangleDrawer();
