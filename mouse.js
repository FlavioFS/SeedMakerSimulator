Mouse = {
    down: false
}

Mouse.isDown = () => this.down > 0;

document.body.onmousedown = function (evt) {
    if (evt.button === 0) Mouse.down = true;
}

document.body.onmouseup = function (evt) {
    if (evt.button === 0) Mouse.down = false;
}