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
     * #CSS3 transition
     *
     * $("div").css({
     *     "background-color":   "red",
     *     width:                "800px",
     *     height:               "600px"
     * })
     * .transition({
     *     property:           "width, height",
     *     duration:           5000,
     *     "timing-function":  "ease",
     *     delay:              1000,
     *     complete:           function () {}
     * });
     * 
     * @param  {Object} option 上記transitionオプションオブジェクト
     * @return {Object}        jQueryObject
     */
    var Transition = function () {};

    Transition.prototype = {
        constructor: Transition,

        defaults: {
            property:           "",
            duration:           500,
            "timing-function":  "ease",
            delay:              0,
            complete:           function () {}
        },

        setOptions: function (options) {
            this.options = $.extend(true, {}, this.defaults, options);
        },

        methods: {
            init: function (options) {
                if ( !$.hasTransition() ) {
                    $.error("transitionプロパティが未対応です");
                    return this;
                }

                Transition.prototype.setOptions(options);

                return this.each(function () {
                    Transition.prototype.mainProcessing(this);
                });
            }
        },

        mainProcessing: function(that) {
            that.style[$.changeCss3PropToJsRef("transition")] = "";

            that.style[$.changeCss3PropToJsRef("transition-property")]          = this.options.property;
            that.style[$.changeCss3PropToJsRef("transition-duration")]          = this.options.duration+"ms";
            that.style[$.changeCss3PropToJsRef("transition-timing-function")]   = this.options["timing-function"];
            that.style[$.changeCss3PropToJsRef("transition-delay")]             = this.options.delay+"ms";
            
            var me = this;
            // completeリスナー削除 & 実行
            var _handle = function () {
                //削除
                $(that).off(".transitionEnd");
                
                //実行
                that.style[$.changeCss3PropToJsRef("transition")] = "";
                me.options.complete.apply(that);
            };
            
            //リスナー登録
            $(that).on("webkitTransitionEnd.transitionEnd", _handle);
            $(that).on("MozTransitionEnd.transitionEnd", _handle);
            $(that).on("mozTransitionEnd.transitionEnd", _handle);
            $(that).on("msTransitionEnd.transitionEnd", _handle);
            $(that).on("oTransitionEnd.transitionEnd", _handle);
            $(that).on("transitionEnd.transitionEnd", _handle);
            $(that).on("transitionend.transitionEnd", _handle);
        }
    };

    $.fn.transition = function (options) {
        return $._callMethods( new Transition, options, this );
    };

})(jQuery);
