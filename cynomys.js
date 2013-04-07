/*!
 * jQuery Cynomys Plugin v1.3.1
 * https://github.com/z5h/cynomys
 *
 * Copyright 2013 Mark Bolusmjak
 * Released under the MIT license
 */
(function ($) {


    var resetList = [];
    function cynomysPageReset(){
        $.each(resetList, function(i, f){
           f();
        });
    }

    $.fn.cynomys = function (options) {
        var $this = $(this);

        var settings = $.extend({
            scrollDelta: 100,
            secondsDelta: 5,
            clickDelta: 5,

            scrollAction: null,
            secondsAction: null,
            clickAction: null,

            cookie: null

        }, options);

        var scrollCounter;
        var secondsCounter;
        var clickCounter;

        function resetAll() {
            scrollCounter = 0;
            secondsCounter = 0;
            clickCounter = 0;
        }
        resetList.push(resetAll);
        resetAll();

        if ($.cookie && settings.cookie) {
            try {
                var jsonString = $.cookie("cynomys." + settings.cookie);
                var lastValues = JSON.parse(jsonString);
                scrollCounter = lastValues['scrollCounter'];
                secondsCounter = lastValues['secondsCounter'];
                clickCounter = lastValues['clickCounter'];
            } catch (e){
            } finally {
                $.removeCookie("cynomys." + settings.cookie, {path : '/'});
            }

        }

        if (settings.scrollDelta > 0 && settings.scrollAction) {
            $this.scroll(function (e) {
                scrollCounter += 1;
                if (scrollCounter >= settings.scrollDelta) {
                    if (settings.scrollAction()) cynomysPageReset();
                    scrollCounter = 0;
                }
            });
        }

        if (settings.secondsDelta > 0 && settings.secondsAction) {
            setInterval(function () {
                secondsCounter += 1;
                if (secondsCounter >= settings.secondsDelta) {
                    if (settings.secondsAction()) cynomysPageReset();
                    secondsCounter = 0;
                }
            }, 1000);
        }

        if (settings.clickDelta > 0 && settings.clickAction) {
            $this.on('click', function () {
                clickCounter += 1;
                if (clickCounter >= settings.clickDelta) {
                    if (settings.clickAction()) cynomysPageReset();
                    clickCounter = 0;
                }
            });
        }


        $(window).unload(function () {
            if ($.cookie && settings.cookie) {
                var value = JSON.stringify({
                    scrollCounter: scrollCounter,
                    secondsCounter: secondsCounter,
                    clickCounter: clickCounter
                });
                var key = "cynomys." + settings.cookie;
                $.cookie(key, value, {expires: 1, path: '/'});

            }
        });

        return $this;
    };
})(jQuery);

