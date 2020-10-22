window.addEventListener("load", () => {
    const canvas = document.querySelector("#canvas");
    const ctx = canvas.getContext("2d");

    //Resizing
    canvas.height = window.innerHeight-40;
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
    // ctx.stroke();

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
        ctx.lineTo(e.clientX, e.clientY);
        ctx.strokeStyle = chosenColor;
        
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(e.clientX, e.clientY);
    }

    // Event Listeners
    canvas.addEventListener("mousedown", startPosition);
    canvas.addEventListener("mouseup", finishedPosition);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("touchmove", function (e) {
        var touch = e.touches[0];
        var mouseEvent = new MouseEvent("mousemove", {
          clientX: touch.clientX,
          clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
      }, false);

});






window.addEventListener('resize', () => {
    //canvas.height = window.innerHeight-30;
    //canvas.width = window.innerWidth-30;
});
function setColor (color) {
    chosenColor = color;
}

