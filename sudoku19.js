
//////////////////
//Global Variables
//////////////////

//array of paths to images to be inserted into boxes
let images = ['bone.png', 'flags.png', 'heart.png', 'insta.png', 'moustache.png', 'white.png', 'restart.png'];

let boxDictionary = {};

//start location is the box you selected to move
//target location is the location of the box you want to move to
let startLocation = null;
let targetLocation = null;


//Box class 
//abstract data type to represent html box elements
class Box {
    constructor(pId, pHouse, pLeftPos, pTopPos) {        
        this.id = pId;        
        this.class = 'box';        
        this.house = pHouse;
        this.leftPos = pLeftPos;
        this.topPos = pTopPos; 
        this.img = getRandomImage();   
    }
    
    //generate new html box elements from the attributes of this box instance
    generateElement() {
        let parentElement = document.getElementById('house-' + this.house);

        let newBox = document.createElement('div');
        newBox.className = this.class;
        newBox.id = this.id;
        newBox.style.left = "" + this.leftPos + "vmin";
        newBox.style.top = "" + this.topPos + "vmin"; 
        parentElement.appendChild(newBox);        
        //insert image into box               
        newBox.appendChild(this.img);
        //set up events for box
        newBox.onmouseover = function(e) {
            newBox.style.backgroundColor = 'grey';
        }
        newBox.onmouseout = function(e) {
            newBox.style.backgroundColor = 'white';
        }
        //when nox is clicked, it can be either
        //1- target box 
        //2- box you want to move (to position of target box)
        newBox.onclick = function(e) {
            if (startLocation == null) {
                startLocation = boxDictionary[newBox.id];
                newBox.style.border = '3px solid yellow';
            }
            else {                
                let targetLocation = boxDictionary[newBox.id];
                let tempImg = targetLocation.img;
                targetLocation.img = startLocation.img;
                startLocation.img = tempImg; 
                
                document.getElementById(startLocation.id).remove();
                document.getElementById(targetLocation.id).remove();

                startLocation.generateElement();
                targetLocation.generateElement();

                startLocation = null;
                targetLocation = null;
            }
        }
    }

    //removes the html elemnt associated with the box that has the provided Id
    removeElement(pId) {
        document.getElementById(pId).remove();
    }
}


//dynamically create all boxes
//this will display all boxes on screen, but they will not necessarily be "filled" with images

for (let i=1; i<=3; i++) { //for each house
    for (let j=1; j<=6; j++) { //for each row
        for (let k=1; k<=3; k++) { //for each column
            let aId = 'house' + i + 'row' + j + 'column' + k;  
            let leftPos = 2.5+(12*(k-1));
            let topPos = 1.5+(12*(j-1));      
            let box = new Box( aId, i, leftPos, topPos);
            boxDictionary[aId] = box;            
            box.generateElement();
        }
    }
}

console.log(boxDictionary['house1row1column1']);


///////////////////
//Utility functions
///////////////////

//random number generator 
function randomNum(number) {
    return Math.floor(Math.random() * number);
}

//get a random image from the array of images
function getRandomImage() {
    let imagePos = randomNum(images.length);    
    let img = document.createElement('img');    
    img.src = 'images/' + images[imagePos];
    img.style.maxHeight = '10vmin';
    img.style.maxWidth = '10vmin';
    if (img!='images/') {
        return img;
    }
    else {
        return null
    }
}

