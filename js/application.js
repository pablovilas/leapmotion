/*

Fingers index

0 = THUMB
1 = INDEX
2 = MIDDLE
3 = RING
4 = PINKY

*/

var pointers = {};
var clickables = [];
var scores = [];
var score = 0;
var gestures = [];
var clock = {};
var game = [];
var TOP_OFFSET = -200;
var GESTURE_DURATION = 2;
var CURRENT_GESTURE = -1;
var DURATIONS = {
    short: { code: '1m', duration: 60  },
    long : { code: '3m', duration: 180 }
}

var Gesture = function (color, description) {
    this.color = color;
    this.description = description;
    this.validate = function () {
        return false;
    }
}

var Clickable = function (elem) {
    var clickable = this;
    clickable.elem = elem;
    clickable.top = elem.offset().top;
    clickable.left = elem.offset().left;
    clickable.width = elem.outerWidth();
    clickable.height = elem.outerHeight();
    clickable.inbounds = function (left, top) {
        left = Math.abs(left);
        top = Math.abs(top) - TOP_OFFSET;
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
    
    if (opts) {
        if (opts.hand) {
            switch (opts.hand) {
                case 'left':
                    img.src = 'img/pointer_left.png';
                    img.id = opts.hand + '-pointer';
                    break;
                case 'right':
                    img.src = 'img/pointer.png';
                    img.id = opts.hand + '-pointer';
                    break;
            }
        } else if (opts.finger) {
            switch (opts.finger) {
                case '0':
                    img.src = 'img/pointer_finger_orange.png';
                    break;
                case '1':
                    img.src = 'img/pointer_finger_green.png';
                    break;
                case '2':
                    img.src = 'img/pointer_finger_red.png';
                    break;
                case '3':
                    img.src = 'img/pointer_finger_yellow.png';
                    break;
                case '4':
                    img.src = 'img/pointer_finger_black.png';
                    break;
            }
            img.className = 'finger-pointer';
        }
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
        img.style.top = position[1] - TOP_OFFSET - img.height / 2 + 'px';
        img.style.transform = 'rotate(' + -rotation + 'rad)';
        img.style.webkitTransform = img.style.MozTransform = img.style.msTransform = img.style.OTransform = img.style.transform;
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

var gestureLeftThumb = new Gesture('#FA9700', 'Pulgar Izquierdo');
gestureLeftThumb.validate = function (hand, square) {
    if (hand.type == 'left') {
        var indexFinger = hand.fingers[0].screenPosition();
        return square.inbounds(indexFinger[0], indexFinger[1]);
    }
    return false;
}
   
var gestureRightThumb = new Gesture('#FA9700', 'Pulgar Derecho');
gestureRightThumb.validate = function (hand, square) {
    if (hand.type == 'right') {
        var indexFinger = hand.fingers[0].screenPosition();
        return square.inbounds(indexFinger[0], indexFinger[1]);
    }
    return false;
}

var gestureLeftIndex = new Gesture('#6EB44C', 'Índice Izquierdo');
gestureLeftIndex.validate = function (hand, square) {
    if (hand.type == 'left') {
        var indexFinger = hand.fingers[1].screenPosition();
        return square.inbounds(indexFinger[0], indexFinger[1]);
    }
    return false;
}
   
var gestureRightIndex = new Gesture('#6EB44C', 'Índice Derecho');
gestureRightIndex.validate = function (hand, square) {
    if (hand.type == 'right') {
        var indexFinger = hand.fingers[1].screenPosition();
        return square.inbounds(indexFinger[0], indexFinger[1]);
    }
    return false;
}

var gestureLeftMiddle = new Gesture('#D23000', 'Medio Izquierdo');
gestureLeftMiddle.validate = function (hand, square) {
    if (hand.type == 'left') {
        var indexFinger = hand.fingers[2].screenPosition();
        return square.inbounds(indexFinger[0], indexFinger[1]);
    }
    return false;
}
   
var gestureRightMiddle = new Gesture('#D23000', 'Medio Derecho');
gestureRightMiddle.validate = function (hand, square) {
    if (hand.type == 'right') {
        var indexFinger = hand.fingers[2].screenPosition();
        return square.inbounds(indexFinger[0], indexFinger[1]);
    }
    return false;
}

var gestureLeftRing = new Gesture('#FBFF07', 'Anular Izquierdo');
gestureLeftRing.validate = function (hand, square) {
    if (hand.type == 'left') {
        var indexFinger = hand.fingers[3].screenPosition();
        return square.inbounds(indexFinger[0], indexFinger[1]);
    }
    return false;
}
   
var gestureRightRing = new Gesture('#FBFF07', 'Anular Derecho');
gestureRightRing.validate = function (hand, square) {
    if (hand.type == 'right') {
        var indexFinger = hand.fingers[3].screenPosition();
        return square.inbounds(indexFinger[0], indexFinger[1]);
    }
    return false;
}

var gestureLeftPinky = new Gesture('#000000', 'Menique Izquierdo');
gestureLeftPinky.validate = function (hand, square) {
    if (hand.type == 'left') {
        var indexFinger = hand.fingers[4].screenPosition();
        return square.inbounds(indexFinger[0], indexFinger[1]);
    }
    return false;
}
   
var gestureRightPinky = new Gesture('#000000', 'Menique Derecho');
gestureRightPinky.validate = function (hand, square) {
    if (hand.type == 'right') {
        var indexFinger = hand.fingers[4].screenPosition();
        return square.inbounds(indexFinger[0], indexFinger[1]);
    }
    return false;
}

gestures.push(gestureLeftThumb);
gestures.push(gestureRightThumb);
gestures.push(gestureLeftIndex);
gestures.push(gestureRightIndex);
gestures.push(gestureLeftMiddle);
gestures.push(gestureRightMiddle);
gestures.push(gestureLeftRing);
gestures.push(gestureRightRing);
gestures.push(gestureLeftPinky);
gestures.push(gestureRightPinky);

$(window.document).ready(function () { 
    Leap.loop({ enableGestures: true }, function (frame) {
        if (frame.valid) {
            if (CURRENT_GESTURE > -1) {
                leapPlay(frame);
            } else {
                leapNavigate(frame);
            }
        }
    }).use('screenPosition', { scale: 0.90 });
    Leap.loopController.setBackground(true);
    $.ajax({ 
        type: 'GET',
        dataType: 'html',
        async: false, 
        url: 'main-menu.html',
        success: function (content) {
            replaceContent(content);
            index();
        }
    });
});

function leapNavigate(frame) {
    frame.hands.forEach(function (hand, index) {
        var pointer = pointers[hand.type] || (pointers[hand.type] = new Pointer({ hand: hand.type }));
        var position = hand.screenPosition();
        var rotation = hand.roll();

        // Check for tapping
        if(frame.valid && frame.gestures.length > 0) {
            frame.gestures.forEach(function(gesture) {                        
                switch (gesture.type) {
                  case "keyTap":
                      pointer.tap(position);
                      break;
                  case "screenTap":
                      pointer.tap(position);
                      break;
                }
            });
        } else {
            // Update pointer position
            pointer.setTransform(position, rotation);
        }
    });
}

function leapPlay(frame) {
    $('#left-pointer').hide();
    $('#right-pointer').hide();
    frame.hands.forEach(function (hand, index) {
        hand.fingers.forEach(function (finger, index) {
            var fingerKey = hand.type + '_' + finger.type;
            var pointer = pointers[fingerKey] || (pointers[fingerKey] = new Pointer({ finger: finger.type.toString() }));
            var position = finger.screenPosition();
            if(frame.valid && game.length > 0) {
                var currentGame = game[CURRENT_GESTURE];
                var currentGesture = gestures[currentGame.gesture];
                var orderCompleted = currentGesture.validate(hand, currentGame.square);
                if (orderCompleted) {
                    updateScore();
                }
                if (frame.gestures.length > 0) {
                    frame.gestures.forEach(function(gesture) {                        
                        switch (gesture.type) {
                          case "keyTap":
                              pointer.tap(position);
                              break;
                          case "screenTap":
                              pointer.tap(position);
                              break;
                        }
                    });
                } else {
                    pointer.setTransform(position, 0);
                }
            }
        });
    });
}

function replaceContent(content) {
    clickables = [];
    $('#container').html(content);
}

function index() {
    
    var startGameBtn = $('#start-game');
    var highScoresBtn = $('#high-scores');
    
    clickables.push(new Clickable(startGameBtn));
    clickables.push(new Clickable(highScoresBtn));
    
    startGameBtn.on('click', function () {
        $.ajax({ 
            type: 'GET',
            dataType: 'html',
            async: false, 
            url: 'new-game.html',
            success: function (content) {
                replaceContent(content);
                newGame();
            }
        });
    });
    
    highScoresBtn.on('click', function () {
        $.ajax({ 
            type: 'GET',
            dataType: 'html',
            async: false, 
            url: 'high-scores.html',
            success: function (content) {
                replaceContent(content);
                highScores();
            }
        });
    });  
    
    initHelp();
}

function newGame() {
    
    var shortGameBtn = $('#short-game');
    var longGameBtn = $('#long-game');
    var returnBtn = $('#return');
    
    clickables.push(new Clickable(shortGameBtn));
    clickables.push(new Clickable(longGameBtn));
    clickables.push(new Clickable(returnBtn));
    
    shortGameBtn.on('click', function () {
        $.ajax({ 
            type: 'GET',
            dataType: 'html',
            async: false, 
            url: 'game.html',
            success: function (content) {
                replaceContent(content);
                play({ short: true });
            }
        });
    });
    
    longGameBtn.on('click', function () {
        $.ajax({ 
            type: 'GET',
            dataType: 'html',
            async: false, 
            url: 'game.html',
            success: function (content) {
                replaceContent(content);
                play({ long: true });
            }
        });
    });
    
    returnBtn.on('click', function () {
        $.ajax({ 
            type: 'GET',
            dataType: 'html',
            async: false, 
            url: 'main-menu.html',
            success: function (content) {
                replaceContent(content);
                index();
            }
        });
    });
}

function highScores() {
    var highScoresList = $('#high-scores');
    var sortedScores = _.sortBy(scores, function (score) { return score; }).reverse();
    for (var i = 0; i < sortedScores.length; i++) {
        if (i == 0) {
            highScoresList.append('<li class="list-group-item list-group-item-winner">' + sortedScores[i] + '<img src="img/trophy.jpg"></img></li>');
        } else {
            highScoresList.append('<li class="list-group-item">' + sortedScores[i] + '</li>');
        }
    }
    var returnBtn = $('#return');
    clickables.push(new Clickable(returnBtn));
        returnBtn.on('click', function () {
        $.ajax({ 
            type: 'GET',
            dataType: 'html',
            async: false, 
            url: 'main-menu.html',
            success: function (content) {
                replaceContent(content);
                index();
            }
        });
    });
}

function play(opts) {
    var duration = DURATIONS.short;
    var returnBtn = $('#return');
    clickables.push(new Clickable(returnBtn));
    returnBtn.on('click', function () {
        $.ajax({ 
            type: 'GET',
            dataType: 'html',
            async: false, 
            url: 'main-menu.html',
            success: function (content) {
                finishGame();
                resetGame();
                replaceContent(content);
                index();
            }
        });
    });
    
    if (opts.short) {
        duration = DURATIONS.short;
    } else if (opts.long) {
        duration = DURATIONS.long;
    }
    
    buildGame(duration, true);
}

function buildGame (duration, reset) {
    
    if (reset == true) {
        game = [];
        CURRENT_GESTURE = 0;
        $('.finger-pointer').show();
    } 
    
    // Returns a random integer between min (inclusive) and max (inclusive)
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    var totalSeconds = duration.duration;
    var totalGestures = Math.round(totalSeconds / GESTURE_DURATION) + 1;
    for (var i = 0; i < totalGestures; i++) {
        var squareIdx = getRandomInt(1, 9);
        var squareElem = $('#square-' + squareIdx);
        var playable = new Clickable(squareElem);
        game.push({ square: playable, gesture: getRandomInt(0, gestures.length - 1), score: 0 });
    }
    
    if (reset == true) {
        clock = $('#time-left').FlipClock(totalSeconds, {
            clockFace: 'MinuteCounter',
            countdown: true,
            language: 'es',
            callbacks: {
                interval: function () {
                    if (this.count > 0 && this.count % GESTURE_DURATION == 0) {
                        incrementGesture();
                        setCurrentGesture();
                    }
                },
                stop: function () {
                    $('#current-order').html('Juego finalizado. Presiona volver para ir al menú');
                }
            }
        });
        clock.start();
        setCurrentGesture();
    }
}

function resetGame() {
    $('.finger-pointer').hide();
    $('#left-pointer').show();
    $('#right-pointer').show();
    CURRENT_GESTURE = -1;
    game = [];
    score = 0;
    clock.stop();
    clock = {};
}

function incrementGesture() {
    CURRENT_GESTURE = CURRENT_GESTURE + 1;
}

function setCurrentGesture() {
    var order = game[CURRENT_GESTURE];
    if (CURRENT_GESTURE > 0) {
        // Clear the previous
        var previous = game[CURRENT_GESTURE - 1];
        update(previous, true);
    }
    update(order);
    
    function update(order, revert) {
        var gesture = gestures[order.gesture];
        var squareElem = order.square.elem;
        var jumbotron = $('div', squareElem);
        jumbotron.css('background-color', (revert == true ? '#EEE' : gesture.color));
        $('#current-order').html(gesture.description);
    }
}

function updateScore() {
    var time = clock.getTime();
    var seconds = time.getSeconds();
    score = score + 1;
    $('#score').html('Puntos: ' + score);
}

function finishGame() {
    if (scores.length == 5) {
        scores.pop();
    }
    scores.push(score);
}

function initHelp() {
    var help = $('#help');
    if (help && help.length > 0) {
        setTimeout(function () {
            help.fadeOut(750);
            help.fadeIn(750);
            initHelp();
        }, 3000);
    }
}