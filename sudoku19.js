
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
    }
    
    //generate new html box elements from the attributes of this box instance
    generateElement() {
        let parentElement = document.getElementById('house-container');

        //create new box element
        let newBox = document.createElement('div');
        //set newBox properties
        newBox.className = this.class;
        newBox.id = this.id;
        newBox.style.left = "" + this.leftPos + "vmin";
        newBox.style.top = "" + this.topPos + "vmin"; 
        newBox.style.backgroundColor = this.getBoxBackground();  
        newBox.style.backgroundImage = "url(" + this.img.src + ")";  
        newBox.style.backgroundSize = 'contain';   
        newBox.style.backgroundRepeat = 'no-repeat';   
        //display on screen
        parentElement.appendChild(newBox);        
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
                if((x_distance <= 16.5 && y_distance == 0) || (x_distance == 0 && y_distance <= 12)) {

                    //alter box object coordinates
                    startBoxObject.leftPos = targetLeft;
                    startBoxObject.topPos = targetTop;
                    targetBoxObject.leftPos = startLeft;
                    targetBoxObject.topPos = startTop;                

                    //alter html element coordinates
                    startLeft = startLocation.style.left;
                    startTop = startLocation.style.top;
                    targetLeft = targetLocation.style.left;
                    targetTop = targetLocation.style.top;
                    
                    startLocation.style.left = targetLeft;
                    startLocation.style.top = targetTop;                
                    targetLocation.style.left = startLeft;
                    targetLocation.style.top = startTop; 
                    
                                                
                    //x axis - if box is 16.5 or less distance units away (vmin)
                    //y axis - if box is 12 or less distance units away (vmin)

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
    }

    //removes the html element associated with the box that has the provided Id
    removeElement(pId) {
        document.getElementById(pId).remove();
    }

    getBoxBackground() {
        if (this.type == 'neutral') return 'white';
        if (this.type == 'infector') return 'rgb(87, 197, 23)';
        if (this.type == 'human') return 'rgb(69, 183, 228)';
        if (this.type == 'special') return 'gold';
    }

    //update the html element corresponding to its box instance
    updateElement() {
        let element = document.getElementById(this.id);
        element.style.backgroundColor = this.getBoxBackground();
    }
}


//dynamically generate all boxes
let counter = 1;
for (let i=1; i<=6; i++) { //for each row 
    let bufferSpaceFromLeft = 2.5      
    for (let j=1; j<=9; j++) { //for each column
        let boxId = 'box' + counter; 
        let imgId = boxId + 'img';
        let leftPos;
        let topPos;        

        if (j==4 || j==7) bufferSpaceFromLeft += 4.5;             
        
        leftPos = bufferSpaceFromLeft + (12*(j-1));
        topPos = 1.5 + (12*(i-1));              

        let box = new Box( boxId, leftPos, topPos);                
        boxDictionary[boxId] = box;         
        box.generateElement();

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

