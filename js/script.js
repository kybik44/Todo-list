let $modal = document.querySelector(".modal");
let $fields = document.querySelectorAll(".popup-field");
let $table = document.querySelector(".table");
let currTaget;
document.addEventListener("click", function (event) {

    const target = event.target;
    let $parentTr = target.closest("tr");
    if (target.classList.contains('modal') || target.classList.contains('close') ) toggleClass('close', $modal);
    if (target.classList.contains('ok')) {
        renderTable(addNewTask());
        toggleClass('close', $modal);
    }
    if (target.classList.contains('edit')) {
        renderTable(JSON.parse(localStorage.getItem("mainData")));
        toggleClass('close', $modal);
    }
    if (target.classList.contains('add-task')) toggleClass('open', $modal);
    if (target.classList.contains("btn-delete")) CD($parentTr, addNewTask(), "dataDel", "mainData");
    if (target.classList.contains("btn-delete-fin")) CD($parentTr, JSON.parse(localStorage.getItem("dataFin")), undefined, "dataFin");
    if (target.classList.contains("btn-delete-del")) CD($parentTr, JSON.parse(localStorage.getItem("dataDel")), undefined, "dataDel");
    if (target.classList.contains("btn-finish")) CD($parentTr, addNewTask(), "dataFin", "mainData");
    if (target.classList.contains("btn-restore")) CD($parentTr, JSON.parse(localStorage.getItem("dataDel")), "mainData", "dataDel");
    if (target.classList.contains("btn-edit")) {
        toggleClass('open', $modal);
        currTaget = target;
    };
    if(target.classList.contains("edit")){
        editTask(currTaget.closest("tr"), JSON.parse(localStorage.getItem("mainData")));
    }
    if (target.classList.contains("menu__link")) renderTable(target.getAttribute('href'));

});

renderTable("#main");
function toggleClass(evt, versModal, index) {
    if (evt === "open") versModal.classList.add("active");
    if (evt === "close") {
        versModal.classList.remove("active");
        // validate().clearForm();
    }
}

function validate() {
    function clearForm() {
        for (let inpt of $fields) {
            inpt.value = '';
        }
    }
    function emptyFields(){
        
    }
    return {
        clearForm
    }
}


function addNewTask() {
    let mainData = JSON.parse(localStorage.getItem("mainData")) || [];
    let newTask  = [...$fields].reduce((obj, item) => {
        obj[item.name] = item.value;
        return obj;
    }, {});
    if (newTask.taskName !== "") {
        mainData.push(newTask);
    }
    localStorage.setItem("mainData", JSON.stringify(mainData));
    return mainData;
}
function CD(target, mainData, currData, dataName) {
        mainData.forEach((element, index) => {
        if (+target.dataset.id === index) {
            let currentData = JSON.parse(localStorage.getItem(currData)) || [];
            if (currData) currentData.push(element);
            mainData.splice(index, 1);
            localStorage.setItem(currData, JSON.stringify(currentData));
            target.innerHTML = "";
            localStorage.setItem(dataName, JSON.stringify(mainData));
        }
    });
}
function editTask(targetTr, mainData){
    console.log(targetTr);
    for(let key in mainData){
        if (targetTr.dataset.id === key) {
            mainData[key] = [...$fields].reduce((obj, item) => {
                console.log(item.value)
                obj[item.name] = item.value;
                return obj;
            }, {}); 
            
        }
    };
    localStorage.setItem("mainData", JSON.stringify(mainData));
    renderTable("#main");
}

function renderTable(href) {
    let $mainTitle = document.querySelector(".main__title");

    function getPriority(val) {
        switch (val) {
            case 0:
                return "Триальное";
            case 1:
                return "Бессрочное";
            case 2:
                return "Срочное";
            default:
                break;
        }
    }
    function getTitle(href) {
        switch (href) {
            case "#done":
                return "Выполненные задачи";
            case "#deleted":
                return "Удаленные задачи";
            case "#main":
                return "Текущие задачи";
            default:
                return "Текущие задачи";
        }
    }
   
    function getData(href) {
        switch (href) {
            case "#done":
                return "dataFin";
            case "#deleted":
                return "dataDel";
            case "#main":
                return "mainData";
            default:
                return "mainData";
        }
    }
    $mainTitle.innerHTML = getTitle(href);
    let data = JSON.parse(localStorage.getItem(getData(href))) || [];
    console.log(data)
    $table.innerHTML = data.reduce((str, item, index) => {
        str += `<tr data-id="${index}">    
                        <td>${ item.taskName }</td>
                        <td>${ item.taskDesc }</td>
                        <td>${ getPriority( +item.priority ) }</td>
                        <td>
                        ${href === "#main" ? `<button class="btn-delete">Удалить</button>` : ""}
                        ${href === "#main" ? `<button class="btn-edit">Редактировать</button>` : ""}
                        ${href === "#main" ? `<button class="btn-finish">Выполнить</button>` : ""}
                        ${href === "#deleted" ? `<button class="btn-restore">Восстановить</button>` : ""}
                        ${href === "#deleted" ? `<button class="btn-delete-del">Удалить полностью</button>` : ""}
                        ${href === "#done" ? `<button class="btn-delete-fin">Удалить полностью</button>` : ""}
                        ${href === "#done" ? `<button class="btn-edit">Редактировать</button>` : ""}
                        </td>
                      </tr>`;
        return str
    }, '');
}
