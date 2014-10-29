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
            description:        ".carousel-current-description"
        };

        var options = $.extend(true, {}, $.fn.carousel.defaults, op);

        var that = this;

        var methods = {
            init: function () {
                return that.each(function () {
                    var height = $(this).height();
                    var width = $(this).width();

                    var carousel = new Carousel(width, height);

                    carousel.mainProcessing();
                });
            }
        };

        // コンストラクタ
        var Carousel = function (w, h) {
            this.with = w;
            this.height = h;
        };

        Carousel.prototype = {

            constructor: Carousel,

            mainProcessing: function () {
                this.width;
            }
        };

        return $._fnCallMethods(methods, op);
    };

})(jQuery);
