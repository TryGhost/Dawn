var gelfling = require('./') // require('gelfling')

var msg = {
  short_message: 'Message at ' + (+new Date),
  full_message: ('start/' + new Buffer(20000).toString('base64') + '/end').replace(/\//g, '\n'),
  id: 34,
  some_other_field: 'Dude!\nIt\'s a multi line\nMessage!',
  // full_message: {a: 1, b: 2},
  obj_field: {a: 1, b: 2},
  file: '/usr/home/thing.js',
  // line: 345
}

var client = gelfling('localhost', 12201, {defaults: {line: function(msg) { return msg.id }}})
client.send(msg, function(err) { console.log(err || 'all done') })

