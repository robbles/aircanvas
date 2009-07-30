var canvas;
var ctx;
var drawing = false;

var drawtimer = null;
var todraw = [];
var oldx, oldy;

$(document).ready(function () {

    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    $('#update').mousedown(function(){return false}).click(update);
    $('#clear').mousedown(function(){return false}).click(clear);
    $('#canvas').mousedown(begindraw).mousemove(draw).mouseup(enddraw);

    ctx.lineWidth = 10.0;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.fillStyle = "#000000";
    ctx.strokeStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    var img = new Image();
    $(img).load(function() {
        ctx.drawImage(img, 0, 0);
    }).attr('src', 'canvas.png');
});

function update(event) {

    var canvasdata = canvas.toDataURL();
    $('#update').fadeOut('fast');
    $.post('addimage', {'canvas':canvasdata}, doneupdate);


}

function doneupdate() {
    $('#update').fadeIn('slow');
}

function clear(event) {
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function begindraw(event) {
    document.title="drawing";
    drawing = true;
    oldx = event.clientX - canvas.offsetLeft;
    oldy = event.clientY - canvas.offsetTop;
    drawtimer = setTimeout(sketch, 10);
}

function draw(event) {
    if(drawing) {
        var x = event.clientX;
        var y = event.clientY;
        todraw.push([x, y]);
    }
}

function sketch() {
    if(todraw.length) {
        var newpos = todraw.shift();
        ctx.beginPath();
        ctx.moveTo(oldx, oldy);
        ctx.lineTo(newpos[0] - canvas.offsetLeft, newpos[1] - canvas.offsetTop);
        ctx.stroke();
        oldx = newpos[0] - canvas.offsetLeft;
        oldy = newpos[1] - canvas.offsetTop;
    }
    drawtimer = setTimeout(sketch, 10);
}

function enddraw(event) {
    drawing = false;
    document.title = "";
    clearTimeout(drawtimer);
}

