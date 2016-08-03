var isConnected = false; // checks if connected to server

var connectedPeopleCanveses = {}; // maybe have some different name here.

var roomsJoined = {};
var roomJoining = {};
var messageCommunicationMode = "reliable";
/*
 connects to sevrer
 */
function pageLoad() {
    easyrtc.getDatachannelConstraints = function () {
        return {ordered: false, maxRetransmits: 2}
    };
    connect();

}
/*
 Perosn stored in nodejs server as shown down below

 */
function person(name, easyrtcid, color) {
    this.name = name;
    this.uniqueID = easyrtcid;
    this.connectedList = {};
    this.reconnecting = {};
    this.color = color;
    this.roomsJoined = {};
    this.numberOfConnections = {};
}
//Person class of this client
var selfEasyrtcid = "";
var selfEasyrtcid = "";
var connectList = {}; // dictionary with easyrtcids storing connected people with **server**
var channelIsActive = {}; // tracks which channels are active
/*
 connect to server

 */
function connect() {

    easyrtc.setServerListener(serverListener);

    easyrtc.setAcceptChecker(acceptTheCall);

    easyrtc.enableDebug(false);
    easyrtc.enableVideo(false);
    easyrtc.enableAudio(false);
    easyrtc.enableVideoReceive(false);
    easyrtc.enableAudioReceive(false);
    var name = document.getElementById("name").value;
    if (!easyrtc.setUsername(name)) {
        alert("Invalid username " + name);
        return;
    }
    easyrtc.enableDataChannels(true);
    easyrtc.setDataChannelOpenListener(openListener);
    easyrtc.setDataChannelCloseListener(closeListener);
    easyrtc.setPeerListener(messageFromClient);
    easyrtc.setRoomOccupantListener(occupantListener);
    easyrtc.setRoomEntryListener(roomEntryListener);
    easyrtc.connect("easyrtc.dataMessaging", loginSuccess, loginFailure);
    easyrtc.setDisconnectListener(function () {
        easyrtc.sendServerMessage("printData", selfEasyrtcid, function (a, b) {
        }, function (a, b) {
        });
    });
}

/*
 as the name suggests
 */
function disconnectFromServer() {
    for (var i in selfEasyrtcid.connectedList) {
        if (easyrtc.getConnectStatus(selfEasyrtcid.connectedList[i]) === easyrtc.IS_CONNECTED) {
            startCall(selfEasyrtcid.connectedList[i]);
        }
    }
    var roomsIn = easyrtc.getRoomsJoined();
    for (var i in roomsIn) {
        if (roomsIn[i]) {
            leaveRoom(i);
        }
    }
    selfEasyrtcid = null;
    easyrtc.disconnect();
    logoutFromDjango();
}

/**
 * Listen messages from server
 * @param msgType
 * @param msgData
 * @param targeting
 */

function serverListener(msgType, msgData, targeting) {
    var buttonOfAbruptedSession = document.getElementById("connect_" + msgData);
    while (buttonOfAbruptedSession.hasChildNodes()) {
        buttonOfAbruptedSession.removeChild(buttonOfAbruptedSession.lastChild);
    }
    var label = document.createTextNode("trying to reconnect...");
    buttonOfAbruptedSession.appendChild(label);
    selfEasyrtcid.reconnecting[msgData] = true;
    if (connectedPeopleCanveses[easyrtc.idToName(msgData)]) {
        connectedPeopleCanveses[easyrtc.idToName(msgData)].removeAll();
        connectedPeopleCanveses[easyrtc.idToName(msgData)].updateDest(null, null);
    }
}
/**
 * listen messages from other clients
 * @param who
 * @param msgType
 * @param content
 */
function messageFromClient(who, msgType, content) {
    // Escape html special characters, then add linefeeds.
    
    if (msgType == "msg") {
        alert(easyrtc.idToName(who) + " Signalled")
    } else if (msgType == "leavingRoom") {
        if (content.roomName != "default") {
            selfEasyrtcid.numberOfConnections[content.name]--;
            alert(content.name + " left the room " + content.roomName);
        }
    } else if (msgType == "signalDisconnect") {
        connectList[who] = false;
        if (connectedPeopleCanveses[easyrtc.idToName(who)]) {
            connectedPeopleCanveses[easyrtc.idToName(who)].removeAll();
            connectedPeopleCanveses[easyrtc.idToName(who)].updateDest(null, null);
        }
        delete selfEasyrtcid.connectedList[easyrtc.idToName(who)];
        easyrtc.sendServerMessage("updateData", selfEasyrtcid, function (a, b) {
        }, function (a, b) {
        });
        closeListener(who);
        alert("disconnected by " + easyrtc.idToName(who));
    } else if (msgType == "drawing") {
        // call the function for of you p5 with the data you want, data is stored in content.content
        if (content.targetRoom) {
            if (roomsJoined[content.targetRoom]) roomsJoined[content.targetRoom].addToDrawing(who, content.content);
        } else {
            if (connectedPeopleCanveses[easyrtc.idToName(who)]) connectedPeopleCanveses[easyrtc.idToName(who)].addToDrawing(who, content.content);
        }
    }

    else if (msgType == "roomConnectAcceptReuqest") {
        console.log(easyrtc.idToName(who) + "got me here" + selfEasyrtcid.name);
        startRoomCallHelper(who);
    }
    else if (msgType == "increaseNumberOfConnectionsWithMe") {
        if (selfEasyrtcid.numberOfConnections[easyrtc.idToName(who)])
            selfEasyrtcid.numberOfConnections[easyrtc.idToName(who)]++;
        else
            selfEasyrtcid.numberOfConnections[easyrtc.idToName(who)] = 1;
    }

    else {
        console.log(content);
    }
}

function openListener(otherParty) {
    channelIsActive[otherParty] = true;
    updateButtonState(otherParty);
}

function closeListener(otherParty) {
    channelIsActive[otherParty] = false;
    updateButtonState(otherParty);
}


function PeopleListener(roomName, occupantList, isPrimary) {
    console.log(roomName);
    console.log(occupantList);
    connectList = occupantList;
    var otherClientDiv = document.getElementById("listOfPeople");
    var label, button;
    var list = document.getElementById("listOfPeople");
    console.log("i Cam to connectedList");
    //    console.log(selfEasyrtcid);
    var nodesToBeDeleted;
    while (list.hasChildNodes()) {
        list.removeChild(list.lastChild);
    }
    if (selfEasyrtcid) {
        for (var easyrtcid in connectList) {


            if (!document.getElementById("LI" + easyrtc.idToName(easyrtcid)) && (easyrtc.idToName(easyrtcid) != easyrtcid) && easyrtc.getConnectStatus(easyrtcid) === easyrtc.NOT_CONNECTED) {

                var listElement = document.createElement("LI");
                listElement.id = "LI" + easyrtc.idToName(easyrtcid);
                var rowGroup = document.createElement("span");
                var rowLabel = document.createTextNode(easyrtc.idToName(easyrtcid) + " ");
                rowGroup.appendChild(rowLabel);
                button = document.createElement("button");
                button.id = "connect_" + easyrtc.idToName(easyrtcid);
                button.onclick = function (easyrtcid) {
                    return function () {
                        startCall(easyrtcid);
                    };
                }(easyrtcid);
                label = document.createTextNode("Connect");
                button.appendChild(label);
                rowGroup.appendChild(button);
                button = document.createElement("button");
                button.id = "send_" + easyrtcid;
                button.onclick = function (easyrtcid) {
                    return function () {
                        sendStuffP2P(easyrtcid);
                    };
                }(easyrtcid);
                label = document.createTextNode("Send Message");
                button.appendChild(label);
                //rowGroup.appendChild(button);
                otherClientDiv.appendChild(rowGroup);
                updateButtonState(easyrtcid);
                listElement.appendChild(rowGroup);
                list.appendChild(listElement);
            }
        }
    }
    /*if (Objects.keys(occupantList).length > 0) {
     var rowLabel = document.createTextNode( "   Nobody else logged in to talk to...  ");
     rowLabel.id = "nobodyText"
     otherClientDiv.appendChild( rowLabel);
     }*/
}

function occupantListener(roomName, occupants, isPrimary) {
    //    console.log("hello");
    // if (roomName === null) {
    //     return;
    // }
    var roomId = genRoomOccupantName(roomName);
    var roomDiv = document.getElementById(roomId);
    if (!roomDiv) {
        addRoom(roomName, "", false);
        roomDiv = document.getElementById(roomId);
    } else {
        jQuery(roomDiv).empty();
    }
    for (var easyrtcid in occupants) {
        var button;
        if (roomName == "default") {
            button = document.createElement("button");
            PeopleListener(roomName, occupants, isPrimary);
            refreshRoomList();
            return;
        } else button = document.createElement("label");
        // button.onclick = (function(roomname, easyrtcid) {
        //     return function() {
        //         sendMessage(easyrtcid, roomName);
        //     };
        // })(roomName, easyrtcid);


        var presenceText = "";
        if (occupants[easyrtcid].presence) {
            presenceText += "(";
            if (occupants[easyrtcid].presence.show) {
                presenceText += "show=" + occupants[easyrtcid].presence.show + " ";
            }
            if (occupants[easyrtcid].presence.status) {
                presenceText += "status=" + occupants[easyrtcid].presence.status;
            }
            presenceText += ")";
        }
        var button1 = document.createElement("a");
        button1.href = "javascript:void(0)";
        button1.onclick = function () {
            console.log("hello");
            startCall(easyrtcid);
        };
        button1.innerHTML = easyrtc.idToName(easyrtcid);
        button1.style = "top-margin:5px";
        /*       easyrtc.sendServerMessage("getData", easyrtc.idToName(easyrtcid), function (a, b) {
         button1.style = "color:#"+a.color;

         }, function (a, b) {
         });       */
    }
    //roomDiv.appendChild(button1);
    refreshRoomList();
    //PeopleListener(roomName, occupants, isPrimary);
}
function updateButtonState(otherEasyrtcid) {

    console.log(easyrtc.idToName(otherEasyrtcid));
    if (selfEasyrtcid) {
        if (!selfEasyrtcid.reconnecting[easyrtc.idToName(otherEasyrtcid)]) {
            var isConnected = channelIsActive[otherEasyrtcid];
            var moreCheckOfConnection;
            var buttonElement = document.getElementById("connect_" + easyrtc.idToName(otherEasyrtcid));
            if (buttonElement) {
                while (buttonElement.hasChildNodes()) {
                    buttonElement.removeChild(buttonElement.lastChild);
                }
                var label = document.createTextNode((isConnected ? "disc" : "C") + "onnect");
                if (isConnected) {
                    var eleToBeDeleted = document.getElementById("LI" + easyrtc.idToName(otherEasyrtcid));
                    eleToBeDeleted.parentNode.removeChild(eleToBeDeleted);
                }
                else
                    buttonElement.appendChild(label);
            }
        }
    }
}
/**
 * make the connection with th other if not already connected
 * if connected it disconnects
 * @param otherEasyrtcid
 */

function startCall(otherEasyrtcid) {
    if (easyrtc.getConnectStatus(otherEasyrtcid) === easyrtc.NOT_CONNECTED) {
        try {
            console.log(easyrtc.call);

            easyrtc.call(otherEasyrtcid, function (caller, media) { // success callback
                if (media === "datachannel") {
                    // console.log("made call succesfully");
                    easyrtc.sendDataP2P(otherEasyrtcid, "signalConnection", selfEasyrtcid);
                }
            }, function (errorCode, errorText) {
                connectList[otherEasyrtcid] = false;
                closeListener(otherEasyrtcid);
                easyrtc.showError(errorCode, errorText);
            }, function (wasAccepted) {
                if (wasAccepted) {
                    console.log(easyrtc.idToName(otherEasyrtcid));
                    selfEasyrtcid.reconnecting[easyrtc.idToName(otherEasyrtcid)] = false;
                    updateButtonState(otherEasyrtcid);
                    easyrtc.sendServerMessage("getData", easyrtc.idToName(otherEasyrtcid), function (a, b) {
                        a.connected = true;
                        selfEasyrtcid.connectedList[a.name] = a.uniqueID;
                        if (selfEasyrtcid.numberOfConnections && selfEasyrtcid.numberOfConnections[a.name])
                            selfEasyrtcid.numberOfConnections[a.name]++;
                        else
                            selfEasyrtcid.numberOfConnections[a.name] = 1;
                        connectedPeopleCanveses[easyrtc.idToName(otherEasyrtcid)] = p5canvas(otherEasyrtcid, null, selfEasyrtcid.color);
                        easyrtc.sendServerMessage("updateData", selfEasyrtcid, function (a, b) {
                        }, function (a, b) {
                        });
                    }, function (a, b) {
                    });
                }
            });
        } catch (callerror) {
            console.log("saw call error ", callerror);
        }
    } else {

        if (!selfEasyrtcid.connectedList[easyrtc.idToName(otherEasyrtcid)]) {
            easyrtc.sendDataP2P(otherEasyrtcid, "signalConnection", selfEasyrtcid);
            console.log(easyrtc.idToName(otherEasyrtcid));
            selfEasyrtcid.reconnecting[easyrtc.idToName(otherEasyrtcid)] = false;
            updateButtonState(otherEasyrtcid);
            easyrtc.sendServerMessage("getData", easyrtc.idToName(otherEasyrtcid), function (a, b) {
                a.connected = true;
                selfEasyrtcid.connectedList[a.name] = a.uniqueID;
                if (selfEasyrtcid.numberOfConnections && selfEasyrtcid.numberOfConnections[a.name])
                    selfEasyrtcid.numberOfConnections[a.name]++;
                else
                    selfEasyrtcid.numberOfConnections[a.name] = 1;
                connectedPeopleCanveses[easyrtc.idToName(otherEasyrtcid)] = p5canvas(otherEasyrtcid, null, selfEasyrtcid.color);
                easyrtc.sendServerMessage("updateData", selfEasyrtcid, function (a, b) {
                }, function (a, b) {
                });
            }, function (a, b) {
            });


            easyrtc.sendDataWS(otherEasyrtcid, "increaseNumberOfConnectionsWithMe", "");
        }
        else {
            easyrtc.showError("Already Connected to " + easyrtc.idToName(otherEasyrtcid));
        }
    }
}


function disconnectFromOtherClient(otherEasyrtcid) {


    connectList[otherEasyrtcid] = false;
    closeListener(otherEasyrtcid);
    if (connectedPeopleCanveses[easyrtc.idToName(otherEasyrtcid)]) {
        connectedPeopleCanveses[easyrtc.idToName(otherEasyrtcid)].removeAll();
        connectedPeopleCanveses[easyrtc.idToName(otherEasyrtcid)].updateDest(null, null);
    }

    easyrtc.sendDataP2P(otherEasyrtcid, "signalDisconnect", selfEasyrtcid);
    delete selfEasyrtcid.connectedList[easyrtc.idToName(otherEasyrtcid)];
    easyrtc.sendServerMessage("updateData", selfEasyrtcid, function (a, b) {
    }, function (a, b) {
    });

    selfEasyrtcid.numberOfConnections[easyrtc.idToName(otherEasyrtcid)]--;
    if (selfEasyrtcid.numberOfConnections && selfEasyrtcid.numberOfConnections[easyrtc.idToName(otherEasyrtcid)] == 0)
        easyrtc.hangup(otherEasyrtcid);

}


function startRoomCall(otherEasyrtcid) {

    roomJoining[easyrtc.idToName(otherEasyrtcid)] = true;
    console.log("starRoomCall" + easyrtc.idToName(otherEasyrtcid));
    easyrtc.sendDataWS(otherEasyrtcid, "roomConnectAcceptReuqest", "");


}

function startRoomCallHelper(otherEasyrtcid) {


    if (easyrtc.getConnectStatus(otherEasyrtcid) === easyrtc.NOT_CONNECTED) {
        try {
            easyrtc.call(otherEasyrtcid, function (caller, media) { // success callback
                if (media === "datachannel") {

                }
            }, function (errorCode, errorText) {
                connectList[otherEasyrtcid] = false;
                closeListener(otherEasyrtcid);
                easyrtc.showError(errorCode, errorText);
            }, function (wasAccepted) {
                if (wasAccepted) {
                    var nameOfId = easyrtc.idToName(otherEasyrtcid);
                    console.log(nameOfId);
                    if (selfEasyrtcid.numberOfConnections && selfEasyrtcid.numberOfConnections[nameOfId] >= 1) {
                        console.log("hi");
                        selfEasyrtcid.numberOfConnections[nameOfId]++;
                    }
                    else {
                        console.log("hi");
                        selfEasyrtcid.numberOfConnections[nameOfId] = 1;
                    }
                }
            });
        } catch (callerror) {
            console.log("saw call error ", callerror);
        }
    } else {
        var nameOfId = easyrtc.idToName(otherEasyrtcid);
        if (selfEasyrtcid.numberOfConnections && selfEasyrtcid.numberOfConnections[nameOfId] >= 1) {
            console.log("hi");
            selfEasyrtcid.numberOfConnections[nameOfId]++;
        }
        else {
            console.log("hi");
            selfEasyrtcid.numberOfConnections[nameOfId] = 1;
        }
        easyrtc.sendDataWS(otherEasyrtcid, "increaseNumberOfConnectionsWithMe", "");


    }
}

/**
 * send data using datachannel
 * @param otherEasyrtcid
 * @param type
 * @param data
 */
function sendStuffP2Pdata(otherEasyrtcid, type, data) {
    if (easyrtc.getConnectStatus(otherEasyrtcid) === easyrtc.IS_CONNECTED) {
        easyrtc.sendDataP2P(otherEasyrtcid, type, data);
    } else {
        easyrtc.showError("NOT-CONNECTED", "not connected to " + easyrtc.idToName(otherEasyrtcid) + " yet.");
    }
}
/**
 * success callback to server connection
 * @param easyrtcid
 */
function loginSuccess(easyrtcid) {
    console.log("i am " + easyrtcid);
    var name = easyrtc.idToName(easyrtcid);
    var color = document.getElementById("colorPicker").value;
    selfEasyrtcid = new person(easyrtc.idToName(easyrtcid), easyrtcid, color);
    //preson connected checks if person is connected or not
    easyrtc.sendServerMessage("personConnected", selfEasyrtcid, function (a, b) {
        console.log(a, "    ", b);
        if (a == "failure") {
            easyrtc.sendServerMessage("updateId", {
                "name": easyrtc.idToName(easyrtcid),
                "newId": easyrtcid,
            }, function (a, b) {
                if (a == "loginAlready") {
                    delete selfEasyrtcid;
                    easyrtc.disconnect();
                    alert("You are already logged in");

                } else {
                    isConnected = true;

                    selfEasyrtcid = a;
                    selfEasyrtcid.numberOfConnections = {};
                    for (var i in selfEasyrtcid.connectedList) {
                        startCall(selfEasyrtcid.connectedList[i]);
                    }
                    easyrtc.sendServerMessage("getRoomList", {
                        "name": easyrtc.idToName(easyrtcid),
                    }, function (a, b) {
                        connectWithRooms(b);
                    }, function (a, b) {
                    });
                }
            }, function (a, b) {
            });

        } else {
            isConnected = true;
        }
    }, function (a, b) {
        console.log(a, "    ", b);
    });
}
/**
 *
 * @param list of rooms you want to connect
 */
function connectWithRooms(b) {
    console.log(b);
    for (var i in b) {
        console.log(i);
        if (i != "default") {
            connectRoom(i);
        }
    }
}

/**
 * connect with a particular room
 * @param roomName
 */
function connectRoom(roomName) {
    easyrtc.joinRoom(roomName, "", function () {
        console.log(roomName);
        console.log(selfEasyrtcid.color);
        // roomsJoined[roomName] = p5canvas(null, roomName, selfEasyrtcid.color);
        //                    selfEasyrtcid.roomsJoined[roomName] = roomName;
        /* we'll geta room entry event for the room we were actually added to */
    }, function (errorCode, errorText, roomName) {
        easyrtc.showError(errorCode, errorText + ": room name was(" + roomName + ")");
    });
}
/**
 * failure callback for connection to server
 * @param errorCode
 * @param message
 */
function loginFailure(errorCode, message) {
    easyrtc.showError(errorCode, "failure to login");
}
/**
 * for logging pupopses
 */
function printAllData() {
    console.log(easyrtc.myEasyrtcid);
    console.log("selfEasyrtcid ", selfEasyrtcid);
    console.log("connectList ", connectList);
    console.log("selfEasyrtcid.connectedList ", selfEasyrtcid.connectedList);
    easyrtc.sendServerMessage("printData", selfEasyrtcid, function (a, b) {
    }, function (a, b) {
    });
}

function acceptTheCall(easyrtcid, acceptor) {


    var idToName = easyrtc.idToName(easyrtcid);
    if (roomJoining[idToName] && roomJoining[idToName] == true) {
        roomJoining[idToName] = false;
        if (selfEasyrtcid.numberOfConnections && selfEasyrtcid.numberOfConnections[idToName] >= 1)
            selfEasyrtcid.numberOfConnections[idToName]++;
        else
            selfEasyrtcid.numberOfConnections[idToName] = 1;
        acceptor(true);

    } else if (selfEasyrtcid.connectedList[easyrtc.idToName(easyrtcid)]) {
        selfEasyrtcid.reconnecting[easyrtc.idToName(easyrtcid)] = false;
        selfEasyrtcid.connectedList[easyrtc.idToName(easyrtcid)] = easyrtcid;
        connectedPeopleCanveses[easyrtc.idToName(easyrtcid)] = p5canvas(easyrtcid, null, selfEasyrtcid.color);
        if (selfEasyrtcid.numberOfConnections && selfEasyrtcid.numberOfConnections[idToName])
            selfEasyrtcid.numberOfConnections[idToName]++;
        else
            selfEasyrtcid.numberOfConnections[idToName] = 1;
        acceptor(true);
    } else {
        var accepted = confirm("Want to Connect with " + easyrtc.idToName(easyrtcid));
        if (accepted) {
            easyrtc.sendServerMessage("getData", easyrtc.idToName(easyrtcid), function (a, b) {
                console.log(a);
                selfEasyrtcid.connectedList[a.name] = a.uniqueID;
                connectedPeopleCanveses[easyrtc.idToName(easyrtcid)] = p5canvas(easyrtcid, null, selfEasyrtcid.color);
                easyrtc.sendServerMessage("updateData", selfEasyrtcid, function (a, b) {
                }, function (a, b) {
                });
            }, function (a, b) {
            });
            if (selfEasyrtcid.numberOfConnections && selfEasyrtcid.numberOfConnections[idToName])
                selfEasyrtcid.numberOfConnections[idToName]++;
            else
                selfEasyrtcid.numberOfConnections[idToName] = 1;
        }
        acceptor(accepted);
    }
}

function addRoom(roomName, parmString, userAdded) {
    if (!roomName) {
        roomName = document.getElementById("roomToAdd").value;
        // parmString = document.getElementById("optRoomParms").value;
    }
    var roomid = genRoomDivName(roomName);
    if (document.getElementById(roomid)) {
        return;
    }

    function addRoomButton() {

        var roomButtonHolder = document.getElementById('rooms');
        var roomdiv = document.createElement("div");
        roomdiv.id = roomid;
        roomdiv.className = "roomDiv";
        var roomButton, roomLabel;

        roomButton = document.createElement("label");
        roomButton.style.float = "left";
        roomLabel = (document.createTextNode(roomName));
        roomButton.appendChild(roomLabel);

        roomdiv.appendChild(roomButton);
        roomButtonHolder.appendChild(roomdiv);
        var roomOccupants = document.createElement("div");
        roomOccupants.id = genRoomOccupantName(roomName);
        roomOccupants.className = "roomOccupants";
        roomdiv.appendChild(roomOccupants);

        if (roomName != "default") {
            var leaveEle = document.createElement("a");
            leaveEle.href = "javascript:void(0)";
            leaveEle.onclick = function () {
                leaveRoom(roomName);

            };
            leaveEle.innerHTML = "-leave";
            roomdiv.appendChild(leaveEle);

        }
    }

    var roomParms = null;
    if (parmString && parmString !== "") {
        try {
            roomParms = JSON.parse(parmString);
        } catch (error) {
            roomParms = null;
            easyrtc.showError(easyrtc.errCodes.DEVELOPER_ERR, "Room Parameters must be an object containing key/value pairs. eg: {\"fruit\":\"banana\",\"color\":\"yellow\"}");
            return;
        }
    }

    if (!isConnected || !userAdded) {
        if (roomName != "default")
            addRoomButton();
        console.log("adding gui for room " + roomName);
    } else {
        console.log("not adding gui for room " + roomName + " because already connected and it's a user action");
    }
    if (userAdded) {
        console.log("calling joinRoom(" + roomName + ") because it was a user action ");
        easyrtc.joinRoom(roomName, roomParms, function () {


            /* we'll geta room entry event for the room we were actually added to */
        }, function (errorCode, errorText, roomName) {
            easyrtc.showError(errorCode, errorText + ": room name was(" + roomName + ")");
        });
    }
}

function genRoomDivName(roomName) {
    return "roomblock_" + roomName;
}

function genRoomOccupantName(roomName) {
    return "roomOccupant_" + roomName;
}

function setCredential(event, value) {
    if (event.keyCode === 13) {
        easyrtc.setCredential(value);
    }
}

function roomEntryListener(entered, roomName) {

    if (entered && roomName != "default") { // entered a room

        roomsJoined[roomName] = p5canvas(null, roomName, selfEasyrtcid.color);
        console.log(roomName);
        var roomParticipants = easyrtc.getRoomOccupantsAsArray(roomName);
        console.log(roomParticipants[i]);
        for (var i in roomParticipants) {
            if (roomParticipants[i] != selfEasyrtcid.uniqueID) {
                easyrtc.idToName(roomParticipants[i]);
                startRoomCall(roomParticipants[i]);
            }
        }
        console.log("saw add of room " + roomName);
        addRoom(roomName, null, false);
    } else {

        var roomNode = document.getElementById(genRoomDivName(roomName));
        if (roomNode) {
            document.getElementById('rooms').removeChild(roomNode);
        }
    }
    refreshRoomList();
}

function refreshRoomList() {
    if (isConnected) {
        easyrtc.getRoomList(addQuickJoinButtons, null);
    }
}

function addQuickJoinButtons(roomList) {
    var quickJoinBlock = document.getElementById("quickJoinBlock");
    var n = quickJoinBlock.childNodes.length;
    for (var i = n - 1; i >= 0; i--) {
        quickJoinBlock.removeChild(quickJoinBlock.childNodes[i]);
    }

    function addQuickJoinButton(roomname, numberClients) {
        var checkid = "roomblock_" + roomname;
        if (document.getElementById(checkid)) {
            return; // already present so don't add again
        }
        var id = "quickjoin_" + roomname;
        var div = document.createElement("div");
        div.id = id;
        div.className = "quickJoin";
        var button = document.createElement("a");
        button.onclick = function () {
            addRoom(roomname, "", true);
            refreshRoomList();
        };
        button.href = "javascript:void(0)";
        button.appendChild(document.createTextNode("Join " + roomname + "(" + numberClients + ")"));
        div.appendChild(button);
        quickJoinBlock.appendChild(div);
    }

    if (!roomList["room1"]) {
        roomList["room1"] = {
            numberClients: 0
        };
    }
    if (!roomList["room2"]) {
        roomList["room2"] = {
            numberClients: 0
        };
    }
    if (!roomList["room3"]) {
        roomList["room3"] = {
            numberClients: 0
        };
    }
    for (var roomName in roomList) {
        if (roomName != "default") addQuickJoinButton(roomName, roomList[roomName].numberClients);
    }
}

function getGroupId() {
    return null;
}
/**
 * if datachannel, send using datachannel, else send using websocket, (coult make it work either way, if required
 * @param destTargetId
 * @param destRoom
 * @param msgType
 * @param message
 */
function sendMessage(destTargetId, destRoom, msgType, message) {

    // console.log(destTargetId, destRoom, msgType, message);
    if (messageCommunicationMode == "Reliable") {


        try {
            if (destTargetId) {
                if (easyrtc.getConnectStatus(destTargetId) === easyrtc.IS_CONNECTED) {

                    easyrtc.sendDataWS(destTargetId, msgType, {
                        'targetRoom': destRoom,
                        'targetID': destTargetId,
                        'content': message
                    }, function (reply) {
                        if (reply.msgType === "error") {
                            console.error(reply.msgData.errorCode, reply.msgData.errorText);
                        }
                    });
                }
            }
            else if (destRoom) {
                var roomParticipants = easyrtc.getRoomOccupantsAsArray(destRoom);

                for (var i in roomParticipants) {
                    // console.log(easyrtc.idToName(roomParticipants[i]));
                    if (roomParticipants[i] != selfEasyrtcid.uniqueID) {
                        if (easyrtc.getConnectStatus(roomParticipants[i]) === easyrtc.IS_CONNECTED) {
                            {
                                easyrtc.sendDataWS(roomParticipants[i], msgType, {
                                    'targetRoom': destRoom,
                                    'targetID': destTargetId,
                                    'content': message
                                }, function (reply) {
                                    if (reply.msgType === "error") {
                                        easyrtc.showError(reply.msgData.errorCode, reply.msgData.errorText);
                                    }
                                });
                            }
                        }
                    }


                    //messageFromClient("Me", "message", text);
                    //document.getElementById('sendMessageText').value = "";
                }
            }
            else {
                easyrtc.showError("user error", "no destination selected");
                return;
            }

        }
        catch (excpetion) {
            console.log(excpetion);
        }


    }
    else {
        try {
            if (destTargetId) {
                if (easyrtc.getConnectStatus(destTargetId) === easyrtc.IS_CONNECTED) {

                    easyrtc.sendData(destTargetId, msgType, {
                        'targetRoom': destRoom,
                        'targetID': destTargetId,
                        'content': message
                    }, function (reply) {
                        if (reply.msgType === "error") {
                            console.error(reply.msgData.errorCode, reply.msgData.errorText);
                        }
                    });
                }
            }
            else if (destRoom) {
                var roomParticipants = easyrtc.getRoomOccupantsAsArray(destRoom);

                for (var i in roomParticipants) {
                    // console.log(easyrtc.idToName(roomParticipants[i]));
                    if (roomParticipants[i] != selfEasyrtcid.uniqueID) {
                        if (easyrtc.getConnectStatus(roomParticipants[i]) === easyrtc.IS_CONNECTED) {
                            {
                                easyrtc.sendData(roomParticipants[i], msgType, {
                                    'targetRoom': destRoom,
                                    'targetID': destTargetId,
                                    'content': message
                                }, function (reply) {
                                    if (reply.msgType === "error") {
                                        easyrtc.showError(reply.msgData.errorCode, reply.msgData.errorText);
                                    }
                                });
                            }
                        }
                    }


                    //messageFromClient("Me", "message", text);
                    //document.getElementById('sendMessageText').value = "";
                }
            }
            else {
                easyrtc.showError("user error", "no destination selected");
                return;
            }

        }
        catch (excpetion) {
            console.log(excpetion);
        }
    }

}
function leaveRoom(roomName) {
    if (!roomName) {
        roomName = document.getElementById("roomToAdd").value;
    }
    var roomButtonHolder = document.getElementById('rooms');
    easyrtc.sendData({
        'targetRoom': roomName,
        'targetGroup': null
    }, "leavingRoom", {
        'name': selfEasyrtcid.name,
        'roomName': roomName
    });
    easyrtc.sendServerMessage("leaveRoomUpdate", {
        'name': selfEasyrtcid.name,
        'roomName': roomName
    }, function (a, b) {
    }, function (a, b) {
    });
    if (roomsJoined[roomName]) {
        roomsJoined[roomName].removeAll();
        roomsJoined[roomName].updateDest(null, null);
        // delete roomsJoined[roomName];
    }
    var roomParticipants = easyrtc.getRoomOccupantsAsArray(roomName);
    for (var i in roomParticipants) {
        if (roomParticipants[i] != selfEasyrtcid.uniqueID) {
            selfEasyrtcid.numberOfConnections[easyrtc.idToName(roomParticipants[i])]--;

            if (selfEasyrtcid.numberOfConnections[easyrtc.idToName(roomParticipants[i])] == 0) {
                easyrtc.hangup(roomParticipants[i]);
            }
        }


    }


    easyrtc.leaveRoom(roomName, null);
}


function changeColor() {
    display_scenario();

}

function display_scenario() {
    if (document.getElementById('prompt'))
        return;
    var docP = document.createElement('div');
    docP.id = "prompt";
    document.getElementById('prompter').appendChild(docP);


    $('#prompt').empty();


    $('<p>').html("What color you want now?:").appendTo('#prompt');


    var picker;
    $('<input>')
        .html("asd")
        .attr("id", "changedColor")
        .keypress(function (e) {
                if (e.keyCode == 13) {

                    selfEasyrtcid.color = this.value;
                    for (var i in connectedPeopleCanveses) {
                        connectedPeopleCanveses[i].updateColor(selfEasyrtcid.color);
                    }
                    for (var i in roomsJoined) {
                        roomsJoined[i].updateColor(selfEasyrtcid.color);
                    }
                    easyrtc.sendServerMessage("changeColor", {
                        "name": easyrtc.idToName(selfEasyrtcid.uniqueID),
                        "color": selfEasyrtcid.color,
                    }, function (a, b) {
                    }, function (a, b) {
                    });

                    picker.hide();
                    document.getElementById('prompter').removeChild(document.getElementById('prompt'));
                    changeTheColorInDjango(selfEasyrtcid.name, selfEasyrtcid.color);

                }

            }
        )
        .appendTo('#prompt');
    var inputElement = document.getElementById('changedColor');
    console.log(inputElement);
    picker = new jscolor(inputElement);


}

function changeReliability() {

    var valueOfRelibiltyButton = document.getElementById("updateReliabilty").innerHTML;
    if (valueOfRelibiltyButton == "Reliable") {

        messageCommunicationMode = valueOfRelibiltyButton;
        document.getElementById("updateReliabilty").innerHTML = "Unreliable";
        document.getElementById("commModeLabel").innerHTML = "Current Communication Mode: Reliable";
    }
    else {
        messageCommunicationMode = valueOfRelibiltyButton;
        document.getElementById("updateReliabilty").innerHTML = "Reliable";
        document.getElementById("commModeLabel").innerHTML = "Current Communication Mode: Unreliable";
    }
}