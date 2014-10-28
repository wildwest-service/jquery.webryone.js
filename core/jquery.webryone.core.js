/*
 * jquery.webryone.core.js v1.0.0
 * https://github.com/webryone/jquery.webryone.js/core/
 * 
 * MIT licensed
 * Copyright (C) 2014 Kohei Katada, http://webryone.jp/jquery.webryone.js/, https://twitter.com/webryone
 */

 ;
if ( (function () { "use strict"; return this===undefined; })() ) { (function () { "use strict"; })(); }

var jQueryWebryOne = {}; //グローバル空間にネームスペースとして定義。

(function ($) {

    // ローディングイメージ
    var loadingImage = "data:image/gif;base64,R0lGODlhGgAaALMAAP///9XV1dHR0c/Pz83NzZmZmWZmZjIyMgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQFBwAJACwCAAIAFgAWAAAEXjDJSRGiOGOr+77edBwfFgTZSE7cdKLpyILJ66lSa4e4e4aiDAxIpBiOSENHwGwKksilk1msSgqZQbHApQy+QC42QSBIvtqOeFKeoDVrttkNxnQpbW8amLfK/XhzHREAIfkEBQcACQAsAgACABMAEwAABD4wyUnPoThLq/u+nmFgHIUgkzhOpXSiqciCyZupn3t2+GSHGZhnKCkYjwViAnlUOp2E54RAlVKjz6u1un1GAAAh+QQFBwAJACwCAAIAFgATAAAERzDJSY2hOGOr+77eVBQfdhzZSE7cdKLpyILJ66lSa4e4e4aiDAxIpBCOSEIHwWwiksilk1msegJWTGCbpWyxXck3LOaSzYkIACH5BAUHAAkALAUAAgATABMAAARAMMmZSqE4S6v7vh5BYBxlGJM4TqV0oqnIgsmbqZ97dvhkhxmYZ0jMHI7IQzGJLDoxiOcEQZVKqFEr1prYarOJCAAh+QQFBwAJACwMAAIADAAWAAAEOpCQRKuVNiesK69F4U1gOJbimYSpxnYgLHdGbRvZbc/aMR9ADQJBAfosw4oRSVQGKUnLMxGFVTtXTQQAIfkEBQcACQAsBQAFABMAEwAABD8wyUkpITXXi7Xm3neFGUiWZ6pKResW6euuIZIZJKJTRu/ptsThIOnhKsDJcGKkJJVEpk+yoyx5R8+Vtl11MxEAIfkEBQcACQAsAgAMABYADAAABDcQyYmSvZboTejEGLeBZGleB1mc2OFiRcwmbpoYhhWvZn3hl13J98sFZaAXBgjjzZizEjQKmpIiACH5BAkHAAkALAIAAgAWABYAAAREMMlJq7046z0R4pj3gZZIlt5ZmWrXvskhz8dJz3BeGRYBGkAKYbgB8hKFgmTowxgnyQnz8oQqpcTd0VrJbqIw8Et8iQAAOw==";
    
    /**
     * #jQueryオブジェクトを拡張
     */
    $.extend({
        /**
         * #jQueryメソッド定義時に使用する、メソッド呼び出し関数
         * @param  {Object} nameSpace メソッドのネームスペース
         * @param  {Object} options   オプションオブジェクトか、メソッド名
         * @param  {Object} self      this
         */
        _callMethods: function (nameSpace, options, self) {
            if ( nameSpace.methods[options] ) { //オプションがある場合は、nameSpace.methods[options]() を実行する。
                return nameSpace.methods[options].apply( self, Array.prototype.slice.call( arguments, 1 ));
            } else if ( typeof options === "object" || !options ) { //オプションがオブジェクト形式{}か、ない場合に、nameSpace.methods.init() を実行する。
                return nameSpace.methods.init.apply( self, Array.prototype.slice.call( arguments, 1 ));
            } else {    //それ以外はエラーをスローする。
                $.error( "オプション: " + options + " は、" + nameSpace + " に存在しません" );
            }
        },

        /**
         * #与えられた値の小数点以下の桁数を返す(multiply, subtractで使用)
         * 例)
         * * 10.12  => 2
         * * 99.999 => 3
         * * 33.100 => 1
         * 
         * @param  {Number} value 小数点付き数値
         * @return {Number}       与えられた値の小数点以下の桁数を返す
         */
        _getDecimalLength: function (value) {
            var list = (value + "").split("."), result = 0;
            if (list[1] !== undefined && list[1].length > 0) {
                result = list[1].length;
            }
            return result;
        },

        /**
         * #小数点付き数値の乗算処理
         * value1, value2から小数点を取り除き、整数値のみで乗算を行う。
         * その後、小数点の桁数Nの数だけ10^Nで除算する
         * 
         * @param  {Number} value1 小数点付き数値
         * @param  {Number} value2 小数点付き数値
         * @return {Number}        乗算した小数点付き数値を返す
         */
        multiply: function (value1, value2) {
            var intValue1 = +(value1 + "").replace(".", ""),
                intValue2 = +(value2 + "").replace(".", ""),
                decimalLength = this._getDecimalLength(value1) + this._getDecimalLength(value2),
                result;

            result = (intValue1 * intValue2) / Math.pow(10, decimalLength);

            return result;
        },

        /**
         * #小数点付き数値の減算処理
         * value1,value2を整数値に変換して減算
         * その後、小数点の桁数分だけ小数点位置を戻す
         * @param  {Number} value1 小数点付き数値
         * @param  {Number} value2 小数点付き数値
         * @return {Number}        減算した小数点付き数値を返す
         */
        subtract: function (value1, value2) {
            var max = Math.max(this._getDecimalLength(value1), this._getDecimalLength(value2)),
                k = Math.pow(10, max);
            return (this.multiply(value1, k) - this.multiply(value2, k)) / k;
        },
        
        /**
         * #ブラウザを判別。ブラウザ名を返す。   ※IEの判定が未実装のため非推奨。
         * @return {String} "Chrome" or "Safari" or "Firefox" or "Opera" or "Gecko" or "IE" or Android or iOSdevice or touchPad or null
         */
        getBrowser: function () {
            var ua = window.navigator.userAgent;
            if      ( /chrome/i.test(ua) )   { return "Chrome";  }
            else if ( /safari/i.test(ua) )   { return "Safari";  }
            else if ( /firefox/i.test(ua) )  { return "Firefox"; }
            else if ( /opera/i.test(ua) )    { return "Opera";   }
            else if ( /getcko/i.test(ua) )   { return "Gecko";   }
            else if ( /msie/i.test(ua) )     { return "IE";      }
            else if ( (/android/gi).test(window.navigator.appVersion) )     { return "Android";   }
            else if ( (/iphone|ipad/gi).test(window.navigator.appVersion) ) { return "iOSdevice"; }
            else if ( (/hp-tablet/gi).test(window.navigator.appVersion) )   { return "touchPad";  }
            else { return null; }
        },
        
        /**
         * #モバイル判定。真偽値を返す。
         * @return {Boolean} true or false
         */
        isMobile: function () {
            var ua = window.navigator.userAgent;
            return (ua.indexOf("iPhone") > -1 || ua.indexOf("iPad") > -1 || ua.indexOf("Android") > -1);
        },
        
        /**
         * #ベンダープレフィックスを返す。
         * @return {String} "-webkit-" or "-moz-" or "-o-" or "-ms-" or null
         */
        vendorPrefix: function () {
            switch ( this.getBrowser() ) {
                case "Android"   : return "-webkit-"; break;
                case "iOSdevice" : return "-webkit-"; break;
                case "touchPad"  : return "-webkit-"; break;
                
                case "Chrome"    : return "-webkit-"; break;
                case "Safari"    : return "-webkit-"; break;
                case "Firefox"   : return "-moz-";    break;
                case "Opera"     : return "-o-";      break;
                case "IE"        : return "-ms-";     break;
                case null        : return "";         break;
            }
        },
        
        /**
         * #jsのリファレンス名を返す。
         * @param  {String} _cssProp (例 "margin-left"
         * @return {String}          (例 "marginLeft"
         */
        changeCssPropToJsRef: function (_cssProp) {
            return _cssProp.replace(/-./g, function (s) { return s.charAt(1).toUpperCase(); });
        },
        
        /**
         * #CSSのプロパティ名を返す。
         * @param  {String} _jsRef (例 "marginLeft"
         * @return {String}        (例 "margin-left"
         */
        changeJsRefToCssProp: function (_jsRef) {
            return _jsRef.replace(/[A-Z]/g, function (s) { return "-" + s.toLowerCase(); });
        },
        
        /**
         * #jsのリファレンス名を返す。(ベンダープレフィックス付、CSS3対応)
         * @param  {String} _cssProp (例 "animation"
         * @return {String}          (例 "WebkitAnimation"
         */
        changeCss3PropToJsRef: function (_cssProp) {
            var dummyElem = document.createElement("div");
            if ( !(this.changeCssPropToJsRef(_cssProp) in dummyElem.style) ) {
                dummyElem = null;
                return this.changeCssPropToJsRef( (this.vendorPrefix() + _cssProp) );
            } else {
                dummyElem = null;
                return this.changeCssPropToJsRef(_cssProp);
            }
        },
        
        /**
         * #CSS3のtransitionプロパティに対応しているかどうかの真偽値を返す。
         * @return {Boolean} true or false
         */
        hasTransition: function () {
            var dummyElem = document.createElement("div");
            if ( this.changeCss3PropToJsRef("transition") in dummyElem.style ) {
                dummyElem = null;
                return true;
            } else {
                dummyElem = null;
                return false;
            }
        },
        
        /**
         * #CSS3のanimationプロパティに対応しているかどうかの真偽値を返す。
         * @return {Boolean} true or false
         */
        hasAnimation: function () {
            var dummyElem = document.createElement("div");
            if ( this.changeCss3PropToJsRef("animation") in dummyElem.style ) {
                dummyElem = null;
                return true;
            } else {
                dummyElem = null;
                return false;
            }
        },
        
        /**
         * #CSS3の3d系プロパティに対応しているかどうかの真偽値を返す。
         * @return {Boolean} true or false
         */
        has3d: function () {
            var dummyElem = document.createElement("div");
            if ( this.changeCss3PropToJsRef("perspective") in dummyElem.style ) {
                dummyElem = null;
                return true;
            } else {
                dummyElem = null;
                return false;
            }
        },
        
        /**
         * #タッチデバイス判定
         * @return {Boolean} true or false
         */
        hasTouch: function () {
            return ( ("ontouchstart" in window) && true ) || false;
        },
        
        /**
         * #タッチデバイス判定後、対応したイベント名を返す。
         * @return {String} "orientationchange" or "resize"
         */
        resizeEvt: function () {
            return ( ("onorientationchange" in window) && "orientationchange" ) || "resize";
        },
        
        /**
         * #タッチデバイス判定後、対応したイベント名を返す。
         * @return {String} "touchstart" or "click"
         */
        clickEvt: function () {
            return ( (this.hasTouch()) && "touchstart" ) || "click";
        },
        
        /**
         * #タッチデバイス判定後、対応したイベント名を返す。
         * @return {String} "touchstart" or "mousedown"
         */
        startEvt: function () {
            return ( (this.hasTouch()) && "touchstart" ) || "mousedown";
        },
        
        /**
         * #タッチデバイス判定後、対応したイベント名を返す。
         * @return {String} "touchmove" or "mousemove"
         */
        moveEvt: function () {
            return ( (this.hasTouch()) && "touchmove" ) || "mousemove";
        },
        
        /**
         * #タッチデバイス判定後、対応したイベント名を返す。
         * @return {String} "touchend" or "mouseup"
         */
        endEvt: function () {
            return ( (this.hasTouch()) && "touchend" ) || "mouseup";
        },
        
        /**
         * #タッチデバイス判定後、対応したイベント名を返す。
         * @return {String} "touchcancel" or "mouseup"
         */
        cancelEvt: function () {
            return ( (this.hasTouch()) && "touchcancel" ) || "mouseup";
        },

        /**
         * #タッチデバイス判定後、対応したイベント名を返す。
         * @return {String} "touchstart" or "mouseenter"
         */
        overEvt: function () {
            return ( (this.hasTouch()) && "touchstart" ) || "mouseenter";
        },

        /**
         * #タッチデバイス判定後、対応したイベント名を返す。
         * @return {String} "touchend" or "mouseleave"
         */
        outEvt: function () {
            return ( (this.hasTouch()) && "touchend" ) || "mouseleave";
        },
        
        /**
         * #キューを登録・実行(消化)・確認できる。
         *     //初期化
         *     var queue = new this.deferred();
         *     //登録
         *     queue.done(function(data){ alert(data); });
         *     //実行(消化)
         *     queue.resolve(data);
         *     //実行済みか確認
         *     queue.isResolved();
         * @return {Object} キューを登録・実行(消化)・確認するための関数を返す。
         */
        deferred: function () {
            var _queue = new Array(),
                _data;
            
            var resolve = function (data) {
                if ( isResolved() ) { return; }
                
                var arr = _queue,
                    i   = 0,
                    l   = arr.length;
                
                _queue = null;
                _data  = data;
                
                for ( ; i < l; i++) {
                    arr[i](data);
                }
            };
            
            var isResolved = function () {
                return !_queue;
            };
            
            var done = function (_func) {
                (_queue)
                ? _queue.push(_func)
                : _func(_data);
            };
            
            return {
                resolve       : resolve,
                isResolved    : isResolved,
                done          : done
            };
        },
        
        /**
         * #DOM Elementかどうかの真偽値を返す。
         * @param  {Object}  elem document.getElementById("element")
         * @return {Boolean}      true or false
         */
        isElement: function (elem) {
            var check = null;
            if( elem && elem.nodeType === 1) {
                try {
                    check = elem.cloneNode(false);
                } catch(e) {
                    return false;
                }
                
                try {
                    if( check == elem ){
                        return false;
                    } else {
                        check.nodeType = 9;
                    }
                    
                    if (check.nodeType === 1) {
                        return true;
                    } else {
                        return false;
                    }
                } catch (e) {
                    return true;
                }
            } else {
                return false;
            }
        },

        /**
         * #画像プリロード
         * @param  {Array}   imagePathes 画像のパスを配列で渡す
         * @param  {Function} callback    画像プリロード後に実行するコールバック関数
         * @param  {Function} callback_one  画像1枚ロード毎に実行するコールバック関数
         */
        preloadImages: function (imagePathes, callback, callback_one) {
            var img = [],
                img_arr_lngth = imagePathes.length;

            $.each(imagePathes, function (idx) {
                img[idx] = new Image();
                img[idx].onload = function () {
                    img_arr_lngth = img_arr_lngth - 1;
                    // 画像を1枚読み込む毎に
                    ( callback_one && typeof callback_one === "function" ) && callback_one();
                    if ( 0 >= img_arr_lngth ) {
                        // 最後の画像を読み込み終わったら
                        ( callback && typeof callback === "function" ) && callback();
                    }
                };
                img[idx].src = imagePathes[idx];
            });
            return true;
        }
    });



    // jQueryメソッドを拡張
    
    /**
     * #一番高い要素の高さを返す
     * @return {Number} 一番高い要素の高さを返す
     */
    $.fn.getMaxHeight = function () {

        var max = 0;

        this.each(function () {
            max = Math.max( max, $(this).height() );
        });

        return max;
    };

    /**
     * #セレクターから指定したクラスを削除し、クリックした要素に指定したクラスを付与する
     * 
     * $("button").toggleActiveClass({
     *     className:    "active",
     *     onTouch:      true,
     *     callback:     function (these) {}
     * });
     *
     * #設定したイベントをアンバインド
     * $("button").toggleActiveClass("destroy");
     * 
     * @param  {Object} option 上記オプションオブジェクト
     * @return {Object}        jQueryObject
     */
    var toggleActiveClass = {};

    toggleActiveClass.methods = {
        init: function (options) {
            var _settings = $.extend({
                className: "active",
                onTouch:   true,
                callback:  function (these) {}
            }, options);

            var self = this;

            return this.each(function () {
                _toggleClass(this);
            });

            function _toggleClass(that) {
                var evtType = (_settings.onTouch) ? $.clickEvt() : "click";

                $(that).on(evtType+".toggleActiveClass", function (e) {
                    self.removeClass(_settings.className);
                    $(this).addClass(_settings.className);

                    _settings.callback.apply(this, self);
                });
            }
        },

        destroy: function (options) {
            return this.each(function () {
                $(this).off(".toggleActiveClass");
            });
        }
    };

    $.fn.toggleActiveClass = function (options) {
        return $._callMethods( toggleActiveClass, options, this );
    };

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
