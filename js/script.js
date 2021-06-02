let $modal = document.querySelector(".modal");
let $modalEdit = document.querySelector(".edit-version");
let $btnOk = document.querySelector(".ok");
let $fields = document.querySelectorAll(".popup-field");
let $table = document.querySelector(".table");
let $btnGnrt = document.querySelector(".generate");
let btns = document.querySelectorAll("btn");
let $btnDelete = document.querySelector(".btn-delete");
let $btnEdit = document.querySelector(".btn-edit");

document.addEventListener("click", function (event) {
    const target = event.target;
    if (target.classList.contains('modal')) {
        toggleClass('close', $modalEdit);
        toggleClass('close', $modal);
    }
    if (target.classList.contains('close')) {
        toggleClass('close', $modalEdit);
        toggleClass('close', $modal);
    }
    if (target.classList.contains('ok')) {
        renderTable(addNewTask());
        toggleClass('close', $modal);
    }
    if (target.classList.contains('add-task')) toggleClass('open', $modal);

    if (target.classList.contains("btn-delete")) deleteTask(target.closest("tr"), addNewTask());
    if (target.classList.contains("btn-finish")) finishTask(target.closest("tr"), addNewTask());
    if (target.classList.contains("btn-restore")) restoreTask(target.closest("tr"), JSON.parse(localStorage.getItem("dataDel")));
    if (target.classList.contains('btn-edit')) {
        toggleClass('open', $modalEdit)
    };
    if (target.classList.contains("edit-ok")) {
        editTask("здесь должен передать ту строку которую редактирую, это конпка ок в модалке", addNewTask());
    }
    if (target.classList.contains("menu__link")) {
        renderTable(target.getAttribute('href'));
    }



});

(function init(data) {
    if (data !== []) {
        renderTable(data);
    }
})(addNewTask());


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
    let data = JSON.parse(localStorage.getItem("data")) || [];
    let newTask = [...$fields].reduce((obj, item) => {
        obj[item.name] = item.value;
        return obj;
    }, {});
    if (newTask.taskName !== "") {
        data.push(newTask);
    }
    localStorage.setItem("data", JSON.stringify(data));
    return data;
}




function deleteTask(targetTask, data) {
    let $colTd = targetTask.children;
    for (let el of $colTd) {
        for (let index in data) {
            if (el.textContent === data[index].taskName) {
                let dataDel = JSON.parse(localStorage.getItem("dataDel")) || [];
                dataDel.push(data[index]);
                localStorage.setItem("dataDel", JSON.stringify(dataDel));
                data.splice(index, 1);
                localStorage.setItem("data", JSON.stringify(data));
                targetTask.innerHTML = "";
            }
        }
    }
}

function editTask(targetTask, data) {
    let $colTd = targetTask.children;
    console.log($colTd)
    for (let el of $colTd) {
        for (let index in data) {
            if (el.textContent == data[index].taskName) {
                let $editFields = document.querySelectorAll(".popup-edit-field");
                data[index] = [...$editFields].reduce((obj, item) => {
                    obj[item.name] = item.value;
                    return obj;
                }, {});
                data.splice(index, 1, data[index]);
                localStorage.setItem("data", JSON.stringify(data));
                fillTable(data);
            }
        }
    }
}

function finishTask(targetTask, data) {
    let $colTd = targetTask.children;
    for (let el of $colTd) {
        for (let index in data) {
            if (el.textContent === data[index].taskName) {
                let dataFin = JSON.parse(localStorage.getItem("dataFin")) || [];
                dataFin.push(data[index]);
                localStorage.setItem("dataFin", JSON.stringify(dataFin));
                data.splice(index, 1);
                localStorage.setItem("data", JSON.stringify(data));
                targetTask.innerHTML = "";
            }
        }
    }
}
function restoreTask(targetTask, data){
    let $colTd = targetTask.children;
    for (let el of $colTd) {
        for (let index in data) {
            if (el.textContent === data[index].taskName) {
                dataDel = JSON.parse(localStorage.getItem("dataDel")) || [];
                data.push(data[index]);
                localStorage.setItem("data", JSON.stringify(data));
                dataDel.splice(index, 1);
                localStorage.setItem("dataDel", JSON.stringify(dataDel));
                targetTask.innerHTML = "";
            }
        }
    }
}


function renderTable(currHref, data = addNewTask()) {
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
    switch (currHref) {
        case "#main" || "":
            data = JSON.parse(localStorage.getItem("data")) || [];
            $mainTitle.innerHTML = "Текущие задачи";
            $table.innerHTML = data.reduce((str, item) => {
                str += `<tr>
                                <td>${ item.taskName }</td>
                                <td>${ item.taskDesc }</td>
                                <td>${ getPriority( +item.priority ) }</td>
                                <td><button class="btn-delete">Удалить</button>
                                    <button class="btn-edit">Редактировать</button>
                                    <button class="btn-finish">Выполнить</button>
                                </td>
                              </tr>`;
                return str
            }, '');
            break;
        case "#done":
            dataFin = JSON.parse(localStorage.getItem("dataFin")) || [];

            $mainTitle.innerHTML = "Выполненные задачи";
            $table.innerHTML = dataFin.reduce((str, item) => {
                str += `<tr>
                                <td>${ item.taskName }</td>
                                <td>${ item.taskDesc }</td>
                                <td>${ getPriority( +item.priority ) }</td>
                                <td><button class="btn-delete">Удалить</button>
                                    <button class="btn-edit">Редактировать</button>
                                </td>
                              </tr>`;
                return str
            }, '');
            break;
        case "#deleted":
            dataDel = JSON.parse(localStorage.getItem("dataDel")) || [];

            $mainTitle.innerHTML = "Удаленные задачи";
            $table.innerHTML = dataDel.reduce((str, item) => {
                str += `<tr>
                                <td>${ item.taskName }</td>
                                <td>${ item.taskDesc }</td>
                                <td>${ getPriority( +item.priority ) }</td>
                                <td><button class="btn-restore">Восстановить</button>
                                </td>
                              </tr>`;
                return str
            }, '');
            break;
        default:
            data = JSON.parse(localStorage.getItem("data")) || [];
            $mainTitle.innerHTML = "Текущие задачи";
            $table.innerHTML = data.reduce((str, item) => {
                str += `<tr>
                                <td>${ item.taskName }</td>
                                <td>${ item.taskDesc }</td>
                                <td>${ getPriority( +item.priority ) }</td>
                                <td><button class="btn-delete">Удалить</button>
                                    <button class="btn-edit">Редактировать</button>
                                    <button class="btn-finish">Выполнить</button>
                                </td>
                              </tr>`;
                return str
            }, '');
            break;
    }
}
