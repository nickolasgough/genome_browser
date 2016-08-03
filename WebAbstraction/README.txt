Web Groupware Toolkit

1) toolKitMain - file establishing connection, receiving and sending messages.

Things in order to send and receive messages:-

1) your app should have a function named p5canvas, which will take two arguments destID and room,which whould return a object with properties/methods that should be accesible from toolKitMain.

2) in your app there should be atleast three functions which should be accesible from toolKitMain:-
	
two of them can be exactly like these,( I m thinking a better way to have them in built!): 

	p.updateDest = function (newName, newRoomName) {
            console.log(newName + " " + newRoomName);
            dest = newName;
            room = newRoomName;
        };
        
        p.updateColor = function (newColor) {
            myColor = newColor;
        };

third one should be that whenever a message is received from client in toolKitMain, it should be transferred to the app using this function and add this code in toolKitMain

else if (msgType == "drawing") { /*** your message type , in this case it is drawing *****\
        // call the function for of you p5 with the data you want, data is stored in content.content
        if (content.targetRoom) {
            if (roomsJoined[content.targetRoom]) roomsJoined[content.targetRoom].addToDrawing(who, content.content); /**** addToDrawing should be replaced by your function ***\
        } else {
            if (connectedPeopleCanveses[easyrtc.idToName(who)]) connectedPeopleCanveses[easyrtc.idToName(who)].addToDrawing(who, content.content);/**** addToDrawing should be replaced by your function ***\
        }
    }



3) send message from your app using sendMessage(userId,room,msgType,msg)


4) message will be sent to the client and is accesible in a function messageFromClient(who, msgType, content). 
	- who is the id of the person who sent the message, and content is an object with properties targetRoom(if any) and content, which contains data received


