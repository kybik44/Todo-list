let $modal = document.querySelector(".modal");
let $fields = document.querySelectorAll(".popup-field");
let $table = document.querySelector(".table");

document.addEventListener("click", function (event) {

    const target = event.target;
    let $parentTr = target.closest("tr");
    if (target.classList.contains('modal') || target.classList.contains('close')) {
        toggleClass('close', $modal);
    }
    if (target.classList.contains('ok')) {
        renderTable(addNewTask());
        toggleClass('close', $modal);
    }
    if (target.classList.contains('add-task')) toggleClass('open', $modal);
    if (target.classList.contains("btn-delete")) CRUD($parentTr, addNewTask(), "dataDel", "mainData");
    if (target.classList.contains("btn-delete-gg")) CRUD($parentTr, JSON.parse(localStorage.getItem("dataFin")), undefined, "dataFin");
    if (target.classList.contains("btn-finish")) CRUD($parentTr, addNewTask(), "dataFin", "mainData");
    if (target.classList.contains("btn-restore")) CRUD($parentTr, JSON.parse(localStorage.getItem("dataDel")), "mainData", "dataDel");
    if (target.classList.contains("menu__link")) renderTable(target.getAttribute('href'));

});

renderTable("#main");
function toggleClass(evt, versModal) {
    if (evt === "open") versModal.classList.add("active");
    if (evt === "close") {
        versModal.classList.remove("active");
        validate().clearForm();
    }
}

function validate() {
    function clearForm() {
        for (let inpt of $fields) {
            inpt.value = '';
        }
    }
    return {
        clearForm
    }
}


function addNewTask() {
    let mainData = JSON.parse(localStorage.getItem("mainData")) || [];
    let newTask = [...$fields].reduce((obj, item) => {
        obj[item.name] = item.value;
        return obj;
    }, {});
    if (newTask.taskName !== "") {
        mainData.push(newTask);
    }
    localStorage.setItem("mainData", JSON.stringify(mainData));
    return mainData;
}

function CRUD(targetTask, mainData, currData, dataName) {
    let $colTd = targetTask.children;
    for (let el of $colTd) {
        for (let index in mainData) {
            if (el.textContent === mainData[index].id) {
                console.log(mainData, currData, dataName)
                let currentData = JSON.parse(localStorage.getItem(currData)) || [];
                if (currData) currentData.push(mainData[index]);
                mainData.splice(index, 1);
                localStorage.setItem(currData, JSON.stringify(currentData));
                targetTask.innerHTML = "";
                localStorage.setItem(dataName, JSON.stringify(mainData));
            }
        }
    }
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

   
    $table.innerHTML = data.reduce((str, item) => {
        str += `<tr>    <td>${ item.id}</td>
                        <td>${ item.taskName }</td>
                        <td>${ item.taskDesc }</td>
                        <td>${ getPriority( +item.priority ) }</td>
                        <td>
                        ${href === "#main" ? `<button class="btn-delete">Удалить</button>` : ""}
                        ${href === "#main" ? `<button class="btn-edit">Редактировать</button>` : ""}
                        ${href === "#main" ? `<button class="btn-finish">Выполнить</button>` : ""}
                        ${href === "#deleted" ? `<button class="btn-restore">Восстановить</button>` : ""}
                        ${href === "#done" ? `<button class="btn-delete-gg">Удалить полностью</button>` : ""}
                        ${href === "#done" ? `<button class="btn-edit">Редактировать</button>` : ""}
                        </td>
                      </tr>`;
        return str
    }, '');
}
