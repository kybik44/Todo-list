function createTable(mass) {
    const $table = document.querySelector('.table');
    let str = '';
    $table.innerHTML = '';
    for (let el of mass) {

        $table.innerHTML += `
        <tr>
            <td>${el.firstName}</td>
            <td>${el.lastName}</td>
            <td>${el.age}</td>
        </tr>`
    }

}

export default createTable;