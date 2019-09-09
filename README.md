# Express Chat Mockup

This is a simple implementation of a chat user interface.

## To run:
1. Download the project
2. Run `npm install` in the root directory of the project
3. Run `npm run start` and go to `http://localhost:3000/` in your browser.

## Architecture
There are 2 routes - one that serves up the API endpoints (`chat.js`) and one that serves up the page itself (`index.js`). The former needs access to the data.json for GET and POST requests, and the latter needs access to it to render the initial page state. Thus, I stored the contents of `data.json` as a variable inside `data/data.js` and exported it, allowing both routes to be able to access it.

I chose EJS for templating as I've used it before and find it intuitive to mix Javascript in with familiar HTML syntax. I chose SASS to store variables and take advantage of being able to write different combinations of styles more easily. I decided to go with vanilla JS for the JavaScript functionality to avoid the bloat that comes with jQuery as well as to get a little more practice.

The submit event for the form gets handled by the `handleFormSubmission()` function. It prevents the form from being submitted if the message is greater than 140 characters - the mockup showed a character limit of 140 and not 160, I assume that this would be a Twitter-style "cannot submit if the message is over 140 characterss" and not an SMS style "everything from character 161 onward is in a new message" type of character limit. It then grabs the message from the input field, generates a unix timestamp in seconds, and then POSTS a new post to the API with that data using the Fetch API.

Each of the posts in the provided data have 4 fields: an ID, a user ID, a message, and a timestamp. I couldn't figure out what the id was used for or how it was generated, so I left it out of the posts that I created when submitting the form. Similarly, there are only 3 users. I didn't know what the user information for the person interacting with the mockup should be, so I left it out of posts that are submitted as well. When the `index.ejs` template reads a message that does not have a `user` field, it assumes that it was sent by the current user, and alternate styling is applied via a BEM-style modifier class.

When the chat route receives a POST request, it creates 2 objects: `newMessage`, which just contains the message and timestamp, and `response` which contains that data plus the two ways the timestamp needs to be formatted when displayed on the page. I did all timestamp formatting through Moment.js as I've used it before and it is intuitive and easier to read and work with than the Date() object. I do this formatting here as the EJS template is not going to automatically update with the new post when you submit, so it gets appended via the `appendUserMessageToDOM()` method in `main.js`. If you refresh at this point, the message will already be in the state object that is passed to the EJS template and the timestamp formatting will be handled in the template instead.

`newMessage` is pushed to the posts array in the state object, and `response`, which includes the formatted timestamps, is returned as the response. The `newMessage` object isn't really necessary, and I could have just pushed the `response` object to the state, but I didn't want to pollute the state with a post that included keys that none of the default posts had. I figured it would be easier to just update newMessage with user ID and post ID when I figured out how to generate them.

Once `handleFormSubmission()` gets a response from the API, it calls `appendUserMessageToDOM()` which does exactly that and also binds the touch and hover event handlers to it. 

Because the state object is kept in memory for as long as the server is up, messages you send will persist on refresh until you kill the server.
