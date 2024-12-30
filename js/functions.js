var $window = $(window), gardenCtx, gardenCanvas, $garden, garden;
var clientWidth = $window.width();
var clientHeight = $window.height();
var animationStarted = false;  // Ensure animation doesn't restart on resize

$(function () {
    // Setup garden
    var $loveHeart = $("#loveHeart");
    $garden = $("#garden");
    gardenCanvas = $garden[0];
    gardenCanvas.width = $loveHeart.width();
    gardenCanvas.height = $loveHeart.height();
    gardenCtx = gardenCanvas.getContext("2d");
    gardenCtx.globalCompositeOperation = "lighter";

    garden = new Garden(gardenCtx, gardenCanvas);

    // Render loop for the garden animation
    setInterval(function () {
        garden.render();
    }, Garden.options.growSpeed);

    // Center content
    centerContent($loveHeart);
});

function centerContent($loveHeart) {
    $("#content").css({
        "width": $loveHeart.width() + $("#code").width(),
        "height": Math.max($loveHeart.height(), $("#code").height()),
        "margin-top": Math.max(($window.height() - $("#content").height()) / 2, 10),
        "margin-left": Math.max(($window.width() - $("#content").width()) / 2, 10)
    });
}

$(window).resize(function () {
    var newWidth = $window.width();
    var newHeight = $window.height();
    if (newWidth !== clientWidth || newHeight !== clientHeight) {
        gardenCanvas.width = $garden.width(); // Use $garden width
        gardenCanvas.height = $garden.height(); // Use $garden height
        centerContent($("#loveHeart")); // Re-center content
        clientWidth = newWidth;
        clientHeight = newHeight;
    }
});

// Function to calculate heart shape points
function getHeartPoint(angle) {
    var t = angle / Math.PI;
    var x = 19.5 * (16 * Math.pow(Math.sin(t), 3));
    var y = -20 * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    return [gardenCanvas.width / 2 + x, gardenCanvas.height / 2 - 55 + y];
}

// Start heart animation function
function startHeartAnimation() {
    if (animationStarted) return; // Prevents restart
    var interval = 50;
    var angle = 10;
    var heart = [];
    animationStarted = true;

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
            animationStarted = false; // Reset for future animations
        } else {
            angle += 0.2;
        }
    }, interval);
}

// Typewriter effect with callback for sequencing
(function ($) {
    $.fn.typewriter = function (callback) {
        this.each(function () {
            var $ele = $(this), str = $ele.html(), progress = 0;
            $ele.html('');
            var timer = setInterval(function () {
                var current = str.substr(progress, 1);
                if (current === '<') {
                    progress = str.indexOf('>', progress) + 1;
                } else {
                    progress++;
                }
                $ele.html(str.substring(0, progress) + (progress & 1 ? '_' : ''));
                if (progress >= str.length) {
                    clearInterval(timer);
                    if (callback) callback();
                }
            }, 75);
        });
        return this;
    };
})(jQuery);

// Time elapsed function
function timeElapse(date) {
    var current = new Date();
    var seconds = (Date.parse(current) - Date.parse(date)) / 1000;
    var days = Math.floor(seconds / (3600 * 24));
    seconds %= (3600 * 24);
    var hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    var minutes = Math.floor(seconds / 60);
    seconds %= 60;

    $("#elapseClock").html(
        `<span class="digit">${days}</span> days <span class="digit">${hours.toString().padStart(2, '0')}</span> hours ` +
        `<span class="digit">${minutes.toString().padStart(2, '0')}</span> minutes <span class="digit">${seconds.toString().padStart(2, '0')}</span> seconds`
    );
}

// Show messages after heart animation completes
function showMessages() {
    adjustWordsPosition();
    $('#messages').fadeIn(5000, function () {
        showLoveU();
    });
}

// Adjust the positioning of the text message
function adjustWordsPosition() {
    $('#words').css({
        "position": "absolute",
        "top": $("#garden").position().top + 195,
        "left": $("#garden").position().left + 70
    });
}

// Show "I love you" message
function showLoveU() {
    $('#loveu').fadeIn(3000);
}

// Start the page interactions
$(document).ready(function () {
    $('#messages').text('PALANG KA TAKKA SO MUCH');
    $('#code').html(
        `<span class="comments">/**</span><br />` +
        `<span class="comments">*THE CODE OF LOVE</span><br />` +
        `<span class="comments">*/</span><br />` +
        `Hey Girl !<br />` +
        `Do you remember the day we first met?<br />` +
        `<span class="comments">// The ET-LAB Friday. </span><br />` +
        `Since that day a spark began;<br />` +
        `<span class="comments">// Your face Your Voice Your Words.</span><br />` +
        `Your everything got imprinted in my heart;<br />` +
        `As time went on;<br />` +
        `The Bond grew stronger and stronger;<br />` +
        `Journey from Infatuation to Love;<br />` +
        `We have traveled a long way together;<br />` +
        `There have been fights ;<br />` +
        `<span class="comments">// And I'm sure there will be more.</span><br />` +
        `But our Bond will always grow back Stronger;<br />` +
        `<br />` +
        `All I want to say is:<br />` +
        `Baby, I will love you forever;<br />` +
        `<br />` +
        `Now If you want to hug me you can touch the heart below<br />`
    );

    $('#code').typewriter(function () {
        setTimeout(startHeartAnimation, 500);
    });

    var together = new Date("2024-01-01T00:00:00"); // Replace with your date
    timeElapse(together);
    setInterval(function () {
        timeElapse(together);
    }, 500);
});
