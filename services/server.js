var net = require('net');
var events = require('events');
var clients = require('./clients');

const ServerEE = new events.EventEmitter();
var sockets = [];
var server = undefined;

const escapeSequence = new Uint8Array([0xE2, 0x90, 0x84]);

function control(socket, header){
    if (header.headerType == 'authentificate'){
        if (header.id){
            if (header.id == "none"){
                var registered = clients.registerClient().id;
                socket.id = registered.id;
                return registered;
            }
            else if (clients.getById(header.id)){
                clients.getById(header.id).connect();
                return null;
            }
            else return {type: "err", msg:"Invalid id provided"};
        }
    }
}

/**
 * 
 * @param {net.Socket} socket 
 * @param {Objects} toSend 
 */
function sendTcp(socket, type, payload){
    var toSend = new Object();
    toSend.type = type;
    
    socket.write(payload.toString() + '␄');
}

exports.initialize = function(adress, port){
    console.log('socket initializing');
    server = net.createServer(function(socket){
        socket.name = socket.remoteAddress + ':' + socket.remotePort;
        socket.id = undefined;
        socket.msgBuffer = new Buffer(0);
        socket.on('data', function(data){
            socket.msgBuffer += data;
            while (socket.msgBuffer.indexOf("␄") != -1){
                var index = socket.msgBuffer.indexOf("␄");
                var newMsg = socket.msgBuffer.toString('utf8', 0,index - 1);
               try {
                   newMsg = JSON.parse(newMsg);
                   //deux types de message : header pour le contrôle, msg pour les messages.
                   if (newMsg.type == 'header'){
                       var res = control(this, newMsg)
                   }
               } catch (error) {
                   if (typeof(error) == SyntaxError){
                       console.log('invalid JSON');
                   }
               }
            }
        });
    });
    server.listen(2121, function(){
        console.log("service listening");
    });
    
}


exports.ServerEventEmitter = ServerEE;