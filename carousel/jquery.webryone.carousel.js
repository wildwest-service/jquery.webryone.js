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
    var Carousel = function () {};

    Carousel.prototype = {
        constructor: Carousel,

        defaults: {
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
        },

        setOptions: function (options) {
            this.options = $.extend(true, {}, this.defaults, options);
        },

        methods: {
            init: function (options) {
                
                Carousel.prototype.setOptions(options);

                return this.each(function () {
                    Carousel.prototype.mainProcessing(this);
                });
            }
        },

        mainProcessing: function(that) {
            
        }
    };

    $.fn.carousel = function (options) {
        return $._callMethods( new Carousel, options, this );
    };

})(jQuery);
