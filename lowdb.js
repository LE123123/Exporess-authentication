var shortid = require('shortid');
var low = require('lowdb')
var FileSync = require('lowdb/adapters/FileSync')
var adapter = new FileSync('db.json')
var db = low(adapter)

db.defaults({ topic: [], author: []}).write()

var sid = shortid.generate();
db.get('author')
    .push({
        id: sid,
        name: 'taeho',
        profile: 'data scientist'
    }).write();

db.get('topic')
    .push({
        id: shortid.generate(),
        title: 'PostgreSQL',
        description: 'PostgreSQL is ...',
        author: sid
    }).write();