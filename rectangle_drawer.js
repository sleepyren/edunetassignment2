

var rectDrawer = new function()
{


this.init = function()
{
    this.sensitivity = 8;
    this.exampleDiv = drawRectangle(100,100,200,200);
    console.log(this.exampleDiv);
    //add event listeners here
    document.addEventListener('mousemove', (event)=>
        {
        this.isCorner(this.exampleDiv, new coord(event.clientX, event.clientY));
        })



    

}

//find area of a triangle by its 3 points
// Gauss' area formula / shoelace formula (determinant method)
// https://math.stackexchange.com/questions/516219/finding-out-the-area-of-a-triangle-if-the-coordinates-of-the-three-vertices-are
//function shoelaceFormula(x1,y1,x2,y2,x3,y3)
this.Area = function(coord1, coord2, coord3) 
{
   // console.log(coord1,coord2,coord3);
    return Math.abs(coord1.x * (coord2.y - coord3.y) + coord2.x * 
(coord3.y - coord1.y) + coord3.x * (coord1.y - coord2.y) ) / 2;

}



function drawRectangle(xPos, yPos, width, height)
{
    const div = document.createElement("div");
    div.style.height = height + 'px';
    div.style.width = width + 'px';
    div.style.left = xPos + 'px';
    div.style.top = yPos + 'px';
    div.className = 'rectangle'
    return document.body.appendChild(div);
}

//if it is a corner return the mode else return false (-1)
this.isCorner = function(div, currPos)
{
    const domRectangle = div.getBoundingClientRect();

    /*
    const northwestTopLeft = new coord(domRectangle.left - this.sensitivity, 
        domRectangle.top - this.sensitivity);

    const northwestBottomRight = new coord(domRectangle.left + this.sensitivity
        , domRectangle.top + this.sensitivity);
        
    const nearTopCorner = isWithinRectangle(currPos, northwestTopLeft, northwestBottomRight);
        
        const southeastTopLeft = new coord(domRectangle.right - this.sensitivity, 
            domRectangle.bottom - this.sensitivity);
            
            const southeastBottomRight = new coord(domRectangle.right + this.sensitivity,
                domRectangle.bottom + this.sensitivity);

    const nearBottomCorner = isWithinRectangle(currPos, southeastTopLeft, southeastBottomRight);
    console.log("area " + this.Area(new coord(domRectangle.left - this.sensitivity
        , domRectangle.top), new coord(
        domRectangle.left, domRectangle.top - this.sensitivity), new
    coord(domRectangle.left, domRectangle.top) ));*/

        const nearTopCorner = this.shouldCalculateTriangleAreas(currPos, domRectangle, true);
        const nearBottomCorner = this.shouldCalculateTriangleAreas(currPos, domRectangle, false);
        if (nearTopCorner) {
           // console.log("Top corner"); 
            const cornerPos = new coord(domRectangle.left, domRectangle.top);
            if (this.trianglesAreEqual(currPos,cornerPos )) console.log("top");
        
        }
        else if (nearBottomCorner) {
            const cornerPos = new coord(domRectangle.right, domRectangle.bottom);
            if (this.trianglesAreEqual(currPos,cornerPos ))  console.log("Bottom");
        }


                




}



function isWithinRectangle(currPos, topLeftCoord,  bottomRightCoord)
{
    const validX = currPos.x >= topLeftCoord.x && currPos.x <= bottomRightCoord.x;
    const validY = currPos.y >= topLeftCoord.y && currPos.y <= bottomRightCoord.y;

return validX && validY;


//no need to check 4 corners just check top left and bottomright bounds
  //  return withinCorner1 && withinCorner2 && withinCorner3 && withinCorner4; 

}

//boolean for if the cursor is close enough to corner to calculate shaded region
//parameters = div.getBoundingClientRect(), boolean
this.shouldCalculateTriangleAreas = function(currPos, domRectangle, checkingNorthWest)
{
    let point;
    if (checkingNorthWest)
        point = new coord(domRectangle.left, domRectangle.top);
    
    else
        point = new coord(domRectangle.right, domRectangle.bottom);  
    
        let topLeftProjection = new coord(point.x - this.sensitivity, point.y - this.sensitivity);
        let bottomRightProjection = new coord(point.x + this.sensitivity, point.y + this.sensitivity);

        return isWithinRectangle(currPos, topLeftProjection, bottomRightProjection);
}


//add the two triangles partial values and compare to the isosceles triangle
this.trianglesAreEqual = function(currPos, cornerPos)
{
    const targetArea = (this.sensitivity ** 2) / 2;
    const xProjection1 = new coord(cornerPos.x - this.sensitivity, cornerPos.y);
    const yProjection1 = new coord(cornerPos.x, cornerPos.y - this.sensitivity);

    const xProjection2 = new coord(cornerPos.x + this.sensitivity, cornerPos.y);
    const yProjection2 = new coord(cornerPos.x, cornerPos.y + this.sensitivity);

    const t1PartialArea1 = this.Area(currPos, xProjection1, cornerPos);
    const t1PartialArea2 = this.Area(currPos, xProjection1, yProjection1);
    const t1PartialArea3 = this.Area(currPos, yProjection1, cornerPos);

    const t2PartialArea1 = this.Area(currPos, xProjection2, cornerPos);
    const t2PartialArea2 = this.Area(currPos, xProjection2, yProjection2);
    const t2PartialArea3 = this.Area(currPos, yProjection2, cornerPos);

    const t1Area = t1PartialArea1 + t1PartialArea2 + t1PartialArea3;
    const t2Area = t2PartialArea1 + t2PartialArea2 + t2PartialArea3;

    return t1Area == targetArea || t2Area == targetArea;
}

function coord(x,y){
    this.x = x;
    this.y = y;
}

}
/*
function divRectangleObject(xPos, yPos, width, height){
    this.xPos = xPos;
    this.yPos = yPos;
    this.width = width;
    this.height = height;

}*/


