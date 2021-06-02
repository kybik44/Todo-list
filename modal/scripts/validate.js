function validate(){
    const fields = document.querySelectorAll('.popup-form input');
    const clearForm = () => {
        for(let field of fields){
            field.value = '';
        }
    }

    return { clearForm }
}

export default validate;