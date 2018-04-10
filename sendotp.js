
var accountSid = 'AC3946abe1e89b227300553f7a7b5bc958'; // Your Account SID from www.twilio.com/console
var authToken = '52e98114a6d844d6ddd91c5747e00ca8';   // Your Auth Token from www.twilio.com/console

var twilio = require('twilio');
var client = new twilio(accountSid, authToken);

client.messages.create({
    body: 'this is first message through twilio',
    to: '+919555011355',  // Text this number
    from: '(912) 244-7559' // From a valid Twilio number
})
.then((message) => console.log(message.sid));