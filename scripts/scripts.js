const rotaryEvents = [];

// UI Elements
const videoUI = document.querySelector('#rotary-video');
const tableUI = document.querySelector('.data-table');
const leftStopwatchUI = document.querySelector('#left-stopwatch');
const rightStopwatchUI = document.querySelector('#right-stopwatch');
const timeBetweenStopwatchUI = document.querySelector('#timebetween-stopwatch');
const downloadButtonUI = document.querySelector('#download-button');

videoUI.src = localStorage.getItem('videoURL') || '';

// Global Variables
let leftStopwatchActive = false,
   rightStopwatchActive = false,
   timeBetweenStopwatchActive = false,
   toggleLeader = false,
   pendingCars = false,
   toggleE = true,
   toggleD = true;


let idE = 0,
   idD = 0,
   situation = '',
   arrivalTimeE = 0,
   arrivalTimeD = 0,
   exitTime = 0,
   waitTime = 0,
   leaderTime = 0,
   followerTime = 0;



// Event Listeners Handlers
const ListenersHandlers = {

   timeUpdateHandler: (e) => {


      if (leftStopwatchActive) {
         const timeElapsed = (e.target.currentTime - arrivalTimeE);
         const timeElapsedDisplay = Math.trunc(timeElapsed);
         const formattedTime = UI.formatTime(timeElapsedDisplay);


         UI.displayTime('left', formattedTime);

      } else {
         UI.displayTime('left', '00:00');

      }

      if (rightStopwatchActive) {
         const timeElapsed = (e.target.currentTime - arrivalTimeD);
         const timeElapsedDisplay = Math.trunc(timeElapsed);
         const formattedTime = UI.formatTime(timeElapsedDisplay);
         UI.displayTime('right', formattedTime)

      } else {
         UI.displayTime('right', '00:00');

      }

      if (timeBetweenStopwatchActive) {
         const timeElapsed = (e.target.currentTime - leaderTime);
         const timeElapsedDisplay = Math.trunc(timeElapsed);
         const formattedTime = UI.formatTime(timeElapsedDisplay);
         UI.displayTime('timeBetween', formattedTime);
      }

   },

   keyUpHandler: (e) => {

      if (e.code === 'KeyE') {

         if (toggleE) {
            leftStopwatchActive = true;
            arrivalTimeE = videoUI.currentTime;
            toggleE = false;
         } else {
            leftStopwatchActive = false;
            exitTime = videoUI.currentTime;
            waitTime = exitTime - arrivalTimeE;
            followerTime = -1;
            timeBetween = -1;
            situation = 'Aceito';
            pendingCars = true;
            const rotaryEvent = new RotaryEvent(
               `E${idE}`,
               situation,
               arrivalTimeE,
               exitTime,
               waitTime,
               leaderTime,
               followerTime,
               timeBetween,
               'Esquerda'
            );

            rotaryEvents.push(rotaryEvent);
            UI.updateTable(rotaryEvents);
            idE++;
            toggleE = true;
         }

      }

      if (e.code === 'KeyD') {

         if (toggleD) {
            rightStopwatchActive = true;
            arrivalTimeD = videoUI.currentTime;
            toggleD = false;
         } else {
            rightStopwatchActive = false;
            exitTime = videoUI.currentTime;
            waitTime = exitTime - arrivalTimeD;
            followerTime = -1;
            timeBetween = -1;
            situation = 'Aceito';
            pendingCars = true;
            const rotaryEvent = new RotaryEvent(
               `D${idD}`,
               situation,
               arrivalTimeD,
               exitTime,
               waitTime,
               leaderTime,
               followerTime,
               timeBetween,
               'Direita'
            );

            rotaryEvents.push(rotaryEvent);
            UI.updateTable(rotaryEvents);
            idD++;
            toggleD = true;
         }

      }

      if (e.code === 'KeyM') {

         if (!toggleLeader) {
            toggleLeader = !toggleLeader;
            leaderTime = videoUI.currentTime;
            timeBetweenStopwatchActive = true;
         } else {
            followerTime = videoUI.currentTime;
            timeBetween = followerTime - leaderTime;

            if (leftStopwatchActive) {


               waitTime = followerTime - arrivalTimeE;
               situation = 'Rejeitado';
               const rotaryEvent = new RotaryEvent(
                  `E${idE}`,
                  situation,
                  arrivalTimeE,
                  followerTime,
                  waitTime,
                  leaderTime,
                  followerTime,
                  timeBetween,
                  'Esquerda'
               );

               rotaryEvents.push(rotaryEvent);


            }

            if(rightStopwatchActive) {
               waitTime = followerTime - arrivalTimeD;
               situation = 'Rejeitado';
               const rotaryEvent = new RotaryEvent(
                  `D${idD}`,
                  situation,
                  arrivalTimeD,
                  followerTime,
                  waitTime,
                  leaderTime,
                  followerTime,
                  timeBetween,
                  'Direita'
               );

               rotaryEvents.push(rotaryEvent);
            }

            if (pendingCars) {
               // atribui o valor do seguidor de -1 para o valor real
               rotaryEvents.forEach((rotaryEvent) => {
                  rotaryEvent
                  if (rotaryEvent.followerTime === -1) {
                     rotaryEvent.followerTime = followerTime;
                     rotaryEvent.timeBetween = rotaryEvent.followerTime - rotaryEvent.leaderTime;
                  }

               });

               pendingCars = false;

            } else if (leftStopwatchActive || rightStopwatchActive) {


            } else {

               const rotaryEvent = new RotaryEvent(
                  -1,
                  -1,
                  -1,
                  -1,
                  -1,
                  leaderTime,
                  followerTime,
                  timeBetween,
                  -1
               );

               rotaryEvents.push(rotaryEvent);
            }

            UI.updateTable(rotaryEvents);
            leaderTime = followerTime;

         }


      }
      if (e.code === 'KeyX') {
         const removedEvent = rotaryEvents.pop();

         if(removedEvent.id !== -1) {
            if(removedEvent.id.substring(0, 1) === 'E') {
               idE--;
            } else {
               idD--;
            }
         }         
         UI.updateTable(rotaryEvents);
      }
   },

   downloadButtonHandler: (e) => {
      const matrixEvents = rotaryEvents.map((rotaryEvent) => {
         const array = [];
         array.push(rotaryEvent.id);
         array.push(rotaryEvent.situation);
         array.push(rotaryEvent.leaderTime);
         array.push(rotaryEvent.followerTime);
         array.push(rotaryEvent.timeBetween);
         array.push(rotaryEvent.arrivalTime);
         array.push(rotaryEvent.exitTime);
         array.push(rotaryEvent.waitTime);
         array.push(rotaryEvent.way)
         return array;
      });

      const formattedEvents = matrixEvents.map((arrayEvent) => {

         return (
            arrayEvent.map((value) => {
               
               if(value === -1) {
                  return '';
               }

               if(!isNaN(value)) {

                  return value.toFixed(2);
               } 
               return value;
            })
         );
      });
      
      
      const csv = 'ID;Situacao;Veiculos prioritarios;;;Veiculo via secundaria;;;\n;;Lider;Seguidor;Intervalo/brecha;Chegada;Saida/rejeicao;Tempo de espera;Faixa\n' + UI.toCsv(formattedEvents);
      console.log(csv);
      let hiddenElement = document.createElement('a');

      // SECOND APPROACH

      // hiddenElement.setAttribute('href','data:text/csv; charset=utf-8, ' + encodeURIComponent(csv));
      // hiddenElement.setAttribute('download', 'data.csv');
      // document.body.appendChild(hiddenElement);
      // hiddenElement.click();
      // document.body.removeChild(hiddenElement);
      hiddenElement.href = 'data:text/csv; charset=utf-8, ' + encodeURI(csv);
      hiddenElement.target = '_blank';
      hiddenElement.download = 'dados.csv';
      hiddenElement.click();

   }
}


// Event Listeners
videoUI.addEventListener('timeupdate', ListenersHandlers.timeUpdateHandler);
window.addEventListener('keyup', ListenersHandlers.keyUpHandler);
downloadButtonUI.addEventListener('click', ListenersHandlers.downloadButtonHandler);

// UI
const UI = {
   formatTime: (timeElapsedDisplay) => {

      let formattedTime;

      if (timeElapsedDisplay < 0) {
         timeElapsedDisplay = timeElapsedDisplay * -1;

         if (timeElapsedDisplay < 60) {
            if (timeElapsedDisplay < 10) {
               formattedTime = `-00:0${timeElapsedDisplay}`;
            }

            if (timeElapsedDisplay >= 10) {
               formattedTime = `-00:${timeElapsedDisplay}`;
            }

         } else {
            const seconds = timeElapsedDisplay % 60;
            const minutes = Math.trunc(timeElapsedDisplay / 60);

            if (seconds < 10) {
               formattedTime = `-0${minutes}:0${seconds}`;
            }

            if (seconds >= 10) {
               formattedTime = `-0${minutes}:${seconds}`;
            }

         }
      } else {
         if (timeElapsedDisplay < 60) {
            if (timeElapsedDisplay < 10) {
               formattedTime = `00:0${timeElapsedDisplay}`;
            }

            if (timeElapsedDisplay >= 10) {
               formattedTime = `00:${timeElapsedDisplay}`;
            }

         } else {
            const seconds = timeElapsedDisplay % 60;
            const minutes = Math.trunc(timeElapsedDisplay / 60);

            if (seconds < 10) {
               formattedTime = `0${minutes}:0${seconds}`;
            }

            if (seconds >= 10) {
               formattedTime = `0${minutes}:${seconds}`;
            }

         }
      }

      return formattedTime;
   },

   displayTime: (stopwatch, formattedTime) => {

      if (stopwatch === 'left') {
         leftStopwatchUI.lastElementChild.textContent = formattedTime;
         leftStopwatchUI.firstElementChild.textContent = `E${idE}: Tempo de espera`;

      }

      if (stopwatch === 'right') {
         rightStopwatchUI.lastElementChild.textContent = formattedTime;
         rightStopwatchUI.firstElementChild.textContent = `D${idD}: Tempo de espera`;

      }

      if (stopwatch === 'timeBetween') {
         timeBetweenStopwatchUI.lastElementChild.textContent = formattedTime;

      }
   },

   updateTable: (rotaryEvents) => {


      let content = '';

      rotaryEvents.forEach(rotaryEvent => {

         if(rotaryEvent.id === -1) {
            content += `
            <tr>
               <td></td>
               <td></td>
               <td>${rotaryEvent.leaderTime.toFixed(2)}s</td>
               <td>${rotaryEvent.followerTime.toFixed(2)}s</td>
               <td>${rotaryEvent.timeBetween.toFixed(2)}s</td>
               <td></td>
               <td></td>
               <td></td>
               <td></td>
            </tr>
            `;
         } else if(rotaryEvent.id.substring(0, 1) === 'E') {
            content += `
            <tr>
               <td>${rotaryEvent.id}</td>
               <td>${rotaryEvent.situation}</td>
               <td>${rotaryEvent.leaderTime.toFixed(2)}s</td>
               <td>${rotaryEvent.followerTime === -1 ? '' : `${rotaryEvent.followerTime.toFixed(2)}s`}</td>
               <td>${rotaryEvent.timeBetween === -1 ? '' : `${rotaryEvent.timeBetween.toFixed(2)}s`}</td>
               <td>${rotaryEvent.arrivalTime.toFixed(2)}s</td>
               <td>${rotaryEvent.exitTime.toFixed(2)}s</td>
               <td>${rotaryEvent.waitTime.toFixed(2)}s</td>
               <td>${rotaryEvent.way}</td>
               
            </tr>
            `;
         } else {
            content += `
         <tr>
            <td>${rotaryEvent.id}</td>
            <td>${rotaryEvent.situation}</td>
            <td>${rotaryEvent.leaderTime.toFixed(2)}s</td>
            <td>${rotaryEvent.followerTime === -1 ? '' : `${rotaryEvent.followerTime.toFixed(2)}s`}</td>
            <td>${rotaryEvent.timeBetween === -1 ? '' : `${rotaryEvent.timeBetween.toFixed(2)}s`}</td>
            <td>${rotaryEvent.arrivalTime.toFixed(2)}s</td>
            <td>${rotaryEvent.exitTime.toFixed(2)}s</td>
            <td>${rotaryEvent.waitTime.toFixed(2)}s</td>
            <td>${rotaryEvent.way}</td>
         </tr>
         `;
         }

         
      });

      tableUI.lastElementChild.innerHTML = content;
   },

   toCsv1: matrix => matrix.map(row => row.join(";")).join("\n"),

   toCsv: (matrix) => {
      return (
         matrix.map((row) => {
            return (
               row.join(";")
            );
         }).join('\n')
      );
   }
}

