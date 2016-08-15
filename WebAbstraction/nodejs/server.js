// Load required modules
var http = require("http"); // http server core module
var express = require("express"); // web framework external module
var io = require("socket.io"); // web socket external module
var easyrtc = require("easyrtc"); // EasyRTC external module
// Setup and configure Express http server. Expect a subfolder called "static" to be the web root.
var httpApp = express();
//httpApp.use(express.static(__dirname + "/"));
// Start Express http server on port 8080
var webServer = http.createServer(httpApp).listen(4000, "128.233.174.141");
// Start Socket.io so it attaches itself to Express server
var socketServer = io.listen(webServer, {
    "log level": 1
});
var peopleConnectedToServer = {};
var fingerprintsToname = {};
var chessBoards = {};
var winnerOfBoard = {};
var whiteWins = {};
var blackWins = {};
var moveQueue = [];
var gameInProgress = false;

//easyrtc.setOption("logLevel", "debug");
// Overriding the default easyrtcAuth listener, only so we can directly access its callback
easyrtc.events.on("easyrtcAuth", function (socket, easyrtcid, msg, socketCallback, callback) {
    easyrtc.events.defaultListeners.easyrtcAuth(socket, easyrtcid, msg, socketCallback, function (err, connectionObj) {
        if (err || !msg.msgData || !msg.msgData.credential || !connectionObj) {
            callback(err, connectionObj);
            return;
        }
        connectionObj.setField("credential", msg.msgData.credential, {
            "isShared": false
        });
        console.log("[" + easyrtcid + "] Credential saved!", connectionObj.getFieldValueSync("credential"));
        callback(err, connectionObj);
    });
});
// To test, lets print the credential to the console for every room join!
easyrtc.events.on("roomJoin", function (connectionObj, roomName, roomParameter, callback) {
    console.log("[" + connectionObj.getEasyrtcid() + "] Credential retrieved!", connectionObj.getFieldValueSync("credential"));
    if (roomName != "default")
        if (peopleConnectedToServer[connectionObj.getUsername()]) peopleConnectedToServer[connectionObj.getUsername()].roomsJoined[roomName] = roomName;
    easyrtc.events.defaultListeners.roomJoin(connectionObj, roomName, roomParameter, callback);
});
/* easyrtc.events.on("connection" , function(socketObj,  easyrtcid, callback) {
 //  peopleConnectedToServer



 }); */
easyrtc.events.on("roomLeave", function (connectionObj, roomName, roomParameter, callback) {
    //console.log("leaving " );
    easyrtc.events.defaultListeners.roomLeave(connectionObj, roomName, roomParameter, callback);
});
// Start EasyRTC server
var rtc = easyrtc.listen(httpApp, socketServer, null, function (err, rtcRef) {
    console.log("Initiated");
    rtcRef.events.on("roomCreate", function (appObj, creatorConnectionObj, roomName, roomOptions, callback) {


        console.log("roomCreate fired! Trying to create: " + roomName);
        appObj.events.defaultListeners.roomCreate(appObj, creatorConnectionObj, roomName, roomOptions, callback);
    });
});
var onEasyrtcMsg = function (connectionObj, msg, socketCallback, next) {
        switch (msg.msgType) {
            case "personConnected":
                if (peopleConnectedToServer[msg.msgData.name] == null) {
                    peopleConnectedToServer[msg.msgData.name] = msg.msgData;
                    fingerprintsToname[msg.msgData.fingerprint] = msg.msgData.name;
                    socketCallback({
                        "msgType": "success"
                    });
                    console.log("Message Received from client.", msg.msgData);
                } else {
                    socketCallback({
                        "msgType": "failure"
                    });
                }
                break;
            case "printData":
                console.log(peopleConnectedToServer);
                // printBoard();


                break;
            case "getData":
                console.log("data being sent to sever " + peopleConnectedToServer[msg.msgData]);
                socketCallback({
                    "msgType": peopleConnectedToServer[msg.msgData]
                });
                break;
            case "updateData":
                console.log("trying to update " + msg.msgData.name);
                peopleConnectedToServer[msg.msgData.name] = msg.msgData;
                easyrtc.events.emitDefault("easyrtcMsg", connectionObj, msg, socketCallback, next);
                break;
            case "changeColor":
                peopleConnectedToServer[msg.msgData.name].color = msg.msgData.color;
                break;
            case "updateId":
                if (peopleConnectedToServer[msg.msgData.name]) {
                    var conApp = connectionObj.getApp();
                    var isConnected;
                    conApp.connection(peopleConnectedToServer[msg.msgData.name].uniqueID, function (error, conObject) {
                        isConnected = (conObject != null);
                    });
                    if (isConnected) {
                        socketCallback({
                            "msgType": "loginAlready"
                        });
                    } else if (peopleConnectedToServer[msg.msgData.name]) {
                        peopleConnectedToServer[msg.msgData.name].uniqueID = msg.msgData.newId;
                        for (var i in peopleConnectedToServer[msg.msgData.name].connectedList) {
                            peopleConnectedToServer[i].connectedList[msg.msgData.name] = msg.msgData.newId;
                        }
                        socketCallback({
                            "msgType": peopleConnectedToServer[msg.msgData.name]
                        });

                    } else {
                        socketCallback({
                            "msgType": "failure"
                        });
                    }
                } else {
                    socketCallback({
                        "msgType": "failure"
                    });
                }
                break;
            case "fingerprintCheck":
                if (fingerprintsToname[msg.msgData.fingerprint]) {
                    socketCallback({
                        "msgType": "found",
                        "msgData": peopleConnectedToServer[fingerprintsToname[msg.msgData.fingerprint]]
                    });
                } else socketCallback({
                    "msgType": "failure"
                });
                console.log(msg.msgData.fingerprint);
                break;
            case "removalFromFingerprint":
                console.log(fingerprintsToname[peopleConnectedToServer[msg.msgData].fingerprint]);
                delete fingerprintsToname[peopleConnectedToServer[msg.msgData].fingerprint];
                peopleConnectedToServer[msg.msgData] = "";
                break;
            case "getRoomList":
                if (peopleConnectedToServer[msg.msgData.name]) {
                    socketCallback({
                        "msgType": "rooms",
                        "msgData": peopleConnectedToServer[msg.msgData.name].roomsJoined
                    });
                } else easyrtc.events.emitDefault("easyrtcMsg", connectionObj, msg, socketCallback, next);
                break;
          
            default:
                easyrtc.events.emitDefault("easyrtcMsg", connectionObj, msg, socketCallback, next);
                break;
        }
    }
    ;
easyrtc.events.on("easyrtcMsg", onEasyrtcMsg);
var onDisconnectMsg = function (connectionObj, next) {
    console.log(connectionObj.getUsername() + " is disconnecting");
    if (peopleConnectedToServer[connectionObj.getUsername()]) {
        var connApp = connectionObj.getApp();
        for (i in peopleConnectedToServer[connectionObj.getUsername()].connectedList) {
            connApp.connection(peopleConnectedToServer[i].uniqueID, function (error, connObject) {
                easyrtc.events.emitDefault("emitEasyrtcMsg", connObject, "updateDisconnect", {
                    "msgData": connectionObj.getUsername()
                }, function (a) {
                }, function (b) {
                });
            });
        }
    }
    easyrtc.events.emitDefault("disconnect", connectionObj, next);
};
easyrtc.events.on("disconnect", onDisconnectMsg);
