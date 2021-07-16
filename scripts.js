const rotaryEvents = [];

// UI Elements
const videoUI = document.querySelector('#rotary-video');
const tableUI = document.querySelector('.data-table');
const firstStopwatchUI = document.querySelector('#first-stopwatch');
const secondStopwatchUI = document.querySelector('#second-stopwatch');

// Global Variables
let firstStopWatchActive = false;
let secondStopWatchActive = false;
let toggleLeader = false;

let id = 0,
   arrivalTime = 0,
   exitTime = 0,
   waitTime = 0,
   leaderTime = 0,
   followerTime = 0;



// Event Listeners Handlers
const ListenersHandlers = {

   timeUpdateHandler: (e) => {
      if (firstStopWatchActive) {

         const timeElapsed = (e.target.currentTime - arrivalTime);
         const timeElapsedDisplay = Math.trunc(timeElapsed);
         const formattedTime = UI.formatTime(timeElapsedDisplay);
         UI.displayTime('first', formattedTime);
      }

      if (!firstStopWatchActive) {

         UI.displayTime('first', '00:00');

      }

      if (secondStopWatchActive) {
         const timeElapsed = (e.target.currentTime - leaderTime);
         const timeElapsedDisplay = Math.trunc(timeElapsed);
         const formattedTime = UI.formatTime(timeElapsedDisplay);
         UI.displayTime('second', formattedTime);
      }

   },

   keyUpHandler: (e) => {

      if (e.code === 'KeyW') {
         firstStopWatchActive = true;
         arrivalTime = videoUI.currentTime;
      }
      if (e.code === 'KeyA') {
         firstStopWatchActive = false;
         exitTime = videoUI.currentTime;
         waitTime = exitTime - arrivalTime;

      }
      if (e.code === 'KeyM') {

         if (!toggleLeader) {
            toggleLeader = !toggleLeader;
            leaderTime = videoUI.currentTime;
            secondStopWatchActive = true;
         } else {
            followerTime = videoUI.currentTime;
            timeBetween = followerTime - leaderTime;

            const rotaryEvent = new RotaryEvent(
               id,
               'situation',
               arrivalTime.toFixed(2),
               exitTime.toFixed(2),
               waitTime.toFixed(2),
               leaderTime.toFixed(2),
               followerTime.toFixed(2),
               timeBetween.toFixed(2)
            );

            rotaryEvents.push(rotaryEvent);
            UI.updateTable(rotaryEvents);

            id++;
            leaderTime = followerTime;
         }


      }
      if (e.code === 'KeyX') {
         rotaryEvents.pop();
         id--;
         UI.updateTable(rotaryEvents);

      }
   }
}


// Event Listeners
videoUI.addEventListener('timeupdate', ListenersHandlers.timeUpdateHandler);
window.addEventListener('keyup', ListenersHandlers.keyUpHandler);



// Data Management
const Data = {

}

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

      if (stopwatch === 'first') {
         firstStopwatchUI.lastElementChild.textContent = formattedTime;
         firstStopwatchUI.firstElementChild.textContent = `V${id}: Chegada`;

      }
      if (stopwatch === 'second') {
         secondStopwatchUI.lastElementChild.textContent = formattedTime;

      }
   },

   updateTable: (rotaryEvents) => {

      let content = '';

      rotaryEvents.forEach(rotaryEvent => {

         content += `
         <tr>
            <td>V${rotaryEvent.vehicleID}</td>
            <td>${rotaryEvent.situation}</td>
            <td>${rotaryEvent.leader}</td>
            <td>${rotaryEvent.follower}</td>
            <td>${rotaryEvent.timeBetween}</td>
            <td>${rotaryEvent.vehicleArrived}</td>
            <td>${rotaryEvent.vehicleLeft}</td>
            <td>${rotaryEvent.waitTime}</td>
         </tr>
         `;
      });

      tableUI.lastElementChild.innerHTML = content;

   }
}