function setColor (color) {
    chosenColor = color;
}


var text_1 = document.getElementById('text_1');

text_1.addEventListener('keydown', setText_1, false);

function setText_1 () {
    text_1 = document.getElementById(text_1).innerHTML;
    console.log(text_1);
};

