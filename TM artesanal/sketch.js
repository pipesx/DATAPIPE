let handposeModel;
let mobilenet;
let classifier;
let video;
let label = '...';
let arribaButton;
let abajoButton;
let derechaButton;
let trainButton;
let izquierda;

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
    classifier.classify(gotResults);
  }
}

function setup() {
  createCanvas(320, 270);
  video = createCapture(VIDEO);
  video.hide();
  background(0);

  // Inicializar handpose
  // handposeModel = ml5.handpose(video, modelReady);

  // Inicializar MobileNet y clasificador
  mobilenet = ml5.featureExtractor('MobileNet', modelReady);
  classifier = mobilenet.classification(video, { numLabels: 4 }, videoReady);

  arribaButton = createButton('Figura 1');
  arribaButton.mousePressed(function() {
    // Agregar imagen de la mano en la posición "arriba"
    classifier.addImage('Figura 1');
  });

  arribaButton = createButton('figura 2');
  arribaButton.mousePressed(function() {
    // Agregar imagen de la mano en la posición "arriba"
    classifier.addImage('figura 2');
  });

  // Agregar otros botones y funciones mousePressed para las otras direcciones

  trainButton = createButton('train');
  trainButton.mousePressed(function() {
    classifier.train(whileTraining);
  });
}

function draw() {
  background(0);
  image(video, 0, 0, 320, 240);

  // Detectar y dibujar mano con handpose
  //if (handposeModel) {
    //handposeModel.on('predict', (results) => {
      //if (results.length > 0) {
        //let hand = results[0];
        //let landmarks = hand.landmarks;

        // Dibujar puntos de referencia de la mano
        //for (let i = 0; i < landmarks.length; i++) {
          //let [x, y] = landmarks[i];
          //ellipse(x, y, 10, 10);
        //}

        // Recortar imagen de la mano y agregar al clasificador
        //let handImage = get(hand.boundingBox.topLeft[0], hand.boundingBox.topLeft[1],
          //hand.boundingBox.bottomRight[0] - hand.boundingBox.topLeft[0],
          //hand.boundingBox.bottomRight[1] - hand.boundingBox.topLeft[1]);
        //classifier.addImage(handImage, label);
      //}
    //});
  //}

  fill(255);
  textSize(16);
  text(label, 10, height - 10);
}
