$(window.document).ready(function () {
    
    var pointers = {};
    var clickables = [];

    var Clickable = function (elem) {
        var clickable = this;
        clickable.elem = elem;
        clickable.top = elem.offset().top;
        clickable.left = elem.offset().left;
        clickable.width = elem.width();
        clickable.height = elem.width();
        clickable.inbounds = function (left, top) {
            left = Math.abs(left);
            top = Math.abs(top);
            return (top > clickable.top) && (top < clickable.top + clickable.height) &&
                (left > clickable.left) && (left < clickable.left + clickable.width);
        };
        clickable.action = function () {
            clickable.elem.click();
        };
    }

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
        pointer.hover = function (position) {

        };
        pointer.tap = function (position) {
            clickables.forEach(function (clickable) {
                var triggerAction = clickable.inbounds(position[0], position[1]);
                if (triggerAction) {
                    clickable.action();
                }
            });
        };
    };
    
    var startGame = $('#start-game');
    var highScores = $('#high-scores');
    clickables.push(new Clickable(startGame));
    clickables.push(new Clickable(highScores));
    startGame.on('click', function () {
        alert("Hice click no se como");
    });
    
    Leap.loop({ enableGestures: true }, function (frame) {
    frame.hands.forEach(function (hand, index) {
        var pointer = pointers[hand.type] || (pointers[hand.type] = new Pointer({ hand: hand.type }));
        var position = hand.screenPosition();
        var rotation = hand.roll();
        
        // Update pointer position
        pointer.setTransform(position, rotation);
        
        // Check for tapping
        if(frame.valid && frame.gestures.length > 0){
            frame.gestures.forEach(function(gesture){
                switch (gesture.type){
                  case "keyTap":
                      pointer.tap(position);
                      break;
                  case "screenTap":
                      pointer.tap(position);
                      break;
                }
            });
        }
    });
    }).use('screenPosition', { scale: 0.90 });
    Leap.loopController.setBackground(true);
    pointers.right = new Pointer({ hand: 'right' });
});