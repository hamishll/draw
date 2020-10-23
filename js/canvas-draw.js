window.addEventListener("load", () => {
    const canvas = document.querySelector("#canvas");
    const ctx = canvas.getContext("2d");

    //Resizing
    canvas.height = window.innerHeight-20;
    canvas.width = window.innerWidth;

    // Example: rectangle
    //ctx.fillStyle = 'purple';
    //ctx.fillRect(50,50,200,200);

    //Example: stroke rectangle#
    //ctx.strokeStyle = "blue";
    //ctx.strokeRect (300,300,100,100);

    // Drawing
    // ctx.beginPath();
    // ctx.moveTo(100,400);
    // ctx.lineTo(200,400);
    // ctx.lineTo(200,450);
    // ctx.fill();

    //let p = new Path2D('M10 10 h 80 v 80 h -80 Z');
    //ctx.fill(p);
    var img = document.getElementById("tshirt");
    ctx.drawImage(img, 0,0,window.innerWidth,innerWidth*0.8);

    // Variables
    let painting = false;
    chosenColor = "black";

    function startPosition (e){
        painting = true;
        draw(e);
    }
    function finishedPosition (){
        painting = false;
        ctx.beginPath();
    }
    function draw(e) {
        if(!painting) return;
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';

        // won't work until I draw arcs instead of points ctx.setLineDash([5, 15]);
        ctx.lineTo(e.clientX+0.5, e.clientY+0.5);
        ctx.strokeStyle = chosenColor;
        
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(e.clientX+0.5, e.clientY+0.5);
    }


    // Event Listeners
    canvas.addEventListener("mousedown", startPosition);
    canvas.addEventListener("mouseup", finishedPosition);
    canvas.addEventListener("mousemove", draw);
    
    
    // Set up touch events for mobile, etc
	canvas.addEventListener("touchstart", function (e) {
		mousePos = getTouchPos(canvas, e);
		var touch = e.touches[0];
		var mouseEvent = new MouseEvent("mousedown", {
			clientX: touch.clientX,
			clientY: touch.clientY
		});
		canvas.dispatchEvent(mouseEvent);
    }, false);
    
	canvas.addEventListener("touchend", function (e) {
		var mouseEvent = new MouseEvent("mouseup", {});
		canvas.dispatchEvent(mouseEvent);
    }, false);
    
	canvas.addEventListener("touchmove", function (e) {
		var touch = e.touches[0];
		var mouseEvent = new MouseEvent("mousemove", {
			clientX: touch.clientX,
			clientY: touch.clientY
		});
		canvas.dispatchEvent(mouseEvent);
	}, false);

	// Prevent scrolling when touching the canvas
	document.body.addEventListener("touchstart", function (e) {
		if (e.target == canvas) {
			e.preventDefault();
		}
	}, false);
	document.body.addEventListener("touchend", function (e) {
		if (e.target == canvas) {
			e.preventDefault();
		}
	}, false);
	document.body.addEventListener("touchmove", function (e) {
		if (e.target == canvas) {
			e.preventDefault();
		}
    }, false);
    
    // Get the position of a touch relative to the canvas
	function getTouchPos(canvasDom, touchEvent) {
		var rect = canvasDom.getBoundingClientRect();
		return {
			x: touchEvent.touches[0].clientX - rect.left,
			y: touchEvent.touches[0].clientY - rect.top
		};
	}

});




document.body.addEventListener('touchstart', function(e){ e.preventDefault(); });

window.addEventListener('resize', () => {
    //canvas.height = window.innerHeight;
    //canvas.width = window.innerWidth;
});

function setColor (color) {
    chosenColor = color;
}
function clearCanvas() {
    console.log("Canvas cleared");
    const canvas = document.querySelector("#canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.width;
    var img = document.getElementById("tshirt");
    ctx.drawImage(img, 0,0,window.innerWidth,innerWidth);    
}
