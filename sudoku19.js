
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

//start location is the box you selected to move
//target location is the location of the box you want to move to
let startLocation = null;
let targetLocation = null;


//Box class 
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
        //set newBox properties
        newBox.className = this.class;
        newBox.id = this.id;
        newBox.style.left = "" + this.leftPos + "px";
        newBox.style.top = "" + this.topPos + "px"; 
        newBox.style.backgroundColor = this.getBoxBackground();  
        newBox.style.backgroundImage = "url(" + this.img.src + ")";  
        newBox.style.backgroundSize = 'contain';   
        newBox.style.backgroundRepeat = 'no-repeat';   
        
        //insert image into box                       
        //set up events for box
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
                let startType = startBoxObject.type;
                let targetType = targetBoxObject.type;

                 
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
           
            newBox.style.zIndex = '2';
            

            //record starting position before dragging begins
            let offset = $('#house-container').offset();
            let startX = e.clientX - (offset.left + 25);
            let startY = e.clientY - (offset.top + 25);
            let x;
            let y;   
            
                                            

            //highlight all viable destinations for box to be dragged to            

            let leftBox;
            /*
            document.elementFromPoint(e.clientX - 80, e.clientY + 10).style.border = '4.5px solid red'; //left
            document.elementFromPoint(e.clientX + 80, e.clientY + 10).style.border = '4.5px solid red'; //right
            document.elementFromPoint(e.clientX + 10, e.clientY + 80).style.border = '4.5px solid red'; //top
            document.elementFromPoint(e.clientX + 10, e.clientY - 80).style.border = '4.5px solid red'; //bottom 
            */

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

                newBox.style.border = '3px solid black'; 
                
                /*
                document.elementFromPoint(e.clientX - 80, e.clientY + 10).style.border = '3px solid black'; //left
                document.elementFromPoint(e.clientX + 80, e.clientY + 10).style.border = '3px solid black'; //right
                document.elementFromPoint(e.clientX + 10, e.clientY + 80).style.border = '3px solid black'; //top
                document.elementFromPoint(e.clientX + 10, e.clientY - 80).style.border = '3px solid black'; //bottom    
                */

                document.getElementById('house-container').onmousemove = null;
                //get reference to boxes at the point where user dragged original box
                let elementsFromPoint = document.elementsFromPoint(e.clientX, e.clientY);
                
                //determine total distance dragged
                let x_dist = Math.abs(x - startX);
                let y_dist = Math.abs(y - startY);

                //get corresponding Box objects
                let startBoxObject = boxDictionary[newBox.id];
                let targetBoxObject = boxDictionary[elementsFromPoint[1].id];


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

                        //swap ids of boxes      
                        /*                                                             
                        let startId = newBox.id;
                        let targetId = elementsFromPoint[1].id;
                        newBox.id = targetId;
                        elementsFromPoint[1].id = startId;
                        startBoxObject.id = targetId;
                        targetBoxObject.id = startId;    
                        */
                                             
                        
                    }
                    
                    startBoxObject.updateElement();
                    targetBoxObject.updateElement();                                        
                }                      
                else { //if requirements weren't met
                    //simply return box to original position
                    startBoxObject.updateElement();                    
                }                
            }            
        }
        return newBox;
    }    
}


//dynamically generate all boxes
let counter = 1;
for (let i=1; i<=6; i++) { //for each row 
    let bufferSpaceFromLeft = 15      
    for (let j=1; j<=9; j++) { //for each column
        let boxId = 'box' + counter; 
        let imgId = boxId + 'img';
        let leftPos;
        let topPos;        

        if (j==4 || j==7) bufferSpaceFromLeft += 30;             
        
        leftPos = bufferSpaceFromLeft + (75*(j-1));
        topPos = 10 + (75*(i-1));              

        let box = new Box( boxId, leftPos, topPos);                
        boxDictionary[boxId] = box;         
        box.generateElement();
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

