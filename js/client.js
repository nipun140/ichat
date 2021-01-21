const socket = io('https://infinite-ravine-90571.herokuapp.com');
// Get DOM elements in respective Js variables
const form = document.querySelector('.send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container');
var audio = new Audio('images/ting.mp3');

function append(message, position) {
    const messageElement = document.createElement('div'); //new message element
    messageElement.innerHTML = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.insertBefore(messageElement, form);
}

const name = prompt('enter your name?');
socket.emit('new-user-joined', name); //socket.emmit is used to send custom events to node server

//event listener ,listening to the event sent by nodeServer
socket.on('user-joined', name => {
    append(`${name} has joined the chat`, 'right')
    audio.play();
})

form.addEventListener('submit', (event) => {
    console.log('submitted')
    event.preventDefault();
    let message = messageInp.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message); //sending a 'send' event to the node server
    messageInp.value = '';
})

//event listener ,listening to the event 'recieve' sent by nodeServer //data is an object
socket.on('receive', data => {
    append(`${data.name}: ${data.message}`, 'left')
    audio.play();
})

//event listener ,listening to the event 'leave' sent by nodeServer 
socket.on('leave', name => {
    append(`${name} Left the chat`, 'left')
    audio.play();
})

socket.emit('disconnect', )