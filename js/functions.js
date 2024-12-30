var $window = $(window), gardenCtx, gardenCanvas, $garden, garden;
var clientWidth = $(window).width();
var clientHeight = $(window).height();
var animationStarted = false;  // To ensure animation doesn't restart on resize

$(function () {
    // Setup garden
    $loveHeart = $("#loveHeart");
    var offsetX = $loveHeart.width() / 2;
    var offsetY = $loveHeart.height() / 2 - 55;
    $garden = $("#garden");
    gardenCanvas = $garden[0];
    gardenCanvas.width = $("#loveHeart").width();
    gardenCanvas.height = $("#loveHeart").height();
    gardenCtx = gardenCanvas.getContext("2d");
    gardenCtx.globalCompositeOperation = "lighter";
    garden = new Garden(gardenCtx, gardenCanvas);
    
    $("#content").css("width", $loveHeart.width() + $("#code").width());
    $("#content").css("height", Math.max($loveHeart.height(), $("#code").height()));
    $("#content").css("margin-top", Math.max(($window.height() - $("#content").height()) / 2, 10));
    $("#content").css("margin-left", Math.max(($window.width() - $("#content").width()) / 2, 10));

    // Render Loop for the garden animation
    setInterval(function () {
        garden.render();
    }, Garden.options.growSpeed);
});

$(window).resize(function() {
    var newWidth = $(window).width();
    var newHeight = $(window).height();
    if (newWidth != clientWidth || newHeight != clientHeight) {
        // Recalculate canvas size on resize, without restarting the animation unless necessary
        gardenCanvas.width = newWidth;
        gardenCanvas.height = newHeight;
        offsetX = newWidth / 2;
        offsetY = newHeight / 2 - 55;
        clientWidth = newWidth;
        clientHeight = newHeight;
        if (!animationStarted) {
            startHeartAnimation(); // Start animation if it's not already started
        }
    }
});

// Function to calculate heart shape points
function getHeartPoint(angle) {
    var t = angle / Math.PI;
    var x = 19.5 * (16 * Math.pow(Math.sin(t), 3));
    var y = - 20 * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    return new Array(offsetX + x, offsetY + y);
}

// Start heart animation function
function startHeartAnimation() {
    var interval = 50;
    var angle = 10;
    var heart = new Array();
    animationStarted = true;  // Prevent restart on resize
    var animationTimer = setInterval(function () {
        var bloom = getHeartPoint(angle);
        var draw = true;
        for (var i = 0; i < heart.length; i++) {
            var p = heart[i];
            var distance = Math.sqrt(Math.pow(p[0] - bloom[0], 2) + Math.pow(p[1] - bloom[1], 2));
            if (distance < Garden.options.bloomRadius.max * 1.3) {
                draw = false;
                break;
            }
        }
        if (draw) {
            heart.push(bloom);
            garden.createRandomBloom(bloom[0], bloom[1]);
        }
        if (angle >= 30) {
            clearInterval(animationTimer);
            showMessages();
        } else {
            angle += 0.2;
        }
    }, interval);
}

// Typewriter effect with callback for sequencing
(function($) {
    $.fn.typewriter = function(callback) {
        this.each(function() {
            var $ele = $(this), str = $ele.html(), progress = 0;
            $ele.html('');
            var timer = setInterval(function() {
                var current = str.substr(progress, 1);
                if (current == '<') {
                    progress = str.indexOf('>', progress) + 1;
                } else {
                    progress++;
                }
                $ele.html(str.substring(0, progress) + (progress & 1 ? '_' : ''));
                if (progress >= str.length) {
                    clearInterval(timer);
                    if (callback) callback(); // Call the callback after typing is finished
                }
            }, 75);
        });
        return this;
    };
})(jQuery);

// Time elapsed function
function timeElapse(date){
    var current = new Date();
    var seconds = (Date.parse(current) - Date.parse(date)) / 1000;
    var days = Math.floor(seconds / (3600 * 24));
    seconds = seconds % (3600 * 24);
    var hours = Math.floor(seconds / 3600);
    if (hours < 10) {
        hours = "0" + hours;
    }
    seconds = seconds % 3600;
    var minutes = Math.floor(seconds / 60);
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    seconds = seconds % 60;
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    var result = "<span class=\"digit\">" + days + "</span> days <span class=\"digit\">" + hours + "</span> hours <span class=\"digit\">" + minutes + "</span> minutes <span class=\"digit\">" + seconds + "</span> seconds"; 
    $("#elapseClock").html(result);
}

// Show messages after heart animation completes
function showMessages() {
    adjustWordsPosition();
    $('#messages').fadeIn(5000, function() {
        showLoveU();
    });
}

// Adjust the positioning of the text message
function adjustWordsPosition() {
    $('#words').css("position", "absolute");
    $('#words').css("top", $("#garden").position().top + 195);
    $('#words').css("left", $("#garden").position().left + 70);
}

// Adjust the positioning of the code block
function adjustCodePosition() {
    $('#code').css("margin-top", ($("#garden").height() - $("#code").height()) / 2);
}

// Show "I love you" message
function showLoveU() {
    $('#loveu').fadeIn(3000);
}

// Start the page interactions
$(document).ready(function() {
    // Set content for the code block
    $('#messages').text('PALANG KA TAKKA SO MUCH');
    $('#code').html('<span class="comments">/**</span><br /> <span class="comments">*THE CODE OF LOVE</span><br /> <span class="comments">*/</span><br /> Hey Girl !<br /> Do you remember the day we first met?<br /> <span class="comments">// The ET-LAB Friday. </span><br /> Since that day a spark begun;<br /> <span class="comments">// Your face Your Voice Your Words.</span><br /> Your everything got imprinted in my heart;<br /> As the time went on;<br /> The Bond grew stronger and stronger;<br /> Journey from Infatuation to Love;<br /> We have traveled a long way together;<br /> There have been fights ;<br /> <span class="comments">// And I'm sure there will be more.</span><br /> But our Bond will always grow back Stronger;<br /> <br /> <br /> All I want to say is:<br /> Baby, I will love you forever;<br /> <br /> <br /> Now If you want to hug me you can touch the heart below<br />');

    // Start typing effect
    $('#code').typewriter(function() {
        setTimeout(function() {
            startHeartAnimation(); // Start heart animation after typing effect is done
        }, 500);
    });

    // Start the time elapsed function
    timeElapse(together);
    setInterval(function () {
        timeElapse(together);
    }, 500);

    // Start the heart animation after 5 seconds
    setTimeout(function () {
        startHeartAnimation();
    }, 5000);
});
