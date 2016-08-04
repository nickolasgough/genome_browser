var y = 100;

// The statements in the setup() function 
// execute once when the program begins
function setup() {
	// createCanvas must be the first statement
  createCanvas(720, 400);  
  stroke(0);     // Set line drawing color to white
  frameRate(30);
}
// The statements in draw() are executed until the 
// program is stopped. Each statement is executed in 
// sequence and after the last line is read, the first 
// line is executed again.
function draw() {    // Set the background to black
    clear();
  y = y - 1; 
  if (y < 0) { 
    y = height; 
  } 
  line(0, y, width, y);  
} 