/*
 function p5canvas(destId, roomName, clr) {
 var sketch = function getP5Intance(p, c) {
 console.log(c);
 var room, dest, canvas, graphicsBuffer;
 p.setup = function () {
 canvas = p.createCanvas(550, 458);
 room = roomName;
 dest = destId;
 graphicsBuffer = p.createGraphics(550, 458);
 addStuffOnHtml();
 p.strokeWeight(5);
 p.noFill();
 p.background(50);
 p.getColor = function (colorDesired) {
 return p.color("#" + colorDesired);
 }

 };

 function addStuffOnHtml() {

 var spanEle = document.createElement("span");
 if (roomName) {
 var divEle = document.createElement("div");
 divEle.id = "room" + room + dest;
 divEle.className = "applicationElement";
 console.log(divEle.id);
 var textNode = document.createElement("label");
 textNode.innerHTML = roomName;
 // textNode.style.color = "#00000";
 var closeButton = document.createElement("a");
 closeButton.innerHTML = "X";
 closeButton.href = "javascript:void(0)";
 closeButton.onclick = function () {
 leaveRoom(room);

 };
 closeButton.style.float = "right";
 divEle.appendChild(closeButton);
 divEle.appendChild(textNode);
 divEle.appendChild(document.createElement("br"));
 spanEle.id = "canvasId" + roomName;
 var text = document.createTextNode("  ");
 canvas.parent(spanEle);
 spanEle.appendChild(text);
 divEle.appendChild(spanEle);
 document.getElementById("playArea").appendChild(divEle);
 }
 else {

 var divEle = document.createElement("div");
 divEle.id = "room" + room + dest;
 divEle.className = "applicationElement";
 var textNode = document.createElement("label");
 textNode.innerHTML = easyrtc.idToName(dest);
 var closeButton = document.createElement("a");
 closeButton.innerHTML = "X";
 closeButton.href = "javascript:void(0)";
 closeButton.onclick = function () {
 startCall(dest);

 };
 closeButton.style.float = "right";
 divEle.appendChild(closeButton);
 divEle.appendChild(textNode);
 divEle.appendChild(document.createElement("br"));
 spanEle.id = "canvasId" + easyrtc.idToName(dest);
 var text = document.createTextNode("  ");
 canvas.parent(spanEle);
 spanEle.appendChild(text);
 divEle.appendChild(spanEle);
 document.getElementById("playArea").appendChild(divEle);
 }
 }

 p.print("color: " + clr);
 var myColor = clr;
 var ellipses = [];
 var totalElementsonScreen = [];
 p.draw = function () {
 //p.background(50);
 if (p.mouseIsPressed) {

 totalElementsonScreen.push({
 'color': myColor,
 'x': p.mouseX,
 'y': p.mouseY,
 'px': p.pmouseX,
 'py': p.pmouseY
 });


 }

 if (room || dest) sendMessage(dest, room, "drawing", {
 'pressed': p.mouseIsPressed,
 'x': p.mouseX,
 'y': p.mouseY,
 'color': myColor,
 'px': p.pmouseX,
 'py': p.pmouseY
 });

 for (var i in totalElementsonScreen) {
 var eleInArray = totalElementsonScreen[i];
 graphicsBuffer.push();
 graphicsBuffer.fill(p.getColor(eleInArray.color));
 graphicsBuffer.line(eleInArray.x, eleInArray.y, eleInArray.px, eleInArray.py);
 graphicsBuffer.pop();
 }


 for (var i in ellipses) {
 var eleInArray = ellipses[i];
 p.push();
 p.fill(p.getColor(eleInArray.color));
 p.ellipse(eleInArray.mouseX, eleInArray.mouseY, 5, 5);
 p.pop();
 }

 p.image(graphicsBuffer,0,0);
 p.push();
 p.fill(p.getColor(myColor));
 p.ellipse(p.mouseX, p.mouseY, 5, 5);
 p.pop();


 };
 p.addToDrawing = function (who, content) {
 if (content.pressed) totalElementsonScreen.push(content);
 else ellipses[who] = content;
 };
 p.updateDest = function (newName, newRoomName) {
 console.log(newName + " " + newRoomName);
 dest = newName;
 room = newRoomName;
 };
 p.updateColor = function (newColor) {
 myColor = newColor;
 p.print(myColor);
 };
 p.removeAll = function () {

 p.remove();
 var el = document.getElementById("room" + room + dest);
 el.parentNode.removeChild(el);


 }
 };

 var myp5 = new p5(sketch);
 return myp5;
 }*/


function p5canvas(destId, roomName, clr) {
    var sketch = function getP5Intance(p, c) {
        console.log(c);
        var room, dest, canvas, pg, pressedmouse;
        var firstPress, eraser = false;
        p.setup = function () {
            p.pixelDensity(1);
            canvas = p.createCanvas(550, 458);
            canvas.mouseClicked(p.mouseClickedOnCanvas);
            canvas.mousePressed(p.mousePressedOnCanvas);
            pg = p.createGraphics(550, 458);
            pg.pixelDensity(1);
            room = roomName;
            dest = destId;
            addStuffOnHtml();
            // p.strokeWeight(2);
            p.stroke(255, 100);
            p.noFill();
            p.background(50);
            pressedmouse = null;
            firstPress = true;
            p.getColor = function (colorDesired) {
                return p.color("#" + colorDesired);
            }
            p.reload = function () {
                pg.background(50);

            };

        };

        function addStuffOnHtml() {

            var spanEle = document.createElement("span");
            if (roomName) {
                var divEle = document.createElement("div");
                divEle.id = "room" + room + dest;
                divEle.className = "applicationElement";
                console.log(divEle.id);
                var textNode = document.createElement("label");
                textNode.innerHTML = roomName;
                // textNode.style.color = "#00000";


                var reloadButton = document.createElement("a");
                reloadButton.innerHTML = "reload";
                reloadButton.href = "javascript:void(0)";
                reloadButton.onclick = function () {
                    p.reload();
                    if (room || dest) sendMessage(dest, room, "drawing", {
                        "clear": true
                    });

                };
                reloadButton.style.float = "right";
                reloadButton.style.left = "10px";


                var closeButton = document.createElement("a");
                closeButton.innerHTML = "X";
                closeButton.href = "javascript:void(0)";
                closeButton.onclick = function () {
                    leaveRoom(room);

                };
                closeButton.style.float = "right";
                divEle.appendChild(closeButton);
                divEle.appendChild(reloadButton);

                divEle.appendChild(textNode);
                divEle.appendChild(document.createElement("br"));
                spanEle.id = "canvasId" + roomName;
                var text = document.createTextNode("  ");
                canvas.parent(spanEle);
                spanEle.appendChild(text);
                divEle.appendChild(spanEle);
                document.getElementById("playArea").appendChild(divEle);
            }
            else {

                var divEle = document.createElement("div");
                divEle.id = "room" + room + dest;
                divEle.className = "applicationElement";
                var textNode = document.createElement("label");
                textNode.innerHTML = easyrtc.idToName(dest);


                var reloadButton = document.createElement("a");
                reloadButton.innerHTML = "reload";
                reloadButton.href = "javascript:void(0)";
                reloadButton.onclick = function () {
                    p.reload();
                    if (room || dest) sendMessage(dest, room, "drawing", {
                        "clear": true
                    });

                };
                reloadButton.style.float = "right";
                reloadButton.style.left = "10px";


                var closeButton = document.createElement("a");
                closeButton.innerHTML = "X";
                closeButton.href = "javascript:void(0)";
                closeButton.onclick = function () {

                    disconnectFromOtherClient(dest);

                };
                closeButton.style.float = "right";
                divEle.appendChild(closeButton);
                divEle.appendChild(reloadButton);

                divEle.appendChild(textNode);
                divEle.appendChild(document.createElement("br"));
                spanEle.id = "canvasId" + easyrtc.idToName(dest);
                var text = document.createTextNode("  ");
                canvas.parent(spanEle);
                spanEle.appendChild(text);
                divEle.appendChild(spanEle);
                document.getElementById("playArea").appendChild(divEle);
            }
        }

        var temproryLines = {};
        p.print("color: " + clr);
        var myColor = clr;
        var ellipses = [];
        // var totalElementsonScreen = [];
        p.draw = function () {

            p.background(50);
            if (room || dest) sendMessage(dest, room, "drawing", {
                'pressed': p.mouseIsPressed,
                'x': p.mouseX,
                'y': p.mouseY,
                'pressedmouse': pressedmouse,
                'firstPress': firstPress,
                'py': p.pmouseY,
                'color': myColor,
                'eraser': eraser
            });


            p.image(pg, 0, 0);
            if (!eraser) {
                p.push();
                p.fill(p.getColor(myColor));
                p.ellipse(p.mouseX, p.mouseY, 5, 5);
                p.pop();
            }
            else {
                p.push();
                p.fill(p.getColor(myColor));
                p.ellipse(p.mouseX, p.mouseY, 10, 10);
                p.pop();

            }
            if (p.mouseIsPressed) {

                if (eraser) {
                    pg.push();
                    pg.fill(p.getColor(myColor));
                    pg.noStroke();
                    pg.ellipse(p.mouseX, p.mouseY, 10, 10);
                    pg.pop();
                }

            }

            if (!firstPress) {
                p.push();
                p.stroke(p.getColor(myColor));
                p.line(pressedmouse.x, pressedmouse.y, p.mouseX, p.mouseY);
                p.pop();

            }

            for (var i in ellipses) {
                p.push();
                p.fill(p.getColor(ellipses[i].color));
                if (!ellipses[i].eraser)
                    p.ellipse(ellipses[i].x, ellipses[i].y, 5, 5);
                else
                    p.ellipse(ellipses[i].x, ellipses[i].y, 10, 10);

                if (!ellipses[i].firstPress) {
                    p.push();
                    p.stroke(p.getColor(ellipses[i].color));
                    p.line(ellipses[i].pressedmouse.x, ellipses[i].pressedmouse.y, ellipses[i].x, ellipses[i].y);
                    p.pop();
                }


                p.pop();
            }
        };
        var otherDrawPress = {};
        p.addToDrawing = function (who, content) {
            if (content.clear) {
                p.reload();
            }
            else {

                ellipses[who] = content;

                if (!content.eraser) {
                    if (content.firstPress) {

                        if (otherDrawPress[who] == true) {
                            pg.push();
                            pg.stroke(p.getColor(content.color));
                            pg.line(content.pressedmouse.x, content.pressedmouse.y, content.x, content.y);
                            pg.pop();
                            otherDrawPress[who] = false;
                        }
                    }
                    else {
                        otherDrawPress[who] = true;
                    }
                }
                else {
                    if (content.pressed) {
                        pg.push();
                        pg.fill(p.getColor(content.color));
                        pg.noStroke();
                        pg.ellipse(content.x, content.y, 10, 10);
                        pg.pop();
                    }


                }
            }

        };
        p.updateDest = function (newName, newRoomName) {
            console.log(newName + " " + newRoomName);
            dest = newName;
            room = newRoomName;
        };
        p.updateColor = function (newColor) {
            myColor = newColor;
        };
        p.removeAll = function () {

            p.remove();

            var el = document.getElementById("room" + room + dest);
            el.parentNode.removeChild(el);
        }
        p.mouseClickedOnCanvas = function () {

            if (!eraser) {
                if (firstPress) {
                    pressedmouse = {'x': p.mouseX, 'y': p.mouseY};
                    firstPress = !firstPress;
                }
                else {
                    pg.push();
                    pg.stroke(p.getColor(myColor));
                    pg.line(pressedmouse.x, pressedmouse.y, p.mouseX, p.mouseY);
                    pg.pop();
                    firstPress = !firstPress;

                }
            }


        }
        var changingColorFrom;
        p.mousePressedOnCanvas = function () {
            console.log(p.mouseButton);

            if (p.mouseButton == "right") {
                if (eraser) {
                    p.updateColor(changingColorFrom);
                    eraser = false;
                }
                else {
                    changingColorFrom = myColor;
                    p.updateColor("323232");
                    eraser = true;
                }

            }

        }


    };


    var myp5 = new p5(sketch);
    return myp5;
}
