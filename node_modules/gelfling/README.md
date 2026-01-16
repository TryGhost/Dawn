# GELF (Graylog2) messages in node.js

Includes chunked messages, so messages can be any size
(couldn't find another node.js lib that does this)

```javascript
var gelfling = require('gelfling')

var client = gelfling()

client.send('Message', function(err) { console.log('Sent') })

client.send({ short_message: 'Message', facility: 'myApp', level: gelfling.INFO })

var complexClient = gelfling('localhost', 12201, {
  defaults: {
    facility: 'myApp',
    level: gelfling.INFO,
    short_message: function(msg) { var txt = msg.txt; delete msg.txt; return txt }
    myAvg: function(msg) { return msg.myTotal / msg.myCount }
  }
})

complexClient.send({ txt: 'Hi', myTotal: 1337, myCount: 23 })
```
