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

    // Time elapsed function
    window.timeElapse = function (date) {
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
        var result = `<span class="digit">${days}</span> days <span class="digit">${hours}</span> hours <span class="digit">${minutes}</span> minutes <span class="digit">${seconds}</span> seconds`;
        $("#elapseClock").html(result);
    };

    // Show messages after heart animation completes
    window.showMessages = function () {
        adjustWordsPosition();
        $('#messages').fadeIn(5000, function () {
            showLoveU(); // Call to show "I love you" message
        });
    };

    // Adjust the positioning of the text message
    function adjustWordsPosition() {
        $('#words').css("position", "absolute");
        $('#words').css("top", $("#garden").position().top + 195); // Adjust as needed for centering
        $('#words').css("left", $("#garden").position().left + 70); // Adjust as needed for centering
    }

    // Show "I love you" message
    function showLoveU() {
        $('#loveu').fadeIn(3000); // Ensure this is called after messages are shown
    }
})(jQuery);
