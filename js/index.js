//Messages
const ajaxErrorMessage = "Error occurred while doing AJAX to ";
//Contacts Layout Div
const contactsLayout = document.getElementById("contactsLayout");
const contactsButtonHolder = document.getElementById("contactsButtonHolder");
//Buttons
const contactButton = document.getElementById('showContacts');
const orderByCountryButton = document.getElementById('sortOnCountry');
const addNewContactButton = document.getElementById('addNewContact');
const changeContactsLayoutButton = document.getElementById('contactsChangeStyle');
//end of Buttons
const contactsListHolder = document.getElementById("contactsListHolder");

//Api route constants
const apiUrl = "https://my-json-server.typicode.com/animeshroydev/SampleJSONPlaceholder";
const routeUsers = apiUrl + "/users";
const routeCompanies = apiUrl + "/companies";
const routeContacts = apiUrl + "/contacts";
const routeDB = apiUrl + "/db";
//Http methods
const get = "GET";
const post = "POST";
const put = "PUT";
const del = "DELETE";
//Flags
var isContactsStyleChanged = false;

$(document).ready(function () {
    contactButton.addEventListener('click', getAllContacts);
    orderByCountryButton.addEventListener('click', getAllContactsOrderByCountryAsc);
    addNewContactButton.addEventListener('click', drawContactForm);
    changeContactsLayoutButton.addEventListener('click', changeContactsLayout);

});

function changeContactsLayout(event) {
    if (!isContactsStyleChanged) {
        isContactsStyleChanged = true;
        $('#contactsLayout').css(
            {
                'flex-direction': 'row',
            }
        );
        $('#contactsButtonHolder').css(
            {
                'flex-direction': 'column',
                'justify-content': 'space-between',
                'align-items': 'flex-start',
                'height': '50vh'
            }
        );
        $('#contactsListHolder').css(
            {
                // 'border': 'none',
                'height': '50vh'
            }
        );
    } else {
        isContactsStyleChanged = false;
        $('#contactsLayout').css(
            {
                'flex-direction': 'column',
            }
        );
        $('#contactsButtonHolder').css(
            {
                'flex-direction': 'row',
            }
        );
        $('#contactsListHolder').css(
            {
                'border': '1px solid black'
            }
        );
    }
    event.preventDefault();
}

function loadData(urlPassed, verb) {
    return $.ajax({
        method: verb,
        url: urlPassed,
        dataType: 'JSON'
    }).fail(function () {
        console.log(ajaxErrorMessage + urlPassed);
    });
}

function passData(urlPassed, verb, payload) {
    return $.ajax({
        method: verb,
        url: urlPassed,
        headers: {
            'Content-Type': 'application/json;charset=utf - 8'
        },
        data: payload,
        dataType: 'JSON'
    }).fail(function () {
        console.log(ajaxErrorMessage + urlPassed);
    });
}

function emptyElement(element) {
    $(element).empty();
}

function getAllContacts() {
    let contactsPromise = loadData(routeContacts, get);
    contactsPromise.then(drawContacts);
}

function getAllContactsOrderByCountryAsc() {
    let contactsPromise = loadData(routeContacts, get);
    contactsPromise.then(sortContactsOnCountryASC);
}

function sortContactsOnCountryASC(contacts) {
    contacts.sort((c1, c2) => {
        let c1Country = c1.country.toLowerCase();
        let c2Country = c2.country.toLowerCase();
        return c1Country.localeCompare(c2Country);
    });
    drawContacts(contacts);
}

function drawContacts(contacts) {
    emptyElement(contactsListHolder);
    createContactHeaderDiv();
    contacts.forEach(element => {
        createContact(element);
    });
}

function createContact(contactData) {
    contactDiv = document.createElement('div');

    idDiv = document.createElement('div');
    $(idDiv).addClass('contact')
        .text(contactData.id)
        .appendTo(contactDiv);

    nameDiv = document.createElement('div');
    $(nameDiv).addClass('contact')
        .text(contactData.name)
        .appendTo(contactDiv);

    countryDiv = document.createElement('div');
    $(countryDiv).addClass('contact')
        .text(contactData.country)
        .appendTo(contactDiv);

    phoneDiv = document.createElement('div');
    $(phoneDiv).addClass('contact')
        .text(contactData.phone)
        .appendTo(contactDiv);

    $(contactDiv).addClass('contact-holder')
        .appendTo(contactsListHolder)
        .click(function () {
            $(this).remove();
        });
}

function createContactHeaderDiv() {
    headerDiv = document.createElement('div');

    idDiv = document.createElement('div');
    $(idDiv).addClass('contact-header')
        .text("ID")
        .appendTo(headerDiv);

    nameDiv = document.createElement('div');
    $(nameDiv).addClass('contact-header')
        .text("NAME")
        .appendTo(headerDiv);

    countryDiv = document.createElement('div');
    $(countryDiv).addClass('contact-header')
        .text("COUNTRY")
        .appendTo(headerDiv);

    phoneDiv = document.createElement('div');
    $(phoneDiv).addClass('contact-header')
        .text("PHONE")
        .appendTo(headerDiv);

    $(headerDiv).addClass('contact-holder')
        .appendTo(contactsListHolder)
        .click(function () {
            $(this).remove();
        });
}

function drawContactForm() {
    emptyElement(contactsListHolder);
    $("<form>",
        {
            id: 'contactForm'
        }
    ).append(
        $("<input>",
            {
                id: 'name',
                type: 'text',
                placeholder: 'Contact Name',
                name: 'name',
            }
        )
    ).append(
        $("<input>",
            {
                id: 'country',
                type: 'text',
                placeholder: 'Contact Country',
                name: 'country',
            }
        )
    ).append(
        $("<input>",
            {
                id: 'phone',
                type: 'text',
                placeholder: 'Contact Phone',
                name: 'phone',
            }
        )
    ).append(
        $("<input>",
            {
                id: 'submitContact',
                type: 'submit',
                value: 'CreateNewContact',
            }
        )
    ).appendTo(contactsListHolder)
        .submit(sendNewContact);
}

function sendNewContact(event) {
    event.preventDefault();
    let name = document.getElementById('name').value;
    let country = document.getElementById('country').value;
    let phone = document.getElementById('phone').value;

    let contact = {
        "name": name,
        "country": country,
        "phone": phone
    }
    jsonedContact = JSON.stringify(contact);
    let returnedContactPromise = passData(routeContacts, post, jsonedContact);
    emptyElement(contactsListHolder);
    createContactHeaderDiv();
    returnedContactPromise.then(createContact);
}
