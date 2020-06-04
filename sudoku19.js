
//////////////////
//Global Variables
//////////////////

//array of paths to images to be inserted into boxes
const neutralImages = ['bone.png', 'chair.png', 'white.png', 'white.png', 'white.png', 'sunflower.png', 'laptop.png'];
const infectorImages = ['coronavirus.png', 'bat.png', 'bat2.png'];
const humanImages = ['doctor.png', 'bob.png', 'karen.png', 'grandma.png', 'summer.png'];
const specialImages = ['vaccine.png'];

let selectedImages;

//array of types of boxes
//one will be randomly selected for each box when it is created
//some types are repeated to ensure rarity of certain other types
const boxTypes = ['neutral', 'neutral', 'neutral', 'human', 'human', 'human', 'infector', 
               'infector', 'special', 'infector', 'neutral', 'human'];


//dictionary:
//key - Id
//value - box/img associated with Id
let boxDictionary = {};
//array containing all box elements
let boxElementArray = [];

//start location is the box you selected to move
//target location is the location of the box you want to move to
let startLocation = null;
let targetLocation = null;


//////////////////////
//Box Class Definition
//////////////////////

//abstract data type to represent html box elements
class Box {
    constructor(pId, pLeftPos, pTopPos) {        
        this.id = pId;        
        this.class = 'box';                
        this.leftPos = pLeftPos;
        this.topPos = pTopPos; 
        this.type = getRandomType();
        this.img = getRandomImage(this.type);    
        this.element = this.generateElement();              
    }

    printElementToScreen() {
        let parentElement = document.getElementById('house-container');
        parentElement.appendChild(this.element); 
    }
    
    getBoxBackground() {
        if (this.type == 'neutral') return 'white';
        if (this.type == 'infector') return 'rgb(87, 197, 23)';
        if (this.type == 'human') return 'rgb(69, 183, 228)';
        if (this.type == 'special') return 'gold';
    }    

    //update the html element corresponding to its box instance
    updateElement() {        
        this.element.id = this.id;
        console.log(this.element.id);
        this.element.style.backgroundColor = this.getBoxBackground();
        this.element.style.left = "" + this.leftPos + 'px';
        this.element.style.top = '' + this.topPos + 'px'; 
        this.element.style.border = '3px solid black';   
        this.element.style.zIndex = '1';   
    }
    
    //generate new html box elements from the attributes of this box instance
    generateElement() {        
        //create new box element
        let newBox = document.createElement('div');
        boxElementArray.push(newBox); //add to array of elements
        //set newBox properties
        newBox.className = this.class;
        newBox.id = this.id;
        newBox.style.left = "" + this.leftPos + "px";
        newBox.style.top = "" + this.topPos + "px"; 
        newBox.style.backgroundColor = this.getBoxBackground();  
        newBox.style.backgroundImage = "url(" + this.img.src + ")";  
        newBox.style.backgroundSize = 'contain';   
        newBox.style.backgroundRepeat = 'no-repeat';   
        

        ///////////////////////////////////
        //Event defnitions for box elements
        ///////////////////////////////////
                                      
        newBox.onmouseover = function(e) {          
           newBox.style.borderWidth = '3.5px';
        }

        newBox.onmouseout = function(e) {           
           newBox.style.borderWidth = '3px';
        }

        //when nox is clicked, it can be either
        //1- target box 
        //2- box you want to move (to position of target box)
        //this event is for moving boxes by clicking on them

        /*
        newBox.onclick = function(e) {
            if (startLocation == null) {                
                startLocation = newBox;
                newBox.style.border = '3.5px solid red';
            }
            else {                                  
                targetLocation = newBox;     
                
                //box types will determine the interaction
                let startBoxObject = boxDictionary[startLocation.id];
                let targetBoxObject = boxDictionary[targetLocation.id];
                                 
                let startLeft = startBoxObject.leftPos;
                let startTop = startBoxObject.topPos;
                let targetLeft = targetBoxObject.leftPos;
                let targetTop = targetBoxObject.topPos;

                //determine if boxes are adjacent
                //can only switch box positions if boxes are adjacent (non-diagonally)
                let x_distance = Math.abs(targetLeft - startLeft);
                let y_distance = Math.abs(targetTop - startTop);
                console.log(x_distance);
                console.log(y_distance);                

                //determine if boxes are adjacent based on distance between them
                if((x_distance <= 105 && y_distance == 0) || (x_distance == 0 && y_distance <= 75)) {

                    //alter box object coordinates
                    startBoxObject.leftPos = targetLeft;
                    startBoxObject.topPos = targetTop;
                    targetBoxObject.leftPos = startLeft;
                    targetBoxObject.topPos = startTop;                

                    //update html element coordinates                   
                    startBoxObject.updateElement();
                    targetBoxObject.updateElement();
                                                                                        

                    //special - infector interaction
                    let startType = startBoxObject.type;
                    let targetType = targetBoxObject.type;
                    if((startType=='special' && targetType=='infector') || (startType=='infector' && targetType=='special')) {   

                        document.getElementById(startLocation.id).style.backgroundImage = 'none';                    
                        document.getElementById(targetLocation.id).style.backgroundImage = 'none';
                        document.getElementById(startLocation.id).style.backgroundColor = 'white';
                        document.getElementById(targetLocation.id).style.backgroundColor = 'white'; 

                                            
                        boxDictionary[startLocation.id].type = 'neutral';
                        boxDictionary[targetLocation.id].type = 'neutral';   
                                                                                
                    }                                    
                }   
                startLocation.style.border = '3px solid black';
                startLocation = null;
                targetLocation = null;             
            }
        }    
        */     
        
        //if user drags a box to a location
        newBox.onmousedown = function(e) { 
           
            //make sure selected box is always in front
            newBox.style.zIndex = '2';
            
            //record starting position before dragging begins
            let offset = $('#house-container').offset();
            let startX = e.clientX - (offset.left + 25);
            let startY = e.clientY - (offset.top + 25);
            let x;
            let y;                                                           

            //highlight all viable destinations for box to be dragged to  
            newBox.style.border = '4px solid red';
            let index = boxElementArray.indexOf(newBox);
            console.log("index" + index);

            let leftBox, rightBox, topBox, bottomBox;                                                
            if(index%9 != 0) { //checking for edge cases
                leftBox = boxElementArray[index-1];
                leftBox.style.border = '4px solid red'; //left            
            }
            if((index+1)%9 != 0) {
                rightBox = boxElementArray[index+1];
                rightBox.style.border = '4px solid red'; //right                 
            }
            if(index > 8) {
                topBox = boxElementArray[index-9];
                topBox.style.border = '4px solid red'; //top    
            }
            if(index < 45) {
                bottomBox = boxElementArray[index+9];   
                bottomBox.style.border = '4px solid red'; //bottom    
            }
            
            //decrease opacity of all other boxes
            for(let i=0; i<boxElementArray.length; i++) {
                if(boxElementArray[i] != newBox) {
                    if(boxElementArray[i] != leftBox) {
                        if(boxElementArray[i] != rightBox) {
                            if(boxElementArray[i] != topBox) {
                                if(boxElementArray[i] != bottomBox) {
                                    boxElementArray[i].style.opacity = '70%';
                                }
                            }
                        }
                    }
                }
            }

            //once user begins moving mouse
            document.getElementById('house-container').onmousemove = function(e) {
                //record new position
                x = e.clientX - (offset.left + 25);
                y = e.clientY - (offset.top + 25);                                                              
                //update position
                $('#' + newBox.id).css("left", "" + x + "px"); 
                $('#' + newBox.id).css("top", "" + y + "px");
            }
                        
            //once user has stopped dragging, determine correct response
            newBox.onmouseup = function(e) {   

                if(index%9 != 0) leftBox.style.border = '3px solid black'; //left                        
                if((index+1)%9 != 0) rightBox.style.border = '3px solid black'; //right                                 
                if(index > 8) topBox.style.border = '3px solid black'; //top                    
                if(index < 45) bottomBox.style.border = '3px solid black'; //bottom                    
                                
                //reset opacity to original value
                for(let i=0; i<boxElementArray.length; i++) {               
                    boxElementArray[i].style.opacity = '100%';                  
                }

                document.getElementById('house-container').onmousemove = null;
                //get reference to boxes at the point where user dragged original box
                let elementsFromPoint = document.elementsFromPoint(e.clientX, e.clientY);
                
                //determine total distance dragged
                let x_dist = Math.abs(x - startX);
                let y_dist = Math.abs(y - startY);

                //get corresponding Box objects and target element               
                let startBoxObject = boxDictionary[newBox.id];                
                let targetElement = elementsFromPoint[1];
                let targetBoxObject = boxDictionary[targetElement.id];                

                //if requirements are met, swap original position of dragged box with box it was dragged to
                if(( x_dist <= 105 && y_dist <= 30) || (x_dist <= 30 && y_dist <= 80)) {

                    if(targetBoxObject != null) { //check if it was dragged out of bounds
                        let startLeft = startBoxObject.leftPos;
                        let startTop = startBoxObject.topPos;
                        let targetLeft = targetBoxObject.leftPos;
                        let targetTop = targetBoxObject.topPos;

                        //alter box object coordinates
                        startBoxObject.leftPos = targetLeft;
                        startBoxObject.topPos = targetTop;
                        targetBoxObject.leftPos = startLeft;
                        targetBoxObject.topPos = startTop; 

                        //swap element positions in boxElementArray
                        let targetIndex = boxElementArray.findIndex(element => element == targetElement);
                        let tempElement = boxElementArray[targetIndex];
                        boxElementArray[targetIndex] = boxElementArray[index];
                        boxElementArray[index] = tempElement;

                        //special over infector interaction
                        let startType = startBoxObject.type;                        
                        let targetType = targetBoxObject.type;
                        if((startType=='special' && targetType=='infector') || (startType=='infector' && targetType=='special')) {   

                            document.getElementById(startBoxObject.id).style.backgroundImage = 'none';                    
                            document.getElementById(targetBoxObject.id).style.backgroundImage = 'none';
                            document.getElementById(startBoxObject.id).style.backgroundColor = 'white';
                            document.getElementById(targetBoxObject.id).style.backgroundColor = 'white'; 

                                                
                            boxDictionary[startBoxObject.id].type = 'neutral';
                            boxDictionary[targetBoxObject.id].type = 'neutral';   
                                                                                
                        }      
                        targetBoxObject.updateElement();   
                    }                    
                    startBoxObject.updateElement();                                                           
                }                      
                else { 
                    //if requirements weren't met
                    //simply return box to original position
                    startBoxObject.updateElement();                    
                }                
            }            
        }
        return newBox;
    }    
}






////////////////////////////
//Generation of Box Elements
////////////////////////////

//dynamically generate all boxes
let counter = 1;
for (let i=1; i<=6; i++) { //for each row 
    let bufferSpaceFromLeft = 15      
    for (let j=1; j<=9; j++) { //for each column
        let boxId = 'box' + counter; 
        let imgId = boxId + 'img';
        let leftPos;
        let topPos;        

        if (j==4 || j==7) bufferSpaceFromLeft += 26;             
        
        leftPos = bufferSpaceFromLeft + (75*(j-1));
        topPos = 25 + (75*(i-1));              

        let box = new Box( boxId, leftPos, topPos);                
        boxDictionary[boxId] = box;                 
        box.printElementToScreen();

        counter += 1;
    }
}

console.log(boxDictionary);






///////////////////
//Utility functions
///////////////////

//random number generator 
function randomNum(number) {
    return Math.floor(Math.random() * number);
}

function getRandomType() {
    let indexVal = randomNum(boxTypes.length);
    let boxType = boxTypes[indexVal];
    return boxType;
}

//get a random image from the array of images
function getRandomImage(pImageType) {
    if (pImageType == 'neutral') selectedImages = neutralImages;
    if (pImageType == 'human') selectedImages = humanImages;
    if (pImageType == 'infector') selectedImages = infectorImages;
    if (pImageType == 'special') selectedImages = specialImages;

    let indexValue = randomNum(selectedImages.length);    
    let img = document.createElement('img');        
    img.src = 'images/' + selectedImages[indexValue];    
    img.style.maxHeight = '10vmin';
    img.style.maxWidth = '10vmin';    
    return img;
}

//get plain white image
function getWhiteImage() {
    let img = document.createElement('img');
    img.src = 'images/white.png';
    img.maxHeight = '10vmin';
    img.maxWidth = '10vmin';
    return img;
}

