/*
 * jquery.webryone.js v1.0.0
 * https://github.com/webryone/jquery.webryone.js/
 * 
 * MIT licensed
 * Copyright (C) 2014 Kohei Katada, http://webryone.jp/jquery.webryone.js/, https://twitter.com/webryone
 */

 ;
if ( (function () { "use strict"; return this===undefined; })() ) { (function () { "use strict"; })(); }

(function ($) {

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
            if ( nameSpace.methods[options] ) {
                return nameSpace.methods[options].apply( self, Array.prototype.slice.call( arguments, 1 ));
            } else if ( typeof options === "object" || !options ) {
                return nameSpace.methods.init.apply( self, Array.prototype.slice.call( arguments, 1 ));
            } else {
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
         * #ブラウザを判別。ブラウザ名を返す。
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
         * @return {String} "touchstart" or "mouseover"
         */
        overEvt: function () {
            return ( (this.hasTouch()) && "touchstart" ) || "mouseover";
        },

        /**
         * #タッチデバイス判定後、対応したイベント名を返す。
         * @return {String} "touchend" or "mouseout"
         */
        outEvt: function () {
            return ( (this.hasTouch()) && "touchend" ) || "mouseout";
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
         */
        preloadImages: function (imagePathes, callback) {
            var img = [],
                img_arr_lngth = imagePathes.length;

            $.each(imagePathes, function (idx) {
                img[idx] = new Image();
                img[idx].onload = function () {
                    img_arr_lngth = img_arr_lngth - 1;
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
    $.fn.maxHeight = function () {

        var max = 0;

        this.each(function () {
            max = Math.max( max, $(this).height() );
        });

        return max;
    };

    /**
     * #ホバー時に指定の画像に差し替える（画像のロールオーバー）
     *
     * $("img").rollOverImg({
     *     suffix:         "_rollOverImg",
     *     onTouch:        true,
     *     preload:        true,
     *     onCallback:     function () {},
     *     offCallback:    function () {}
     * });
     *
     * #設定したイベントをアンバインド
     * $("img").rollOverImg("destroy");
     * 
     * @param  {Object} option 上記オプションオブジェクト
     * @return {Object}        jQueryObject
     */
    var rollOverImg = {};

    rollOverImg.methods = {
        init: function (options) {
            var _settings = $.extend({
                suffix:         "_rollOverImg",
                onTouch:        true,
                preload:        true,
                onCallback:     function () {},
                offCallback:    function () {}
            }, options);

            return this.each(function () {
                _rollOver(this);
            });

            function _rollOver(that) {
                var overEvt     = ( (_settings.onTouch) && $.overEvt() ) || "mouseover",
                    outEvt      = ( (_settings.onTouch) && $.outEvt() ) || "mouseout";

                var processedPath,
                    processedPathes = [];

                processedPath = that.src,
                extentions    = processedPath.match(/\.jpg|\.png|\.gif/);

                processedPath = processedPath.replace(extentions, _settings.suffix+extentions);

                processedPathes[0] = processedPath;

                var __handler = function () {
                    (function (me) {
                        var finishPath = processedPathes[0]
                        $(me).on(overEvt+".rollOverImg", function () {
                            this.src = finishPath;
                            _settings.onCallback();
                        });
                    })(that);

                    (function (me) {
                        var initPath = me.src;
                        $(me).on(outEvt+".rollOverImg", function () {
                            this.src = initPath
                            _settings.offCallback();
                        });
                    })(that);
                };

                ( (_settings.preload) && $.preloadImages(processedPathes, __handler) ) || __handler();
            }
        },

        destroy: function (options) {
            return this.each(function () {
                $(this).off(".rollOverImg");
            });
        }
    };

    $.fn.rollOverImg = function (options) {
        $._callMethods( rollOverImg, options, this );
    };

    /**
     * #セレクターから指定したクラスを削除し、クリックした要素に指定したクラスを付与する
     * 
     * $("button").toggleActiveClass({
     *     className:    "active",
     *     onTouch:      true,
     *     callback:     function (me, self, e) {}
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
                callback:  function (me, self, e) {}
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

                    _settings.callback(this, self, e);
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
        $._callMethods( toggleActiveClass, options, this );
    }

})(jQuery);
