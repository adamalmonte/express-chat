const form = document.getElementById('js-message-composer');
form.addEventListener('submit', appendTimestampAndPOST);

const messageField = form.querySelector('.js-message');
const maxChars = 140;

const messages = document.getElementsByClassName('js-post-message');
for (let i = 0; i < messages.length; i++) {
    messages[i].addEventListener('touchstart', toggleMessageActiveState);
    messages[i].addEventListener('mouseover', toggleMessageActiveState);
    messages[i].addEventListener('mouseout', toggleMessageActiveState);
}

function appendTimestampAndPOST(ev) {
    ev.preventDefault();

    if (messageField.value.length > maxChars) {
        return false;
    }

    const timestampField = form.querySelector('.js-timestamp');
    timestampField.value = Math.floor(new Date().getTime() / 1000);

    const formBody = {
        'message': messageField.value,
        'ts': timestampField.value
    };

    fetch('/chat/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formBody)
    })
    .then(res => res.json())
    .then(response => {
        console.log('Success:', JSON.stringify(response));
        appendMessage(response);
        messageField.value = '';
    })
    .catch(error => console.error('Error:', error));
}

function appendMessage(data) {
    const postsContainer = document.getElementById('js-posts');

    const newMessage = document.createElement('div');
    newMessage.className = "post post--user";

    const postHTML = `
        <div class="post__image-wrapper">
            <img class="post__image" src="/images/better.jpg">
        </div>
        <div class="post__content">
            <div class="post__header">
                <div class="post__timestamp">
                    <span class="post__time-from-now">${data.tsFromNow}</span>
                </div>
            </div>
            <div class="post__message  js-post-message">
                <div class="post__message-front">
                    ${data.message}
                </div>
                <div class="post__message-back">
                    <span><i class="material-icons">calendar_today</i> active since ${data.tsFormatted}</span> 
                </div> 
            </div>
        </div>            
    `;

    newMessage.innerHTML = postHTML;
    newMessage.ontouchstart = toggleMessageActiveState;
    newMessage.onmouseover = toggleMessageActiveState;
    newMessage.onmouseout = toggleMessageActiveState;

    postsContainer.appendChild(newMessage);
}

function toggleMessageActiveState(ev) {
    const el = ev.target;
    el.classList.toggle('post__message--active');
}

function characterCounter() {
    const counterEl = document.getElementById('js-character-count');

    const errorClass = 'message-composer__form--error';
    const warningClass = 'message-composer__form--warning';

    messageField.onkeydown = function() {
        setTimeout(function(){
            let remaining = maxChars - messageField.value.length;
            counterEl.innerHTML = remaining;
            
            if (remaining < 0) {
                form.classList.add(errorClass);
            } else if (remaining <= 20) {
                form.classList.add(warningClass);
            } else {
                if (form.classList.contains(errorClass)){
                    form.classList.remove(errorClass)
                }
                if (form.classList.contains(warningClass)){
                    form.classList.remove(warningClass)
                }
            }
        }, 1);
    }
}

characterCounter();
