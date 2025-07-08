let video;
let bodyPose;
let poses = [];
let connections;
let showCamera = true;
let showSkeleton = true;
let poseCount = 0;
let lastFrameTime = 0;
let fps = 0;

// Variables para el círculo interactivo
let targetCircle = {
  x: 320,  // Posición inicial
  y: 240,
  size: 50,
  defaultColor: '#FF5722',  // Naranja
  activeColor: '#00E676',   // Verde
  currentColor: '#FF5722',
  isActive: false,
  newPositions: [  // Array de posibles nuevas posiciones
    {x: 160, y: 120},  // Esquina superior izquierda
    {x: 480, y: 120},  // Esquina superior derecha
    {x: 320, y: 240},  // Centro
    {x: 160, y: 360},  // Esquina inferior izquierda
    {x: 480, y: 360}   // Esquina inferior derecha
  ],
  currentPositionIndex: 2  // Empieza en la posición central
};

function preload() {
  bodyPose = ml5.bodyPose({ flipped: true });
}

function setup() {
  const canvas = createCanvas(640, 480);
  canvas.parent('canvas-container');

  video = createCapture(VIDEO, { flipped: true });
  video.size(width, height);
  video.hide();

  bodyPose.detectStart(video, gotPoses);
  connections = bodyPose.getConnections();
  
  // Configurar controles
  document.getElementById('toggleCamera').addEventListener('click', function() {
    showCamera = !showCamera;
    this.textContent = showCamera ? 'Ocultar Cámara' : 'Mostrar Cámara';
  });
  
  document.getElementById('toggleSkeleton').addEventListener('click', function() {
    showSkeleton = !showSkeleton;
    this.textContent = showSkeleton ? 'Ocultar Esqueleto' : 'Mostrar Esqueleto';
  });
  
  lastFrameTime = millis();
  
  // Inicializar posición del círculo
  updateCirclePosition();
}

function draw() {
  // Calcular FPS
  const currentTime = millis();
  fps = Math.round(1000 / (currentTime - lastFrameTime));
  lastFrameTime = currentTime;
  
  // Actualizar UI
  document.getElementById('fps').textContent = fps;
  document.getElementById('poseCount').textContent = poseCount;
  
  // Limpiar canvas
  clear();
  
  // Dibujar video si está activo
  if (showCamera) {
    image(video, 0, 0, width, height);
  } else {
    background(30);
    fill(255);
    textAlign(CENTER, CENTER);
    text("Cámara oculta", width/2, height/2);
  }

  // Verificar colisión con puntos del bodypose
  checkCollisionWithCircle();

  // Dibujar el círculo interactivo
  drawTargetCircle();

  // Dibujar esqueleto si está activo
  if (showSkeleton && poses.length > 0) {
    drawSkeleton();
    drawKeypoints();
  }
}

function gotPoses(results) {
  poses = results;
  if (results.length > 0) {
    poseCount++;
  }
}

function drawSkeleton() {
  for (let pose of poses) {
    for (let connection of connections) {
      const [pointAIndex, pointBIndex] = connection;
      const pointA = pose.keypoints[pointAIndex];
      const pointB = pose.keypoints[pointBIndex];
      
      if (pointA.confidence > 0.1 && pointB.confidence > 0.1) {
        stroke(108, 92, 231);
        strokeWeight(3);
        line(pointA.x, pointA.y, pointB.x, pointB.y);
      }
    }
  }
}

function drawKeypoints() {
  for (let pose of poses) {
    for (let keypoint of pose.keypoints) {
      if (keypoint.confidence > 0.1) {
        fill(0, 184, 148);
        noStroke();
        circle(keypoint.x, keypoint.y, 10);
      }
    }
  }
}

function checkCollisionWithCircle() {
  targetCircle.isActive = false;
  
  if (poses.length > 0) {
    // Usaremos solo la nariz (índice 0) para la interacción
    const nose = poses[0].keypoints[0];
    if (nose.confidence > 0.1) {
      // Calcular distancia entre la nariz y el círculo
      let d = dist(nose.x, nose.y, targetCircle.x, targetCircle.y);
      
      // Si la nariz está dentro del círculo
      if (d < targetCircle.size/2) {
        targetCircle.isActive = true;
        // Cambiar a una nueva posición aleatoria
        changeCirclePosition();
      }
    }
  }
  
  // Actualizar color según el estado
  targetCircle.currentColor = targetCircle.isActive ? 
                           targetCircle.activeColor : 
                           targetCircle.defaultColor;
}

function changeCirclePosition() {
  // Seleccionar una nueva posición diferente a la actual
  let newIndex;
  do {
    newIndex = floor(random(targetCircle.newPositions.length));
  } while (newIndex === targetCircle.currentPositionIndex);
  
  targetCircle.currentPositionIndex = newIndex;
  updateCirclePosition();
}

function updateCirclePosition() {
  // Actualizar posición del círculo según el índice actual
  const pos = targetCircle.newPositions[targetCircle.currentPositionIndex];
  targetCircle.x = pos.x;
  targetCircle.y = pos.y;
}

function drawTargetCircle() {
  fill(targetCircle.currentColor);
  noStroke();
  circle(targetCircle.x, targetCircle.y, targetCircle.size);
  
  // Dibujar un borde para mejor visibilidad
  stroke(255);
  strokeWeight(2);
  noFill();
  circle(targetCircle.x, targetCircle.y, targetCircle.size + 5);
  
  // Opcional: mostrar texto de instrucción
  fill(255);
  noStroke();
  textAlign(CENTER, CENTER);
  text("Tócame", targetCircle.x, targetCircle.y);
}