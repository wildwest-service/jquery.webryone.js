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
    $.fn.getMaxHeight = function () {

        var max = 0;

        this.each(function () {
            max = Math.max( max, $(this).height() );
        });

        return max;
    };

    /**
     * #レスポンシブサイドメニュー
     *
     * $("#responsiveSideMenu").responsiveSideMenu({
     *     //全てオプション
     *     showOriginal:       false,               //オリジナルのメニューを表示 or 非表示
     *     enable3d:           true,                //3Dアニメーションの有効・無効(true or false)
     *     rotateX:            "0deg",              //3Dアニメーション時の縦回転の角度(deg (例)-45degとか)
     *     rotateY:            "66deg",             //3Dアニメーション時の横回転の角度(deg (例)45degだと45度)
     *     transformOrigin:    "left center",       //3Dアニメーション時の起点軸(left centerだと0% 50%でも同じ)
     *     perspective:        "3000px",            //3Dアニメーション時の奥行きの深さ
     *     duration:           300,                 //サイドメニュー開閉にかける時間(ミリ秒)
     *     delay:              0,                   //サイドバー開閉時のディレイ(ミリ秒)
     *     easing:             "ease",              //アニメーションのイージング設定
     *     windowBreakPoint:   "991px",             //レスポンシブデザイン切り替えウインドウ幅(px)
     *     width:              "75%",               //サイドメニューの幅(% or px)
     *     zIndex:             9999,                //サイドメニューのz-index値
     *     overlayBgColor:     "#000",              //サイドメニュー開放時メイン部にかかるオーバーレイ色
     *     overlayOpacity:     0.4,                 //上記オーバーレイの透明度
     *     toggleElementId:    "#toggleWebryMenu",  //サイドメニュー開閉要素のid
     *     contentsWrapperId:  "#pageWrapper",      //サイドメニューとメイン部を含むブロック要素(divとか)のid
     *     completeOpened:     function () {},      //サイドバーが開いたときに実行される関数
     *     completeClosed:     function () {}       //サイドバーが閉じたときに実行される関数
     * });
     * 
     * @param  {Object} options 上記responsiveSideMenuオプションオブジェクト
     * @return {Object}        jQueryObject
     */
    var responsiveSideMenu = {};

    responsiveSideMenu.methods = {

        init: function (options) {
            var _settings = $.extend({
                showOriginal:       false,
                enable3d:           false,
                rotateX:            "0deg",
                rotateY:            "45deg",
                transformOrigin:    "left center",
                perspective:        "3000px",
                duration:           500,
                delay:              0,
                easing:             "linear",
                windowBreakPoint:   769,
                width:              "65%",
                position:           "absolute",
                top:                0,
                zIndex:             9999,
                overlayBgColor:     "#000",
                overlayOpacity:     0.4,
                toggleElementId:    "#toggleResponsiveSideMenu",
                contentsWrapperId:  "#pageWrapper",
                func_open:          function(){},
                func_close:         function(){}
            }, options);

            return this.each(function () {
                _responsiveSideMenu(this);
            });

            function _responsiveSideMenu(that) {
                var
                    monitoringWindowExeFlag = false,
                    newId,
                    // CSS3プロパティをJSリファレンス名に変換
                    transitionProp  = $.changeCss3PropToJsRef("transition"),
                    transformProp   = $.changeCss3PropToJsRef("transform"),
                    // メニュー開閉判定フラグ
                    toggleOnFlag    = false;    //trueならサイドメニューを閉じる。falseならサイドメニューを開く。

                // ウインドウリサイズ監視関数
                function monitoringWindow() {
                    if ( $(window).width() <= _settings.windowBreakPoint ) {    //指定したウインドウ幅以下の場合に
                        if ( !monitoringWindowExeFlag ) {
                            // 要素をクローン
                            var cloneElem = $(that).clone();

                            // 要素を非表示
                            (!_settings.showOriginal)
                            &&
                            $(that).css("display", "none");
                            
                            // クローンした要素のIDを変更
                            newId = cloneElem.attr("id") + "_WEBRYMENU";
                            cloneElem.attr("id", newId);

                            // クローンした要素をDOMに追加
                            $("body").append(cloneElem);

                            // DOMに追加した要素のstyleを設定
                            $("#"+newId).css({
                                width:          _settings.width,
                                height:         $(window).height()+"px",
                                "overflow-y":   "scroll",
                                position:       _settings.position,
                                top:            _settings.top,
                                "z-index":      _settings.zIndex
                            });

                            ($.hasTouch()) && $("#"+newId).css("-webkit-overflow-scrolling", "touch");  //タッチデバイス時に慣性スクロールを有効にする

                            monitoringWindowExeFlag = true;
                        }

                        $("#"+newId).css({
                            left:   -$(window).width()+"px",    // 常にクローンした要素の右端を画面の左端に追従させる
                            height: $(window).height()+"px" //常にクローンした要素の高さをウインドウの高さに合わせる
                        });

                        $("#"+_settings.contentsWrapperId.substr(1)+"_overlay").css({
                            height: $(window).height()+"px" //常にオーバーレイ要素の高さをウインドウの高さに合わせる
                        });

                        (toggleOnFlag) && toggleSideMenu(); //サイドメニューが開いているときにサイドメニューを閉じる

                    } else {    //指定したウインドウ幅以上の場合に
                        if ( monitoringWindowExeFlag ) {
                            // サイドメニューの要素を削除
                            $("#"+newId).remove();

                            // 要素を表示
                            that.css("display", "block");

                            monitoringWindowExeFlag = false;
                        }
                    }
                }

                // メニュー開閉関数
                function toggleSideMenu() {
                    // ページラッパーにオーバーレイ
                    if ( !toggleOnFlag ) {  //サイドメニュー開いたとき
                        // ドキュメントスクロール禁止
                        $("body").css("overflow", "hidden");

                        // 要素を生成
                        var dom = $("<div id='"+_settings.contentsWrapperId.substr(1)+"_overlay"+"' style='display: none;'>");
                        // 生成した要素をページラッパー内に追加
                        $(_settings.contentsWrapperId).append(dom);
                        // 追加した要素のstyleを設定
                        $("#"+_settings.contentsWrapperId.substr(1)+"_overlay").css({
                            position:           "absolute",
                            "z-index":          _settings.zIndex,
                            top:                0,
                            left:               0,
                            width:              "100%",
                            height:             ( $(_settings.contentsWrapperId).height() <= $(window).height() ) ? $(window).height()+"px" : $(_settings.contentsWrapperId).height()+"px",
                            "background-color": _settings.overlayBgColor,
                            opacity:            _settings.overlayOpacity
                        })
                        .fadeIn(_settings.duration);  // fadeIn

                        var windowScrollTop = $(window).scrollTop();    //ウインドウのスクロールトップ値

                        // サイドメニューとオーバーレイの上端をウインドウの上端にする
                        $("#"+_settings.contentsWrapperId.substr(1)+"_overlay").css("top", windowScrollTop+"px"); // オーバーレイ
                        $("#"+newId).css("top", windowScrollTop+"px");  // サイドメニュー

                    } else {    //サイドメニュー閉じたとき
                        // ドキュメントスクロール許可
                        $("body").css("overflow", "visible");

                        $("#"+_settings.contentsWrapperId.substr(1)+"_overlay")
                        .fadeOut(_settings.duration, function () {    // fadeOut
                            $(this).remove();   //削除
                        });
                    }

                    // ページラッパーをアニメーション
                    var transformValue,
                    pageWrapperSlidePx = (toggleOnFlag) ? ("0px"): ($("#"+newId).width()+"px");

                    if ( $.has3d() ) {    //3D系対応なら
                        if ( _settings.enable3d ) {   //3dオプション trueなら

                            transformValue
                            = (toggleOnFlag)
                            ? "translateX(0px) rotateX(0deg) rotateY(0deg)"
                            : "translateX("+pageWrapperSlidePx+") rotateX("+_settings.rotateX+") rotateY("+_settings.rotateY+")";

                            // 3Dプロパティを適用
                            $(_settings.contentsWrapperId).parent()[0].style[$.changeCss3PropToJsRef("perspective")] = _settings.perspective;
                            $(_settings.contentsWrapperId)[0].style[$.changeCss3PropToJsRef("transform-style")]      = "preserve-3d";
                            $(_settings.contentsWrapperId)[0].style[$.changeCss3PropToJsRef("transform-origin")]     = _settings.transformOrigin;
                            
                        } else {    //3dオプション falseなら
                            transformValue = "translateX("+pageWrapperSlidePx+")";
                        }

                        // CSS3アニメーション
                        $(_settings.contentsWrapperId)[0].style[transformProp]    = transformValue;
                        $(_settings.contentsWrapperId)[0].style[transitionProp]   = $.vendorPrefix()+"transform"+" "+_settings.duration+"ms"+" "+_settings.delay+"ms"+" "+_settings.easing;
                    } else {    //3D未対応なら
                        //jQueryアニメーション
                        $(_settings.contentsWrapperId).animate(
                        {
                            left: pageWrapperSlidePx
                        },
                        {
                            duration: _settings.duration,
                            delay:    _settings.delay,
                            easing:   _settings.easing
                        });
                    }

                    // サイドメニューをアニメーション
                    var sideMenuSlidePx = (toggleOnFlag) ? (parseInt($("#"+newId).css("left"), 10)+"px"): (-parseInt($("#"+newId).css("left"), 10)+"px");

                    // コールバック関数
                    var callbackFunc = ( !toggleOnFlag ) ? _settings.func_open : _settings.func_close;

                    if ( $.has3d() ) {    //3D系対応なら
                        // コールバックを削除 & 実行
                        var _handle = function () {
                            // コールバックを削除
                            $("#"+newId).off( "webkitTransitionEnd", _handle );
                            $("#"+newId).off(    "MozTransitionEnd", _handle );
                            $("#"+newId).off(    "mozTransitionEnd", _handle );
                            $("#"+newId).off(     "msTransitionEnd", _handle );
                            $("#"+newId).off(      "oTransitionEnd", _handle );
                            $("#"+newId).off(       "transitionEnd", _handle );
                            $("#"+newId).off(       "transitionend", _handle );
                            // コールバックを実行
                            ( typeof callbackFunc === "function" ) && callbackFunc();
                        };
                        // コールバックを登録
                        $("#"+newId).on( "webkitTransitionEnd", _handle );
                        $("#"+newId).on(    "MozTransitionEnd", _handle );
                        $("#"+newId).on(    "mozTransitionEnd", _handle );
                        $("#"+newId).on(     "msTransitionEnd", _handle );
                        $("#"+newId).on(      "oTransitionEnd", _handle );
                        $("#"+newId).on(       "transitionEnd", _handle );
                        $("#"+newId).on(       "transitionend", _handle );
                        
                        // CSS3アニメーション
                        $("#"+newId)[0].style[transformProp]    = "translateX("+sideMenuSlidePx+")";
                        $("#"+newId)[0].style[transitionProp]   = $.vendorPrefix()+"transform"+" "+_settings.duration+"ms"+" "+_settings.delay+"ms"+" "+_settings.easing;
                    } else {    //3D未対応なら
                        //jQueryアニメーション
                        $("#"+newId).animate(
                        {
                            left: (toggleOnFlag) ? (-$("#"+newId).width()+"px"): "0px"
                        },
                        {
                            duration: _settings.duration,
                            delay:    _settings.delay,
                            easing:   _settings.easing,
                            complete: function () { ( typeof callbackFunc === "function" ) && callbackFunc(); }
                        });
                    }

                    toggleOnFlag = (toggleOnFlag) ? false: true;

                    if ( toggleOnFlag ) {   //サイドメニューを開いたとき
                        if ( $.hasTouch() ) {   //タッチデバイスなら
                            // ドキュメントスクロール禁止
                            $("#"+_settings.contentsWrapperId.substr(1)+"_overlay").one( "touchmove.noScroll_overlay", function (e) {
                                e.preventDefault();
                            });
                        }

                        // ページラッパー領域をクリック時にサイドメニューを閉じるイベントを設定
                        $("#"+_settings.contentsWrapperId.substr(1)+"_overlay").one( $.clickEvt(), toggleSideMenu );
                    }
                }

                // メイン
                $(window).one( "load", monitoringWindow );    // ウインドウ読み込み監視
                $(window).on( $.resizeEvt(), monitoringWindow );    // ウインドウリサイズ監視

                $(_settings.toggleElementId).on( $.clickEvt(), toggleSideMenu );    // トグルボタンのイベントハンドラ
            }
        }
    };

    $.fn.responsiveSideMenu = function (options) {
        return $._callMethods( responsiveSideMenu, options, this );
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
    var transition = {};

    transition.methods = {
        init: function (options) {
            if ( !$.hasTransition() ) {
                $.error("transitionプロパティが未対応です");
                return this;
            }

            var _settings = $.extend({
                property:           "",
                duration:           500,
                "timing-function":  "ease",
                delay:              0,
                complete:           function () {}
            }, options);

            return this.each(function () {
                _transition(this);
            });

            function _transition(that) {
                that.style[$.changeCss3PropToJsRef("transition")] = "";

                that.style[$.changeCss3PropToJsRef("transition-property")]          = _settings.property;
                that.style[$.changeCss3PropToJsRef("transition-duration")]          = _settings.duration+"ms";
                that.style[$.changeCss3PropToJsRef("transition-timing-function")]   = _settings["timing-function"];
                that.style[$.changeCss3PropToJsRef("transition-delay")]             = _settings.delay+"ms";
                
                // completeリスナー削除 & 実行
                var __handle = function () {
                    //削除
                    $(that).off(".transitionEnd");
                    
                    //実行
                    that.style[$.changeCss3PropToJsRef("transition")] = "";
                    _settings.complete.apply(that);
                };
                
                //リスナー登録
                $(that).on("webkitTransitionEnd.transitionEnd", __handle);
                $(that).on("MozTransitionEnd.transitionEnd", __handle);
                $(that).on("mozTransitionEnd.transitionEnd", __handle);
                $(that).on("msTransitionEnd.transitionEnd", __handle);
                $(that).on("oTransitionEnd.transitionEnd", __handle);
                $(that).on("transitionEnd.transitionEnd", __handle);
                $(that).on("transitionend.transitionEnd", __handle);
            }
        }
    };

    $.fn.transition = function (options) {
        return $._callMethods( transition, options, this );
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
                            _settings.onCallback.apply(this);
                        });
                    })(that);

                    (function (me) {
                        var initPath = me.src;
                        $(me).on(outEvt+".rollOverImg", function () {
                            this.src = initPath
                            _settings.offCallback.apply(this);
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
        return $._callMethods( rollOverImg, options, this );
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
     * #画像の遅延ロード
     *
     * $("img").lazyLoad({
     *     eventType:          "scroll",                //発火させるためのイベント
     *     interval:           500,                     //eventTypeがload時のロード間隔
     *     delay:              500,                     //eventTypeがload時と、scrollで要素がウインドウ内にある要素の発火するまでのディレイ
     *     effect:             "fadeIn",                //ロード時のエフェクトタイプ
     *     effectDuration:     500,                     //エフェクトにかける時間
     *     easing:             "linear",                //イージングタイプ
     *     effectCallBack:     function () {},          //エフェクト後に実行するコールバック
     *     useLoadingImage:    true,                    //ローティングイメージの表示・非表示
     *     loadingImageSrc:    "loadingImage.gif",      //ローディングイメージのソース(パスかbase64形式で指定)
     *     notLazySelecter:    ".notLazy",              //対象外の要素を含むセレクターを指定
     *     dataAttrName:       "data-src",              //遅延ロードさせる画像のパスを指定しておくためのdata属性の名前を指定
     *     oneComplete:        function () {},          //ロード完了毎に実行するコールバック
     *     complete:           function () {}           //すべてのロードが完了後に実行するコールバック
     * });
     * 
     * #設定したイベントをアンバインド
     * $("img").lazyLoad("destroy");
     * 
     * @param  {Object} option 上記オプションオブジェクト
     * @return {Object}        jQueryObject
     */
    var lazyLoad = {};

    lazyLoad.methods = {
        init: function (options) {
            var _settings = $.extend({
                eventType:          "scroll",       //発火させるためのイベント
                interval:           500,            //eventTypeがload時のロード間隔
                delay:              100,            //eventTypeがload時と、scrollで要素がウインドウ内にある要素の発火するまでのディレイ
                effect:             "fadeIn",       //ロード時のエフェクトタイプ
                effectDuration:     500,            //エフェクトにかける時間
                easing:             "linear",       //イージングタイプ
                effectCallBack:     function () {}, //エフェクト後に実行するコールバック
                useLoadingImage:    true,           //ローティングイメージの表示・非表示
                loadingImageSrc:    loadingImage,   //ローディングイメージのソース(パスかbase64形式で指定)
                //useCss3Animation:   "auto",         //エフェクトにCSS3アニメーションを使用 or 使用しない or 自動（true or false or "auto"）で指定
                notLazySelecter:    ".notLazy",     //対象外の要素を含むセレクターを指定
                dataAttrName:       "data-src",     //遅延ロードさせる画像のパスを指定しておくためのdata属性の名前を指定
                oneComplete:        function () {}, //ロード完了毎に実行するコールバック
                complete:           function () {}  //すべてのロードが完了後に実行するコールバック
            }, options);

            var
                self        = this,
                interval    = 0;

            //指定されたイベントがscrollなら、
            if ( _settings.eventType === "scroll" ) {
                return this.each(function (idx) {
                    var preloadImageArr = [];
                    preloadImageArr[0] = $(this).attr(_settings.dataAttrName);

                    var that = this;

                    // 対象外の要素があれば画像表示
                    if ($(this).parents(_settings.notLazySelecter)[0]) {
                        $.preloadImages( preloadImageArr, function () {
                            that.src = preloadImageArr[0];
                        });
                    }

                    // メイン処理
                    if ( $(window).height() >= $(that).offset().top ) { //最初から要素の上部が、window内にある場合、
                        $(window).on("load.lazyLoad_beforeScroll", function () {
                            setTimeout(function () { _lazy(that, idx); }, _settings.delay);
                        });
                    } else {
                        $(window).on("scroll.lazyLoad", function () {   //windowスクロール時
                            var
                                scrollTop = $(window).scrollTop(),
                                bottomTop = scrollTop + $(window).height();

                            if ( bottomTop >= $(that).offset().top ) {  //window下が要素の上部にきたら、
                                if ( !$(that).parents(_settings.notLazySelecter)[0] ) {   //指定した例外要素を除いて、
                                    // ロード中のクラスがなければ、
                                    (!$(that).attr("class").match(/wo-lazyLoading/))
                                    &&
                                    // ローディングイメージ表示
                                    (
                                        (_settings.useLoadingImage)
                                        // &&
                                        // ($(that).wrap($('<div style="position:relative; width:100%; height:26px;">')))
                                        &&
                                        ($(that).css({width:"26px", height:"26px", position:"absolute", top:0, left:Math.floor($(that).width()/2-13)+"px"}))
                                        &&
                                        (that.src = _settings.loadingImageSrc)
                                    )
                                    &&
                                    // ロード中のクラス付与
                                    $(that).addClass("wo-lazyLoading");

                                    // ロード完了のクラスがなければ、
                                    (!$(that).attr("class").match(/wo-lazyLoaded/))
                                    &&
                                    // 画像をロード
                                    $.preloadImages( preloadImageArr, function () {
                                        // 画像を非表示
                                        $(that).hide();

                                        // ロード完了後に画像を差し替え
                                        that.src = preloadImageArr[0];

                                        // ローディングイメージ表示時に設定したスタイルをリセット
                                        $(that).css({
                                            width:      "",
                                            height:     "",
                                            position:   "",
                                            top:        "",
                                            left:       ""
                                        });

                                        // ローディングイメージ表示時にラップしたdivを削除
                                        // $(that).unwrap();

                                        // 画像を表示
                                        $(that)[_settings.effect](_settings.effectDuration, _settings.easing, function () { _settings.effectCallBack.apply(that); });

                                        // ロード完了のクラスを付与
                                        $(that).addClass("wo-lazyLoaded");

                                        // ロード完了毎に実行するコールバック
                                        _settings.oneComplete.apply(that);

                                        // すべてのロードが完了後に実行するコールバック
                                        if ( idx >= self.length-1 ) {
                                            _settings.complete.apply(self);
                                            $(window).off(".lazyLoad");
                                        }
                                    });
                                }
                            }
                        });
                    }
                });
            } else {
                //指定イベントがscroll以外の場合
                return this.each(function (idx) {
                    var
                        that = this,
                        preloadImageArr = [];

                    preloadImageArr[0] = $(that).attr(_settings.dataAttrName);

                    //対象外の要素の処理
                    if ( $(that).parents(_settings.notLazySelecter)[0] ) {
                        $.preloadImages(preloadImageArr, preloadCallBack);
                        function preloadCallBack() {
                            that.src = $(that).attr(_settings.dataAttrName);
                        }
                    }

                    $(window).on(_settings.eventType+".lazyLoad", function () {
                        setTimeout(function () { _lazy(that, idx); }, interval);
                        interval += _settings.interval;
                    });
                });
            }

            function _lazy(that, idx) {
                //対象外の要素を除いた要素の処理
                if ( !$(that).parents(_settings.notLazySelecter)[0] ) {
                    // ロード中のクラスがなければ、
                    (!$(that).attr("class").match(/wo-lazyLoading/))
                    &&
                    (
                        // ローディングイメージを表示
                        (_settings.useLoadingImage)
                        // &&
                        // ($(that).wrap($('<div style="position:relative; width:100%; height:26px;">')))
                        &&
                        ($(that).css({width:"26px", height:"26px", position:"absolute", top:0, left:Math.floor($(that).width()/2-13)+"px"}))
                        &&
                        (that.src = _settings.loadingImageSrc)
                    )
                    &&
                    // ロード中のクラス付与
                    $(that).addClass("wo-lazyLoading");

                    var preloadImageArr = [];
                    preloadImageArr[0] = $(that).attr(_settings.dataAttrName);

                    // プリロード後に実行する関数
                    var oneCompleteCallback = function () {
                        // 画像を非表示
                        $(that).hide();

                        // 画像を置換
                        that.src = preloadImageArr[0];

                        // ローディングイメージ表示時に設定したスタイルをリセット
                        $(that).css({
                            width:      "",
                            height:     "",
                            position:   "",
                            top:        "",
                            left:       ""
                        });

                        // ローディングイメージ表示時にラップしたdivを削除
                        // $(that).unwrap();

                        // 画像を表示
                        $(that)[_settings.effect](_settings.effectDuration, _settings.easing, function () { _settings.effectCallBack.apply(that); });

                        // ロード完了のクラスを付与
                        $(that).addClass("wo-lazyLoaded");

                        // ロード完了毎に実行するコールバック
                        _settings.oneComplete.apply(that);

                        // すべてのロードが完了後に実行するコールバック
                        if ( idx >= self.length-1 ) {
                            _settings.complete.apply(self);
                            $(window).off(".lazyLoad");
                            $(window).off(".lazyLoad_beforeScroll");
                        }
                    };
                    
                    // ロード完了のクラスがなければ、
                    (!$(that).attr("class").match(/wo-lazyLoaded/))
                    &&
                    setTimeout(function () { $.preloadImages(preloadImageArr, oneCompleteCallback); }, _settings.delay);
                }
            }
        },

        destroy: function (options) {
            return this.each(function () {
                $(window).off(".lazyLoad");
                $(window).off(".lazyLoad_beforeScroll");
            });
        }
    };

    $.fn.lazyLoad = function (options) {
        return $._callMethods( lazyLoad, options, this );
    };

    /**
     * #立方体を生成
     *
     * <div class="cube">
     *      <div class="panel back-panel">後</div>
     *      <div class="panel front-panel">前</div>
     *      <div class="panel bottom-panel">下</div>
     *      <div class="panel top-panel">上</div>
     *      <div class="panel left-panel">左</div>
     *      <div class="panel right-panel">右</div>
     *  </div>
     * 
     * $(".cube").createCube({
     *     backPanel:          ".back-panel",
     *     frontPanel:         ".front-panel",
     *     bottomPanel:        ".bottom-panel",
     *     topPanel:           ".top-panel",
     *     leftPanel:          ".left-panel",
     *     rightPanel:         ".right-panel",
     *     perspective:        "800px",
     *     perspectiveOrigin:  "50% 50%",
     *     width:              "200px",
     *     height:             "200px",
     *     top:                "160px",
     *     backfaceVisibility: "visible",
     *     angleOfCube:        "rotateY(45deg)",
     *     duration:            500,
     *     responsive:         false,
     *     callback:           function () {}
     * });
     * 
     * @param  {Object} option 上記オプションオブジェクト
     * @return {Object}        jQueryObject
     */
    var createCube = {};

    createCube.methods = {

        init: function (options) {
            var _settings = $.extend({
                backPanel:          ".back-panel",
                frontPanel:         ".front-panel",
                bottomPanel:        ".bottom-panel",
                topPanel:           ".top-panel",
                leftPanel:          ".left-panel",
                rightPanel:         ".right-panel",
                perspective:        "800px",
                perspectiveOrigin:  "50% 50%",
                width:              "200px",
                height:             "200px",
                top:                "160px",
                backfaceVisibility: "visible",
                angleOfCube:        "rotateY(45deg)",
                duration:           500,
                delay:              0,
                timingFunction:     "ease",
                responsive:         false,
                callback:           function () {}
            }, options);

            this.hide();

            return this.each(function () {
                _createCube(this);
            });

            function _createCube(that) {
                var $panelElems = $(that).children();
                var cubeElem = that;
                var cubeInnerElem = $(that).wrap("<div>").parent()[0];
                var cubeWrapperElem = $(cubeInnerElem).wrap("<div>").parent()[0];

                function setParams() {
                    if (_settings.responsive) {
                        _settings.perspective = ( $(window).width() <= $(window).height() ) ? $(window).width()/2+"px" : $(window).height()/2+"px";
                        _settings.width = ( $(window).width() <= $(window).height() ) ? $(window).width()+"px" : $(window).height()+"px";
                        _settings.height = ( $(window).width() <= $(window).height() ) ? $(window).width()+"px" : $(window).height()+"px";
                    }

                    cubeWrapperElem.style["width"] = "100%";
                    cubeWrapperElem.style[$.changeCss3PropToJsRef("perspective")] = _settings.perspective;
                    cubeWrapperElem.style[$.changeCss3PropToJsRef("perspective-origin")] = _settings.perspectiveOrigin;

                    cubeInnerElem.style["width"] = "100%";
                    cubeInnerElem.style[$.changeCss3PropToJsRef("transform-style")] = "preserve-3d";
                    
                    cubeElem.style["margin"] = "0 auto";
                    cubeElem.style["position"] = "relative";
                    cubeElem.style["top"] = _settings.top;
                    cubeElem.style["width"] = _settings.width;
                    cubeElem.style["height"] = _settings.height;
                    cubeElem.style[$.changeCss3PropToJsRef("transform-style")] = "preserve-3d";

                    $panelElems.each(function (idx) {
                        $(this).css({
                            height:     _settings.height,
                            width:      _settings.width,
                            position:   "absolute"
                        });

                        this.style[$.changeCss3PropToJsRef("backface-visibility")] = _settings.backfaceVisibility;
                    });

                    var floor = Math.floor;

                    $(_settings.frontPanel)[0].style[$.changeCss3PropToJsRef("transform")] = "translateZ("+floor(parseInt(_settings.width, 10)/2)+"px)";
                    $(_settings.backPanel)[0].style[$.changeCss3PropToJsRef("transform")] = "rotateY(180deg) translateZ("+floor(parseInt(_settings.width, 10)/2)+"px)";
                    $(_settings.leftPanel)[0].style[$.changeCss3PropToJsRef("transform")] = "rotateY(-90deg) translateZ("+floor(parseInt(_settings.width, 10)/2)+"px)";
                    $(_settings.rightPanel)[0].style[$.changeCss3PropToJsRef("transform")] = "rotateY(90deg) translateZ("+floor(parseInt(_settings.width, 10)/2)+"px)";
                    $(_settings.topPanel)[0].style[$.changeCss3PropToJsRef("transform")] = "rotateX(90deg) translateZ("+floor(parseInt(_settings.height, 10)/2)+"px)";
                    $(_settings.bottomPanel)[0].style[$.changeCss3PropToJsRef("transform")] = "rotateX(-90deg) translateZ("+floor(parseInt(_settings.height, 10)/2)+"px)";
                }

                function init() {
                    setParams();

                    (_settings.responsive)
                    &&
                    $(window).on($.resizeEvt()+".createCube", setParams);

                    $(cubeElem).fadeIn();
                    cubeElem.style[$.changeCss3PropToJsRef("transform")] = _settings.angleOfCube;
                    $(cubeElem).transition({
                        property:           $.vendorPrefix() + "transform",
                        duration:           _settings.duration,
                        delay:              _settings.delay,
                        "timing-function":  _settings.timingFunction
                    });

                    _settings.callback.call(cubeElem);
                }

                init();
            }
        }
    };

    $.fn.createCube = function (options) {
        return $._callMethods( createCube, options, this );
    };

    var createRoom = {};

    createRoom.methods = {

        init: function (options) {

            return this.each(function () {
                _createRoom(this);
            });

            function _createRoom(that) {
                var cubeElem = that;

                function fixPanels(params) {
                    var
                        initRotateY_def = parseInt(params.initRotateY, 10),
                        initRotateX_def = parseInt(params.initRotateX, 10),
                        initTranslateZ = params.initTranslateZ,
                        $backPanel = $(params.backPanel),
                        $frontPanel = $(params.frontPanel),
                        $bottomPanel = $(params.bottomPanel),
                        $topPanel = $(params.topPanel),
                        $leftPanel = $(params.leftPanel),
                        $rightPanel = $(params.rightPanel),
                        $toLeftButton = $(params.toLeftButton),
                        $toRightButton = $(params.toRightButton),
                        responsive = params.responsive;
                        draggable = params.draggable;

                    var that = {
                        init: function () {
                            if (responsive) {
                                initTranslateZ = ( $(window).width() <= $(window).height() ) ? $(window).width()/2+1+"px" : $(window).height()/2+1+"px";
                            }

                            // cubeElem.style[$.changeCss3PropToJsRef("transform")] = "translateZ(5px)";
                            
                            $frontPanel[0].style[$.changeCss3PropToJsRef("transform")] = "rotateY(180deg) translateZ(" + -parseInt(initTranslateZ, 10)+"px" + ")";
                            $backPanel[0].style[$.changeCss3PropToJsRef("transform")] = "rotateY(0deg) translateZ(" + -parseInt(initTranslateZ, 10)+"px" + ")";

                            $topPanel[0].style[$.changeCss3PropToJsRef("transform")] = "rotateX(-90deg) translateZ(" + -parseInt(initTranslateZ, 10)+"px" + ")";
                            $bottomPanel[0].style[$.changeCss3PropToJsRef("transform")] = "rotateX(90deg) translateZ(" + -parseInt(initTranslateZ, 10)+"px" + ")";

                            $leftPanel[0].style[$.changeCss3PropToJsRef("transform")] = "rotateY(90deg) translateZ(" + -parseInt(initTranslateZ, 10)+"px" + ")";
                            $rightPanel[0].style[$.changeCss3PropToJsRef("transform")] = "rotateY(-90deg) translateZ(" + -parseInt(initTranslateZ, 10)+"px" + ")";
                        },

                        control: function () {
                            (draggable) && canDraggable();

                            $toLeftButton.on($.clickEvt()+".createRoom", function () { handler("left") });
                            $toRightButton.on($.clickEvt()+".createRoom", function () { handler("right") });

                            var cubeElemCurrentProp = cubeElem.style[$.changeCss3PropToJsRef("transform")];
                            var rotateValue = 90, rotateValueFlag = false;

                            function handler(leftOrRight) {
                                var transitionOptions = {
                                    property:           $.vendorPrefix()+"transform",
                                    complete:           function () {
                                        if (draggable) {
                                            $(document).off(".createRoom_draggable");
                                            canDraggable();
                                        }
                                        // cubeElem.style[$.changeCss3PropToJsRef("transform")] = "translateZ("+Math.floor($(window).width()/2)+"px)";
                                        // $(cubeElem).transition(transitionOptions);
                                    }
                                };

                                (!rotateValueFlag)
                                ? (leftOrRight==="left") ? (rotateValue = 90) : (rotateValue = -90)
                                : (leftOrRight==="left") ? (rotateValue += 90) : (rotateValue -= 90);

                                cubeElem.style[$.changeCss3PropToJsRef("transform")] = "rotateY("+rotateValue+"deg)";
                                $(cubeElem).transition(transitionOptions);

                                rotateValueFlag = true;
                            }

                            function canDraggable() {
                                var
                                    initRotateY = initRotateY_def,
                                    initRotateX = initRotateX_def;

                                var
                                    dragging = false,
                                    x, y,
                                    dx, dy,
                                    value_rotateX,
                                    value_rotateY,
                                    old_x = initRotateX,
                                    old_y = initRotateY;
                            
                                //タッチ or マウスダウン
                                $(document).on($.startEvt()+".createRoom_draggable", function (e) {
                                    var e = e.originalEvent;

                                    if ( $.hasTouch() ) {
                                        x = e.touches[0].clientX - e.target.offsetLeft;
                                        y = e.touches[0].clientY - e.target.offsetTop;
                                    } else {
                                        x = e.clientX - e.target.offsetLeft;
                                        y = e.clientY - e.target.offsetTop;
                                    }
                                    
                                    dragging = true;
                                    
                                    e.preventDefault();
                                    
                                    $(document).on($.moveEvt()+".createRoom_moveEvt", moveEvt);
                                });
                                
                                //タッチエンド or ドラッグエンド
                                $(document).on($.endEvt()+".createRoom_draggable", function (e) {
                                    var e = e.originalEvent;

                                    if ( dragging ) {
                                        dragging = false;
                                        
                                        //以前の状態を保存
                                        old_x = value_rotateX;
                                        old_y = value_rotateY;
                                        
                                        $(document).off(".createRoom_moveEvt");
                                    }
                                });
                                
                                //タッチ中 or ドラッグ中
                                function moveEvt(e) {
                                    var e = e.originalEvent;

                                    if ( dragging ) {
                                        if ( $.hasTouch() ) {
                                            dx = e.touches[0].clientX - x;
                                            dy = e.touches[0].clientY - y;
                                        } else {
                                            dx = e.clientX - x;
                                            dy = e.clientY - y;
                                        }
                                        
                                        value_rotateX = (dy*100/360) + old_x;
                                        value_rotateY = (dx*100/360) + old_y;
                                        
                                        $(cubeElem).transition({
                                            property:           $.vendorPrefix()+"transform",
                                            duration:           50,
                                            "timing-function":  "linear",
                                            delay:              0,
                                            complete:           function () {}
                                        });
                                        
                                        
                                        cubeElem.style[$.changeCss3PropToJsRef("transform")]
                                        =
                                        "rotateX(" + value_rotateX + "deg) " +
                                        "rotateY(" + value_rotateY + "deg) ";
                                        
                                        e.preventDefault();
                                    }
                                }
                            }
                        }
                    };

                    return that;
                }

                function init() {
                    var _settings = $.extend({
                        initRotateY:        "0deg",
                        initRotateX:        "0deg",
                        initTranslateZ:     Math.floor($(window).width()/2)+1+"px",
                        backPanel:          ".back-panel",
                        frontPanel:         ".front-panel",
                        bottomPanel:        ".bottom-panel",
                        topPanel:           ".top-panel",
                        leftPanel:          ".left-panel",
                        rightPanel:         ".right-panel",
                        responsive:         true,
                        draggable:          true,
                        toLeftButton:       ".toLeftButton",
                        toRightButton:      ".toRightButton"
                    }, options);

                    var that = fixPanels(_settings);

                    that.init();
                    that.control();

                    (_settings.responsive)
                    &&
                    $(window).on($.resizeEvt()+".createRoom", that.init);
                }

                init();
            }
        }
    };

    $.fn.createRoom = function (options) {
        return $._callMethods( createRoom, options, this );
    };

})(jQuery);
