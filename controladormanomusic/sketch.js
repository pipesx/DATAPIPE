let video;
let handPose;
let hands = [];
let painting;
let px = 0;
let py = 0;
let violin, piano;
let violinPlaying = false;
let pianoPlaying = false;

function preload() {
  violin = loadSound('violin.mp3');
  piano = loadSound('piano.mp3');
  handPose = ml5.handPose({ flipped: true });
}

function gotHands(results) {
  hands = results;
}

function setup() {
  createCanvas(640, 480);
  painting = createGraphics(640, 480);
  painting.clear();

  video = createCapture(VIDEO, { flipped: true });
  video.hide();

  handPose.detectStart(video, gotHands);
}

function draw() {
  image(video, 0, 0);

  let indexRight, thumbRight, indexLeft, thumbLeft;
  
  if (hands.length > 0) {
    for (let hand of hands) {
      if (hand.handedness === "Right") {
        indexRight = hand.index_finger_tip;
        thumbRight = hand.thumb_tip;
      } else if (hand.handedness === "Left") {
        indexLeft = hand.index_finger_tip;
        thumbLeft = hand.thumb_tip;
      }
    }

    // 🎻 Mano Derecha (Violín) - Índice y pulgar juntos
    if (indexRight && thumbRight) {
      let dRight = dist(indexRight.x, indexRight.y, thumbRight.x, thumbRight.y);
      let pitchViolin = map(indexRight.y, height, 0, 0.5, 2); // Ajuste de tono

      if (dRight < 30) {
        if (!violinPlaying) {
          violin.loop();
          violinPlaying = true;
        }
        violin.rate(pitchViolin);

        // Dibujar emoji 🎻
        textSize(32);
        text("🎻", indexRight.x, indexRight.y);
      } else {
        if (violinPlaying) {
          violin.stop();
          violinPlaying = false;
        }
      }
    }

    // 🎹 Mano Izquierda (Piano) - Índice y pulgar juntos
    if (indexLeft && thumbLeft) {
      let dLeft = dist(indexLeft.x, indexLeft.y, thumbLeft.x, thumbLeft.y);
      let pitchPiano = map(indexLeft.y, height, 0, 0.5, 2); // Ajuste de tono

      if (dLeft < 30) {
        if (!pianoPlaying) {
          piano.loop();
          pianoPlaying = true;
        }
        piano.rate(pitchPiano);

        // Dibujar emoji 🎹
        textSize(32);
        text("🎹", indexLeft.x, indexLeft.y);
      } else {
        if (pianoPlaying) {
          piano.stop();
          pianoPlaying = false;
        }
      }
    }
  }
}