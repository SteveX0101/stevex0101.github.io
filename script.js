const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//Initializes variables
let darktheme = true, //Default is dark theme
    color = [/*dark     light*/
            ["#440066", "#F2FFFF"], //Background "Light"
            ["#201F25", "#B5FFEA"], //Background "Dark"
            ["#FFFFFF", "#191919"], //Heading color
            ["#9985FF", "#009F71"], //Heading shadow color
            ["#F5FFFA", "#3D5866"],  //Description color
            ["#60539F", "#006347"] //Particle color
            ],
    particlesArray;

//Particle Object
class Particle {
  constructor() {
    this.reset();
    this.particleOpacity = getRandom(0.001,1);
    this.particleYpos = getRandomInt(0,canvas.height + canvas.height/4);
  }

  //Resets the particle values
  reset() {
    this.particleColor = (darktheme) ? color[5][0] : color[5][1];
    this.particleOpacity = getRandom(0.05,1);
    this.particleFadeRate = getRandom(0.002,0.0008);
    this.particleSize = getRandomInt(canvas.height/46,canvas.height/18);
    this.particleXpos = getRandomInt(this.particleSize, canvas.width - this.particleSize);
    this.particleYpos = getRandomInt(canvas.height + this.particleSize, canvas.height + this.particleSize * 2);
    this.particleYRate = getRandom(canvas.height/1171,canvas.height/312);
    this.particleCounter = getRandomInt(0,360);
    this.particleXdirection = 1;
  }

  //Draws the particle
  draw() {
    ctx.fillStyle = this.particleColor; //Set color
    ctx.globalAlpha = this.particleOpacity; //Set Opacity

    //Draws a circle
    ctx.beginPath();
    ctx.arc(this.particleXpos,this.particleYpos,this.particleSize,0,2*Math.PI);
    ctx.closePath();
    ctx.fill();
  }

  //Updates the particle
  update() {
    this.particleColor = (darktheme) ? color[5][0] : color[5][1]; //Theme color
    this.particleYpos -= this.particleYRate; //Makes the particle rise

    //Increase particle size slightly
    this.particleSize += 0.002;

    //Makes the Particle Zig-Zag
    this.particleXpos += Math.sin(this.particleCounter++ * (Math.PI / 180)) / (this.particleSize / 10) * this.particleXdirection;

    //Particle will bounce off the sides
    if (this.particleXpos + this.particleSize >= canvas.width || this.particleXpos - this.particleSize <= 0) {
      this.particleXdirection *= -1;
    }

    //Particle will fade out
    if (this.particleOpacity > 0) {
      this.particleOpacity -= this.particleFadeRate;
      this.particleOpacity = (this.particleOpacity < 0) ? 0 : this.particleOpacity;
    }

    //Resets particle when it's no longer visible or when the y-position reaches the top
    if (this.particleYpos <= -this.particleSize * 2 || this.particleOpacity == 0) {
      this.reset();
    }

    //Draws the particle
    this.draw();
  }
}

//Initialize the particles
function init() {
  particlesArray = [];
  let particleCount = Math.ceil(canvas.width/96) + 4; //Initialize the number of particles

  //Pushes a particle object into the particle array
  for(let i = 0; i < particleCount; ++i) {
    particlesArray.push(new Particle());
  }
}

//Animation Loop
function animate() {
  requestAnimationFrame(animate);

  theme(); //Checks the theme and changes the colors if theme changes

  //Clears previous frame
  ctx.clearRect(0,0,canvas.width,canvas.height);

  //Updates every particle
  for(let i = 0; i < particlesArray.length; ++i) {
    particlesArray[i].update();
  }
}

//Returns a random int value between two numbers
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

//Returns a random value between two value and rounded with the highest decimal point
function getRandom(min, max) {
  var highestDecimalpoint = Math.max(decimalCount(min),decimalCount(max));
  var roundAmount = Math.pow(10,highestDecimalpoint);
  return (Math.round(((Math.random() * (max - min)) + min) * roundAmount) / roundAmount);
}

//Returns the number of decimal point a value has
function decimalCount(value) {
  if (Math.floor(value) == value) {
    return 0;
  } else {
    var v = "" + value;
    v = v.substring(v.indexOf('.') + 1, v.length);
    return v.length;
  }
}

//When the window is resize changes the canvas size and reset all particles
function reportWindowSize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  init();
}

//Changes the colors depending on the theme
function theme() {
    const dorl = darktheme ? "dark" : "light";
    document.getElementById('myCanvas').style.backgroundImage = (darktheme) ? "linear-gradient(" + color[0][0] + "," + color[1][0] + ")" : "linear-gradient(" + color[0][1] + "," + color[1][1] + ")";
    // document.getElementById('myCanvas').style.backgroundColor = (darktheme) ? color[0][0] : color[0][1]; //Background color
    document.getElementById('heading').style.color = (darktheme) ? color[2][0] : color[2][1]; //Heading text color
    document.getElementById('heading').style.textShadow = (darktheme) ? "3px 5px " + color[3][0] :"3px 5px " + color[3][1]; //Heading text shadow color
    document.getElementsByClassName("description")[0].style.color = (darktheme) ? color[4][0] : color[4][1]; //Description text color
    document.getElementsByClassName('icon')[0].src = `/icons/${dorl}-button.svg`; //Theme button
    document.getElementsByClassName('icon')[1].src = `/icons/github-${dorl}.svg`; //Github button
    document.getElementsByClassName('icon')[2].src = `/icons/email-${dorl}.svg`; //Email Button
}

window.onresize = reportWindowSize;

//Run these functions
init();
animate();
