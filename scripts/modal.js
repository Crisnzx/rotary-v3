const buttonOpenModalUI = document.querySelector('#modal-btn');
const modalUI = document.querySelector('#modal-overlay');

const formModalUI = document.querySelector('#modal-content form');
const inputModalUI = document.querySelector('#modal-content input');
const cancelButtonUI = document.querySelector('#cancel-button');


const Modal = {
   close: () => {
      modalUI.classList.add('off');

   },
   open: () => {
      modalUI.classList.remove('off');
   }
}


const HandleEvents = {
   openModalHandler: (e) => {
      Modal.open();
   },
   submitVideoHandler: (e) => {
      e.preventDefault();
      Modal.close();
      e.target.value = '';
   
      const url = inputModalUI.value;
      videoUI.src = url;
   },

   clickModalHandler: (e) => {
      if(e.target.id === 'modal-overlay' || e.target.id === 'cancel-button') {
         Modal.close();
      }
      
   }
}




buttonOpenModalUI.addEventListener('click', Modal.open);
formModalUI.addEventListener('submit', HandleEvents.submitVideoHandler);
modalUI.addEventListener('click', HandleEvents.clickModalHandler);