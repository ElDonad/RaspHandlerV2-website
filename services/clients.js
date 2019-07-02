//keep track of all the clients, the available pins, and perform all operation client-related.
var server = require('./server');

var clients = [];

class Client{
    constructor(id){
        this.id = id;
        this.state = 'disconnected';
    }

    connect() {
        this.state = 'connected';
    }
}

exports.initialize = function(restore){
    if (restore){

    }
    server.ServerEventEmitter.on('newMsg', function(msg){
        console.log('new message');
    })
}

exports.registerClient = function(){
    var newClient = new Client(Math.floor(Math.random() * 1000000));
    newClient.connect();
    clients.push(newClient);
    return newClient;
}

exports.Client = Client;

/**
 * @returns {Client}
 */
exports.getById = function(id){
    clients.forEach(client => {
        if (client.id == id){
            return client;
        }
    });
}