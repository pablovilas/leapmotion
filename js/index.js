/*var document = window.document;
$(document).ready(function () {
    var pointer = $('#pointer');
    $(document).mousemove(function(evt) {
        pointer.css({ left: evt.pageX, top: evt.pageY });
    });
});*/

var pointers = {};

Leap.loop(function (frame) {
    frame.hands.forEach(function (hand, index) {
        var pointer = pointers[hand.type] || (pointers[hand.type] = new Pointer({ hand: hand.type }));
        pointer.setTransform(hand.screenPosition(), hand.roll());
    });
}).use('screenPosition', { scale: 0.75 });

var Pointer = function (opts) {
    var pointer = this;
    var img = document.createElement('img');
    if (opts && opts.hand == 'left') {
        img.src = 'img/pointer_left.png';
    } else {
        img.src = 'img/pointer.png';
    }
    img.style.position = 'absolute';
    img.onload = function () {
        pointer.setTransform([
            window.innerWidth / 2,
            window.innerHeight / 2
        ], 0);
        document.body.appendChild(img);
    };
    pointer.setTransform = function (position, rotation) {
        img.style.left = position[0] - img.width / 2 + 'px';
        img.style.top = position[1] - img.height / 2 + 'px';
        img.style.transform = 'rotate(' + -rotation + 'rad)';
        img.style.webkitTransform = img.style.MozTransform = img.style.msTransform = img.style.OTransform = img.style.transform;
    };
};
Leap.loopController.setBackground(false);
//@ sourceURL=pen.js