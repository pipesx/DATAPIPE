// Declare variables
let mobileNet;
let puffin; // ahora es variable de video
let classifier; // Added missing variable declaration
let label ='Presione "r" para clasificar'; // agregué  variable label
let conf = "🥸"; // se agrega var. conf para guardar valor de confianza

// Setup function
function setup() {
  // Create canvas
  createCanvas(740, 680);
  // Load Video
  puffin = createCapture(VIDEO, imageReady);
  puffin.hide(); // Hide the image
}

function draw() {
  background('green');
  image(puffin, 75, 50, 580, 490);
  fill('red');
  textSize(40);
  text(label, 100, height-100); // Muestra la etiqueta en el canvas
  text('confianza:' + conf, 200, height-50); // Muestra la confianza en el canvas
}
// mantengo puffin para utilizarla como la variable de video




// Function to handle model readiness
function modelReady(){
  console.log('Model is Ready!');
}

// Preload function to load model
function preload(){
  // Use 'ImageClassifier' instead of 'imageClassifier'
  classifier = ml5.imageClassifier('MobileNet', modelReady);
}

// Function to handle image readiness
let predicting = false; // Variable para controlar si se está haciendo la predicción o no

function keyPressed() {
  if (key === 'r' || key === 'R') { // Verifica si se presionó la tecla 'r' o 'R'
    predicting = !predicting; // Invierte el valor de la variable 'predicting'
    if (predicting) {
      classifier.predict(puffin, gotResults); // Comienza la predicción
    }
  }
}

function imageReady(){
  // Clear background before drawing the image

  //image(puffin, 50, 50,400,400);
  if (predicting) { // Verifica si se debe seguir prediciendo
    classifier.predict(puffin, gotResults); // Continúa la predicción
  }
}

function gotResults(error, results){
  if(error){
    console.error(error);
  } else{
    console.log(results);
    label = results[0].label;  // actualiza nombre de la "imagen"
    conf = (results[0].confidence*100).toFixed(2) + '%' ; // actualiza valor confianza
    // Display confidence score
 
  
  }
  imageReady(); // agregando esto sigue clasificando ....
}

