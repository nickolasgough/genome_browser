function p5canvas(destId, roomName, clr) {
    var sketch = function getP5Intance(p, c) {
        var room, dest, canvas, pg;
        p.setup = function () {
            canvas = p.createCanvas(500, 500);
            pg = p.createGraphics(500, 500);
            p.pixelDensity(1);
            console.log(pg.displayDensity());
            pg.pixelDensity(1);
            console.log(pg.displayDensity());

            /* *
            *   Every loaded page should have room and dest variables to which they belong, it could be roomname or destintation ID!!
            * */
            room = roomName;
            dest = destId;
            addStuffOnHtml();
            p.strokeWeight(0);
            p.stroke(255, 100);
            p.noFill();
            p.background(50);
            p.getColor = function (colorDesired) {
                return p.color("#" + colorDesired);
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

        p.draw = function () {
            p.background(50);
            if (p.mouseIsPressed) {
                pg.push();
                pg.stroke(p.getColor(myColor));
                pg.ellipse(p.mouseX, p.mouseY, 5, 5);
                pg.pop();
            }

            // sending message to who over you are connected to, in this case  we are sending to dest or room , a message of type drawing and object with x,y,px,py,color this message is received in toolKitMain
            if (room || dest) sendMessage(dest, room, "drawing", {
                'pressed': p.mouseIsPressed,
                'x': p.mouseX,
                'y': p.mouseY,
                'px': p.pmouseX,
                'py': p.pmouseY,
                'color': myColor
            });
            pg.loadPixels();
            p.image(pg, 0, 0);
            p.push();
            p.fill(p.getColor(myColor));
            p.ellipse(p.mouseX, p.mouseY, 5, 5);
            p.pop();
            for (var i in ellipses) {
                p.push();
                p.fill(p.getColor(ellipses[i].color));
                p.ellipse(ellipses[i].x, ellipses[i].y, 5, 5);
                p.pop();
            }
        };

        /*
                function to be called from toolKitMain!!!
         */
        p.addToDrawing = function (who, content) {
            if (content.pressed) {
                pg.push();
                pg.stroke(p.getColor(content.color));
                pg.line(content.x, content.y, content.px, content.py);
                pg.pop();
            }
            else ellipses[who] = content;
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
    };

    var myp5 = new p5(sketch);
    return myp5;
}
