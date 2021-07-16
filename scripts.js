const data = [];

const videoUI = document.querySelector('#rotary-video');
const firstStopwatchUI = document.querySelector('#first-stopwatch');
const secondStopwatchUI = document.querySelector('#second-stopwatch');

let time;
let firstStopWatchActive = false;
let secondStopWatchActive = false;
let inicialTime = 0;
let finalTime = 0;

videoUI.addEventListener('timeupdate', (e) => {

   if (firstStopWatchActive) {

      const timeElapsed = (e.target.currentTime - inicialTime).toFixed(2);
      const timeElapsedDisplay = Math.trunc(timeElapsed);
      let displayTime;

      if (timeElapsedDisplay < 60) {
         if (timeElapsedDisplay < 10) {
            displayTime = `00:0${timeElapsedDisplay}`;
         }

         if (timeElapsedDisplay >= 10) {
            displayTime = `00:${timeElapsedDisplay}`;
         }

      } else {
         const seconds = timeElapsedDisplay % 60;
         const minutes = Math.trunc(timeElapsedDisplay / 60);

         if (seconds < 10) {
            displayTime = `0${minutes}:0${seconds}`;
         }

         if (seconds >= 10) {
            displayTime = `0${minutes}:${seconds}`;
         }

      }

      console.log(displayTime);
      firstStopwatchUI.lastElementChild.textContent = displayTime;
   }

});

window.addEventListener('keyup', (e) => {

   if (e.code === 'KeyW') {
      // console.log('Veículo parou p entrar na rotatória');
      firstStopWatchActive = true;
      inicialTime = videoUI.currentTime;
   }
   if (e.code === 'KeyA') {
      console.log('Veículo entra na faixa de circulação');
      firstStopWatchActive = false;
      finalTime = videoUI.currentTime;
      data.push({
         chegada: inicialTime
      });

   }
   if (e.code === 'KeyM') {
      console.log('Veículo da faixa de circulação passa por um ponto marcado no vídeo');
      secondStopWatchActive = !secondStopWatchActive;

   }
   if (e.code === 'KeyX') {
      console.log('Apaga evento anterior');

   }

});

// Data Management
const Data = {

}

// UI
const UI = {
   displayTime: () => {

   }
}