let kanye;
let datoss=[];
let tex;


function datosready(carga) {
  datoss.push(carga.quote);
  if (datoss.length === 8) { // si estan los 4 comentarios muestra por consola
    
    console.log('Comentarios obtenidos:', datoss);
  }
}

function datos() {
  for (let i = 0; i < 8; i++) {
    let url = 'https://api.kanye.rest/';
    loadJSON(url, datosready);
  }
}

// 
let sentiment;
let statusEl;
let sentimentResult;
let boton;
let caja;

function sentimiento(){
  sentiment = ml5.sentiment('movieReviews', modelReady);
  boton=createButton("sentimiento");
  statusEl = createP('Loading Model...');

 
  
  boton.mousePressed(getSentiment);
  //sentimentResult = createP("hola",sentimentScore);
}

function setup() {
  noCanvas();
  datos(); // se cargan "tweets"
  
  sentimiento();
}

function getSentiment() { //CHATGPT
  if (datoss.length > 0) {
    for (let i = 0; i < datoss.length; i++) {
      const prediction = sentiment.predict(datoss[i]);
      const sentimentScore = prediction.score;
      
        const comen = createP(datoss[i]);
        
      
      // Crear un nuevo párrafo para mostrar el score de sentimiento
const resultadoEl = createP(`Sentiment score ${i + 1}: ${sentimentScore}`);
      resultadoEl.parent('resultado'); // Agregar el párrafo al elemento con id 'resultado'
    }
  } else {
    console.log("No se han cargado textos.");
  }
  
}


function modelReady() {

  statusEl.html('Modelo listo')
}
