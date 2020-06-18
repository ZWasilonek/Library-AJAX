const ADDRESS = "http://localhost:8282"

let form_div = $("#form_div")
let form = $("form")
let title = $("#title")
let author = $("#author")
let isbn = $("#isbn")
let publisher = $("#publisher")
let type = $("#type")
let table = $(".table tbody")

$(() => {
    form_div.hide()
    let allEnteredArrayData = [title, author, isbn, publisher, type];

    form.on("submit", (ev) => {
        ev.preventDefault()
        if (areAllFieldsNotEmpty(allEnteredArrayData)) {
            this.addBook(table, isbn, title, author, publisher, type)
        } else setErrorInFields(allEnteredArrayData);
    })
    table.on('click', '.delete', (ev) => {

        let id = $(ev.target).attr('data-id')
        deleteBook(table, id)
    })
    table.on('click', '.details', (ev) => {

        let id = $(ev.target).attr('data-id')
        getDetails(table, id)
    })

    table.on('click', '.edit', (ev) => {
        let id = $(ev.target).attr('data-id')
        let currentIsbn = $(ev.target).attr('data-isbn')
        $('.book-action-title').html(`EDYTUJ KSIĄŻKĘ O ID ${id}`)
        if (form_div.is(":hidden")) {
            form_div.show()
        } else if (currentIsbn !== isbn.val()) {
            form_div.show()
        } else {
            form_div.hide()
        }
        getEditBookData(id)
    })

    $("#add").on("click", () => {
        $('.book-action-title').html('DODAJ KSIĄŻKĘ')
        allEnteredArrayData.forEach((item, index, array) => {
            item.val('');
        })
        if (form_div.is(":hidden")) {
            form_div.show()
        } else {
            form_div.hide()
        }
    })
    fetchBooks(table)
})

function addBook(table, isbn, title, author, publisher, type) {
    $.ajax({
        url: ADDRESS + "/books",
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({
            isbn: isbn.val(),
            title: title.val(),
            author: author.val(),
            publisher: publisher.val(),
            type: type.val()
        }),
        type: "POST"
    }).done(() => {
        isbn.val("")
        title.val("")
        author.val("")
        publisher.val("")
        type.val("")
        fetchBooks(table)
    })
}

function fetchBooks(table) {
    $.ajax({
        url: ADDRESS + "/books",
        type: "GET",
        dataType: "json"
    }).done((data) => {
        table.html("")
        data.forEach(item => addRow(table, item))
    })
}

function setErrorInFields(enteredInputArrayData) {
    const digitRegx = new RegExp(/\d/);
    const notDigitRegx = new RegExp(/\D/);
    const emptyError = 'pole nie może być puste'
    const tooShortStrError = 'wymagane są przynajmniej 2 znaki';
    const hasDigitsError = 'w tym polu używanie cyfr jest niedozwolone'
    const notDigitsError = 'dozwolone tylko cyfry';

    enteredInputArrayData.forEach((data, index, array) => {
        let inputData = data.val();
        if (inputData === '') {
            data.css('background-color', '#ffcccc');
            data.attr('placeholder', emptyError);
        }
        if (inputData !== '' && data.is('#title') && inputData.length < 2) {
            data.css('background-color', '#ffcccc');
            data.val('');
            data.attr('placeholder', tooShortStrError);
        }
        if (inputData !== '' && data.is('#author') && digitRegx.test(inputData)) {
            data.css('background-color', '#ffcccc');
            data.val('');
            data.attr('placeholder', hasDigitsError);
        }
        if (inputData !== '' && data.is('#isbn') && notDigitRegx.test(inputData)) {
            data.css('background-color', '#ffcccc');
            data.val('');
            data.attr('placeholder', notDigitsError);
        }
        if (inputData !== '' && data.is('#type') && digitRegx.test(inputData)){
            data.css('background-color', '#ffcccc');
            data.val('');
            data.attr('placeholder', hasDigitsError);
        }
    })
}

function getDetails(table, id) {
    $.ajax({
        url: ADDRESS + "/books/" + id,
        type: "GET",
        dataType: "json"
    }).done((data) => {
        showDetails(table, id, data)
    })
}

function showDetails(table, id, data) {
    let item = table.find("#" + id)
    if (item.html() === "") {
        item.html(`<div>${data.title},${data.publisher}, ${data.isbn}</div>`)
    }
    if (item.is(":hidden")) {
        item.show(200)
    } else {
        item.hide(200)
    }
}

function addRow(table, item) {
    let row = $(
    `<tr>
        <th scope="row">${item.id}</th>
        <td>${item.title}</td>
        <td>
            <button class="btn btn-info details" data-id="${item.id}">Szczegóły</button>
            <button class="btn btn-warning edit" data-id="${item.id}" data-isbn="${item.isbn}">Edytuj</button>
            <button class="btn btn-danger delete" data-id="${item.id}">Usuń</button>
        </td>
        <tr><td id="${item.id}" colspan="3" style="display:none;"></td></tr>
    </tr>`)
    table.append(row);
}

function deleteBook(table, id) {

    $.ajax({
        url: ADDRESS + "/books/" + id,
        type: "DELETE",
        dataType: "json"
    }).done(() => {
        fetchBooks(table)
    })
}

function getEditBookData(id) {
    $.ajax({
        url: ADDRESS + "/books/" + id,
        type: "GET",
        dataType: "json"
    }).done((data) => {
        editBook(data)
    })
}

function editBook(data) {
    title.val(data.title)
    author.val(data.author)
    isbn.val(data.isbn)
    publisher.val(data.publisher)
    type.val(data.type)
}

function areAllFieldsNotEmpty(enteredArrayData) {
    let result = false;
    enteredArrayData.forEach((data, index, array) => {
        result = data.val() !== '';
    })
    return result;
}