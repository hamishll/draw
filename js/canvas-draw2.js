// Bind canvas to listeners
var canvas = document.getElementById('canvas');
canvas.addEventListener('mousedown', mouseDown, false);
canvas.addEventListener('mousemove', mouseMove, false);
canvas.addEventListener('mouseup', mouseUp, false);
var ctx = canvas.getContext('2d');

ctx.lineWidth = 3;
ctx.lineJoin = 'round';
ctx.lineCap = 'round';

var started = false;
var lastx = 0;
var lasty = 0;

// create an in-memory canvas
var memCanvas = document.createElement('canvas');
memCanvas.width = 400;
memCanvas.height = 400;
var memCtx = memCanvas.getContext('2d');
var points = [];

currentTime = performance.now();
oldTime = performance.now();


function mouseDown(e) {
    memCtx.save();
    var m = getMouse(e, canvas);
    points.push({
        x: m.x,
        y: m.y
    });
    started = true;
};

function mouseMove(e) { 
    currentTime = performance.now();
    ////console.log(currentTime);
    ////console.log(oldTime);
    //if (currentTime-oldTime > 5) {
    //console.log(currentTime-oldTime);
    
    var m = getMouse(e, canvas);
    //console.log("nx=",n.x);
    //console.log("mx=",m.x);
    //console.log(Math.abs(n.x*n.y - m.x*m.y));

    if (Math.abs(n.x-m.x) + Math.abs(n.y-m.y) + (currentTime-oldTime)/10 > 10) {
        //console.log(n.x*n.y - m.x*m.y);
        if (started) {
            ctx.clearRect(0, 0, 400, 400);
            // put back the saved content
            ctx.drawImage(memCanvas, 0, 0);
            n.x = m.x;
            //console.log("nx=",n.x);
            //console.log("mx=",m.x);
            n.y = m.y;
            points.push({
                x: m.x,
                y: m.y
            });
            drawPoints(ctx, points);
        } 
    }
    
    
    oldTime = currentTime;
        
    };

function mouseUp(e) { 
    if (started) {
        started = false;
        // When the pen is done, save the resulting context
        // to the in-memory canvas
        memCtx.clearRect(0, 0, 400, 400);
        memCtx.drawImage(canvas, 0, 0);
        points = [];
    }
};

// clear both canvases!
function clearCanvas() {
    ctx.clearRect(0, 0, 400, 400);
    memCtx.clearRect(0, 0, 400, 400);
};
//undo!
function undo() {
    console.log("Undo");
    memCtx.restore();
};



function drawPoints(ctx, points) {
    // draw a basic circle instead
    previousCtx = ctx;
    if (points.length < 6) {
        var b = points[0];
        ctx.beginPath(), ctx.arc(b.x, b.y, ctx.lineWidth / 2, 0, Math.PI * 2, !0), ctx.closePath(), ctx.fill();
        return
    }
    
    ctx.beginPath(), ctx.moveTo(points[0].x, points[0].y);
    // draw a bunch of quadratics, using the average of two points as the control point
    for (i = 1; i < points.length - 2; i++) {
        var c = (points[i].x + points[i + 1].x) / 2,
            d = (points[i].y + points[i + 1].y) / 2;
        ctx.quadraticCurveTo(points[i].x, points[i].y, c, d)
    }
    ctx.quadraticCurveTo(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y), ctx.stroke()
}

// Creates an object with x and y defined,
// set to the mouse position relative to the state's canvas
// If you wanna be super-correct this can be tricky,
// we have to worry about padding and borders
// takes an event and a reference to the canvas
function getMouse(e, canvas) {
  var element = canvas, offsetX = 0, offsetY = 0, mx, my;

  // Compute the total offset. It's possible to cache this if you want
  if (element.offsetParent !== undefined) {
    do {
      offsetX += element.offsetLeft;
      offsetY += element.offsetTop;
    } while ((element = element.offsetParent));
  }

  mx = e.pageX - offsetX;
  my = e.pageY - offsetY;

  // We return a simple javascript object with x and y defined
  return {x: mx, y: my};
}
//var n = x=0, y=0;

var n = {
    x: 0,
    y: 0,
}
var m = {
    x: 0,
    y: 0,
}
