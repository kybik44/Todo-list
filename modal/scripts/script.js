import toggleModal from './toggle-modal.js';
import createTable from './table.js';

let data = [];

const ls = localStorage.getItem('usersTable');

if(ls){
    data = JSON.parse(ls)
    console.log(data)
}


createTable(data);

document.addEventListener('click', function(event){
    const target = event.target;
    if(target.classList.contains('modal')) toggleModal('close');
    if(target.classList.contains('close')) toggleModal('close');
    if(target.classList.contains('ok')) {
        const fields = document.querySelectorAll('.field');

        let newUser = [...fields].reduce((obj, item) => {
            obj[item.name] = item.value;
            return obj;
        }, {});
        data.push(newUser);
        localStorage.setItem('usersTable', JSON.stringify(data));
        createTable(data);

        toggleModal('close');
    };
    if(target.classList.contains('add-user')) toggleModal('open');
})