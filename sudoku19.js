
//////////////////
//Global Variables
//////////////////

//array of paths to images to be inserted into boxes
let neutralImages = ['bone.png', 'chair.png', 'white.png', 'white.png', 'white.png', 'sunflower.png', 'laptop.png'];
let infectorImages = ['coronavirus.png', 'bat.png', 'bat2.png'];
let humanImages = ['doctor.png', 'bob.png', 'karen.png', 'grandma.png'];
let specialImages = ['vaccine.png'];

let selectedImages;

//array of types of boxes
//one will be randomly selected for each box when it is created
//some types are repeated to ensure rarity of certain other types
let boxTypes = ['neutral', 'neutral', 'neutral', 'human', 'human', 'human', 'infector', 
               'infector', 'special', 'infector', 'neutral', 'human'];

//dictionary:
//key - box Id
//value - box associated with Id
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
        this.img = getRandomImage(this.type, this.id);         
    }
    
    //generate new html box elements from the attributes of this box instance
    generateElement() {
        let parentElement = document.getElementById('house-container');

        let newBox = document.createElement('div');
        newBox.className = this.class;
        newBox.id = this.id;
        newBox.style.left = "" + this.leftPos + "vmin";
        newBox.style.top = "" + this.topPos + "vmin"; 
        newBox.style.backgroundColor = this.getBoxBackground();  
        parentElement.appendChild(newBox);        
        //insert image into box               
        newBox.appendChild(this.img);
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
                startLocation.style.border = '3px solid black';

                let startLeft = startLocation.style.left;
                let startTop = startLocation.style.top;
                let targetLeft = targetLocation.style.left;
                let targetTop = targetLocation.style.top;

                startLocation.style.left = targetLeft;
                startLocation.style.top = targetTop;                
                targetLocation.style.left = startLeft;
                targetLocation.style.top = startTop;

                startLocation = null;
                targetLocation = null;
            }
        }
    }

    //removes the html elemnt associated with the box that has the provided Id
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


//dynamically create all boxes
//this will display all boxes on screen, but they will not necessarily be "filled" with images

let counter = 1;
for (let i=1; i<=6; i++) { //for each row 
    let bufferSpaceFromLeft = 2.5      
    for (let j=1; j<=9; j++) { //for each column
        let aId = 'box' + counter; 
        let leftPos;
        let topPos;        

        if (j==4 || j==7) {
            bufferSpaceFromLeft += 4.5;     
        }
        
        leftPos = bufferSpaceFromLeft + (12*(j-1));
        topPos = 1.5 + (12*(i-1));              
        let box = new Box( aId, leftPos, topPos);
        boxDictionary[aId] = box;            
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
function getRandomImage(pImageType, pBoxId) {
    if (pImageType == 'neutral') selectedImages = neutralImages;
    if (pImageType == 'human') selectedImages = humanImages;
    if (pImageType == 'infector') selectedImages = infectorImages;
    if (pImageType == 'special') selectedImages = specialImages;

    let indexValue = randomNum(selectedImages.length);    
    let img = document.createElement('img');    
    img.src = 'images/' + selectedImages[indexValue];
    img.id = pBoxId + 'image';
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

