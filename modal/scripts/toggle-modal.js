import validate from './validate.js';

function toggleModal(event){
    const modal = document.querySelector('.modal');
    const valid = validate();

    if(event === 'open') modal.classList.add('active');
    if(event === 'close') {
        modal.classList.remove('active');
        valid.clearForm();
    }
}

export default toggleModal;