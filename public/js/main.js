/* Posts */
const postsContainer   = document.getElementById('js-post-container');
const messages         = document.getElementsByClassName('js-messages');

/* Form Elements */
const form             = document.getElementById('js-message-composer');
const counterEl        = document.getElementById('js-character-count');
const messageField     = form.querySelector('.js-message');
const timestampField   = form.querySelector('.js-timestamp');

/* Classes */
const formErrorClass   = 'message-composer__form--error';
const formWarningClass = 'message-composer__form--warning';

/* Other constants */
const maxChars         = 140;

/* Event Bindings */
messageField.onkeydown = updateCharCount;
form.onsubmit          = handleFormSubmission;

for (let i = 0; i < messages.length; i++) {
    messages[i].ontouchend   = toggleMessageActiveStateTouch;
    messages[i].onmouseover  = toggleMessageActiveState;
    messages[i].onmouseout   = toggleMessageActiveState;
}

/* Function Calls */
_scrollMessagesToBottom(); // do this on page load in case the height of the messages > the height of the browser


/* Functions */
function handleFormSubmission(ev) {
    ev.preventDefault();

    if (messageField.value.length > maxChars) {
        return false;
    }

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

        appendUserMessageToDOM(response);

        _checkFormErrorClass();
        _checkFormWarningClass();

        messageField.value = '';
        counterEl.innerHTML = maxChars;
    })
    .catch(error => console.error('Error:', error));
}

function appendUserMessageToDOM(data) {
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

    newMessage.innerHTML   = postHTML;
    newMessage.ontouchend  = toggleMessageActiveStateTouch;
    newMessage.onmouseover = toggleMessageActiveState;
    newMessage.onmouseout  = toggleMessageActiveState;

    postsContainer.appendChild(newMessage);
    _scrollMessagesToBottom();
}

function toggleMessageActiveState(ev) {
    if (_isMobile()) {
        ev.preventDefault();
        ev.stopPropagation();
    }
    const el = ev.target;
    el.classList.toggle('post__message--active');
}

function toggleMessageActiveStateTouch(ev) {
    toggleMessageActiveState(ev);
}

function updateCharCount(ev) {
    setTimeout(function(){
        let remaining = maxChars - messageField.value.length;
        counterEl.innerHTML = remaining;
        
        if (remaining < 0) {
           _checkFormWarningClass();
            form.classList.add(formErrorClass);
        } else if (remaining <= 20) {
            _checkFormErrorClass();
            form.classList.add(formWarningClass);
        } else {
            _checkFormErrorClass();
            _checkFormWarningClass();
        }
    }, 1);
}

/* Helper functions */
function _checkFormErrorClass() {
    if (form.classList.contains(formErrorClass)){
        form.classList.remove(formErrorClass)
    }
}

function _checkFormWarningClass() {
    if (form.classList.contains(formWarningClass)){
        form.classList.remove(formWarningClass)
    }    
}

function _scrollMessagesToBottom() {
    postsContainer.scrollTop = postsContainer.scrollHeight;
}

function _isMobile() {
    return navigator.userAgent.match(/Android|iPhone|iPad|iPod|Opera Mini|BlackBerry|IEMobile|WPDesktop/i);
}
