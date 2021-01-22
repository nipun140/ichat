// Get DOM elements in respective Js variables
const form = document.querySelector('.send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container');
var audio = new Audio('images/ting.mp3');
let modal = document.querySelector('.modal');
let nameForm = document.querySelector('.enterChatForm');
let nameInp = document.querySelector('#nameInp');

//window close event
window.onbeforeunload = function(event) {
    event.returnValue = "are you sure?";

};

//window load event
window.addEventListener('load', (event) => {
    setTimeout(() => {
        nameForm.style.display = 'flex';
    }, 500)
});

//for inserting new messages
function append(message, position) {
    const messageElement = document.createElement('div'); //new message element
    messageElement.innerHTML = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.insertBefore(messageElement, form);
}

//for inserting joining/leaving messages in center
function appendCenter(message) {
    const centerElem = document.createElement('p');
    centerElem.innerHTML = message;
    centerElem.classList.add('center');
    messageContainer.insertBefore(centerElem, form);
}

//enter name from form
nameForm.addEventListener('submit', (event) => {
    event.preventDefault();
    var name = nameInp.value;
    nameForm.style.animation = 'moveMoreDown 1s forwards';

    nameForm.addEventListener("webkitAnimationEnd", () => { //after animation ends i.e from goes down
        modal.style.display = 'none';

        const socket = io('https://infinite-ravine-90571.herokuapp.com'); ////////////CONECTION TO NODESERVER//////////////////////
        socket.emit('new-user-joined', name); //socket.emmit is used to send custom events to node server

        //event listener ,listening to the event sent by nodeServer
        socket.on('user-joined', name => {
            appendCenter(`<span>${name}</span> has joined the chat`)
            audio.play();
        })

        //display the users in the p tag in inedx.html
        socket.on('displayUsers', users => {
            console.log('display users');
            var myArray = Object.values(users);
            document.getElementById("users").innerHTML = `<span>In The Meeting:</span> ${myArray}`;
        })

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            let message = messageInp.value;
            append(`<span>You:</span> ${message}`, 'right');
            socket.emit('send', message); //sending a 'send' event to the node server
            messageInp.value = '';
        })

        //event listener ,listening to the event 'recieve' sent by nodeServer //data is an object
        socket.on('receive', data => {
            append(`<span>${data.name}:</span> ${data.message}`, 'left')
            audio.play();
        })

        //event listener ,listening to the event 'leave' sent by nodeServer 
        socket.on('leave', name => {
            appendCenter(`<span>${name}</span> Left the chat`)
            audio.play();
        })

    });
})