/*
 * jquery.webryone.carousel.js v1.0.0
 * https://github.com/webryone/jquery.webryone.js/carousel/
 * 
 * MIT licensed
 * Copyright (C) 2014 Kohei Katada, http://webryone.jp/jquery.webryone.js/, https://twitter.com/webryone
 */

 ;
if ( (function () { "use strict"; return this===undefined; })() ) { (function () { "use strict"; })(); }

(function ($) {

    // jquery.webryone.core.jsが読み込まれているかチェック。(読み込まれていない場合は実行しない)
    if (!window.jQueryWebryOne) { return; }

    // jQueryメソッドを拡張

    /**
     * #carousel
     *
     * $(".carousel-wrapper").carousel({
     *     carouselContents: ".carousel-contents",
     *     width:            "500px",
     *     height:           "auto",
     *     slideDelay:       3000,
     *     slideDuration:    500,
     *     slideEasing:      "swing",
     *     autoHeight:       false,
     *     canSwipe:         true,
     *     showControl:      true,
     *     controlPanel:     ".carousel-control",
     *     controlNext:      ".carousel-control-next",
     *     controlPrev:      ".carousel-control-prev",
     *     showCurrent:      true,
     *     fadeIn:           true,
     *     fadeDuration:     500,
     *     comebackDelay:    3000,
     *     responsive:       true,
     *     windowBreakPoint: 991,
     *     showDescription:  true,
     *     description:      ".carousel-description"
     * });
     * 
     * @param  {Object} option 上記carouselオプションオブジェクト
     * @return {Object}        jQueryObject
     */
    $.fn.carousel = function (op) {

        // オプションのデフォルト値
        $.fn.carousel.defaults = {
            carouselContents:   ".carousel-contents",
            width:              "200px",
            height:             "auto",
            slideDelay:         3000,
            slideDuration:      500,
            slideEasing:        "swing",
            autoHeight:         true,
            canSwipe:           true,
            showControl:        true,
            controlPanel:       ".carousel-control",
            controlNext:        ".carousel-control-next",
            controlPrev:        ".carousel-control-prev",
            showCurrent:        true,
            fadeIn:             true,
            fadeDuration:       500,
            comebackDelay:      3000,
            responsive:         true,
            windowBreakPoint:   991,
            showDescription:    false,
            description:        ".carousel-description"
        };

        // オプションをマージして保存する
        var options = $.extend(true, {}, $.fn.carousel.defaults, op);

        // jQueryオブジェクトの参照
        var that = this;

        // オプションに応じて実行するメソッドを定義
        var methods = {
            init: function () {
                // カルーセルに必要な変数を定義
                var
                    $ul = that.children(options.carouselContents),
                    $li = $ul.children(),
                    $img = $li.find("img");

                // styleの初期値設定
                that.css({
                    overflow: "hidden",
                    width: options.width,
                    margin: "0",
                    padding: "0"
                });

                $img.css({
                    width: options.width,
                    height: options.height,
                    margin: "0",
                    padding: "0"
                });

                $ul.css({
                    position: "relative",
                    listStyle: "none",
                    margin: "0",
                    padding: "0",
                    width: parseInt(options.width, 10) * $li.length + "px",
                    height: $img.height()+"px"
                });

                $li.css({
                    float: "left",
                    width: options.width,
                    height: $img.height()+"px",
                    margin: "0",
                    padding: "0"
                });

                return that.each(function () {
                    // 初期化
                    carousel = mainProcessing($ul, $li.length, options);

                    // カルーセルをループ
                    carousel.loop();
                    
                    // カルーセルのストップイベントをバインド
                    that.on($.overEvt()+".stopCarousel", function () {
                        carousel.stop();
                    });

                    // カルーセルの再開イベントをバインド
                    that.on($.outEvt()+".startCarousel", function () {
                        setTimeout( carousel.loop, options.comebackDelay );
                    });
                });
            }
        };

        var
            timerId,    // タイマーIDを格納するための変数をグローバルに定義
            carousel;

        // カルーセルのメイン処理を定義
        var mainProcessing = function ($moveElem, $li_length, options) {
            // カルーセルの状態を管理するためのオブジェクト (クロージャ)
            var state = {
                counter: 0
            };

            // mainProcessingのメソッドを定義
            return {
                // スライドアニメーションメソッド
                move: function (delay) {
                    $moveElem.delay( (!delay) ? 0 : +delay ).animate({
                        left: ( state.counter >= $li_length-1 ) ? "0px" : "-=" + parseInt(options.width, 10)+"px"
                    },
                    {
                        duration: options.slideDuration,
                        easing: options.slideEasing,
                        queue: true,
                        complete: function () {}
                    });

                    state.counter++;

                    if ( state.counter > $li_length-1 ) {
                        state.counter = 0;
                    }
                },

                // ループメソッド
                loop: function () {
                    timerId = setInterval( function () { carousel.move(); }, options.slideDelay );
                },

                // ストップメソッド
                stop: function () {
                    clearInterval(timerId);
                }
            };
        };

        return $._fnCallMethods(methods, op);
    };

})(jQuery);
