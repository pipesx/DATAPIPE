let handposeModel;
let mobilenet;
let classifier;
let video;
let label = '...';
let arribaButton;
let abajoButton;
let derechaButton;
let trainButton;
let Fondo;
let violinSound;
let pianoSound; // Nuevo sonido

function preload() {
  // Cargar los sonidos
  violinSound = loadSound('violin.mp3');
  pianoSound = loadSound('piano.mp3'); // Cambia el nombre si usas otro sonido
}

function modelReady() {
  console.log('Model is ready!!!');
}

function videoReady() {
  console.log('Video is ready!!!');
}

function whileTraining(loss) {
  if (loss === null) {
    console.log('Training Complete');
    classifier.classify(gotResults);
  } else {
    console.log(loss);
  }
}

function gotResults(error, result) {
  if (error) {
    console.error(error);
  } else {
    console.log(result);
    label = result[0].label;

    // Si se detecta la Figura 1, reproducir el violín
    if (label === 'Violin') {
      if (!violinSound.isPlaying()) {
        violinSound.play();
      }
      pianoSound.stop(); // Detener el otro sonido si estaba sonando
    }
    
    // Si se detecta la Figura 2, reproducir el piano o detener todo sonido
    else if (label === 'Piano') {
      violinSound.stop(); // Detener el violín
      if (!pianoSound.isPlaying()) {
        pianoSound.play();
      }
    } 
    

    // Si cambia a otra figura, detener ambos sonidos
    else {
      violinSound.stop();
      pianoSound.stop();
    }

    classifier.classify(gotResults);
  }
}

function setup() {
  createCanvas(320, 270);
  video = createCapture(VIDEO);
  video.hide();
  background(0);

  // Inicializar MobileNet y clasificador
  mobilenet = ml5.featureExtractor('MobileNet', modelReady);
  classifier = mobilenet.classification(video, { numLabels: 4 }, videoReady);

  arribaButton = createButton('Violin');
  arribaButton.mousePressed(function() {
    classifier.addImage('Violin');
  });

  abajoButton = createButton('Piano');
  abajoButton.mousePressed(function() {
    classifier.addImage('Piano');
  });

  Fondo = createButton('Fondo');
  Fondo.mousePressed(function() {
    classifier.addImage('Fondo');
  });

  trainButton = createButton('Train');
  trainButton.mousePressed(function() {
    classifier.train(whileTraining);
  });
}

function draw() {
  background(0);
  image(video, 0, 0, 320, 240);

  fill(255);
  textSize(16);
  text(label, 10, height - 10);
}
