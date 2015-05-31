var pointers = {};
var clickables = [];
var scores = [10, 23, 43, 65, 70];
var TOP_OFFSET = -200;

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
        img.style.top = position[1] - TOP_OFFSET - img.height / 2 + 'px';
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

$(window.document).ready(function () {                
    Leap.loop({ enableGestures: true }, function (frame) {
        if (frame.valid) {
            frame.hands.forEach(function (hand, index) {
                var pointer = pointers[hand.type] || (pointers[hand.type] = new Pointer({ hand: hand.type }));
                var position = hand.screenPosition();
                var rotation = hand.roll();
                
                // Check for tapping
                if(frame.valid && frame.gestures.length > 0) {
                    frame.gestures.forEach(function(gesture) {                        
                        switch (gesture.type){
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
    
    if (opts.short) {
    
    } else if (opts.long) {
    
    } else {
    
    }    
}