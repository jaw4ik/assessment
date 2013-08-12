define([],
    function () {
        var ua = navigator.userAgent.toLowerCase();
        
        var isMobileDevice = (function () {
            if (ua.indexOf("ipod") != -1 ||
                ua.indexOf("iphone") != -1 ||
                ua.indexOf("ipad") != -1 ||
                ua.indexOf("android") != -1)
                return true;
            return false;
        }());

        var isSupportedMobile = (function() {
            if (/iP(hone|od|ad)/.test(navigator.platform)) {
                var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
                if (parseInt(v[1], 10) >= 6)
                    return true;
            }

            //Android is supported but not chrome, opera or firefox
            if (ua.indexOf("android") != -1 && 
                ua.indexOf("chrome") == -1 &&
                ua.indexOf("opera") == -1 &&
                ua.indexOf("firefox") == -1 &&
                ua.indexOf("opr") == -1)
                return true;

            return false;
        }());

        var isSupportedBrowser = (function () {
            // Opera is not supported
            if (navigator.appName.toLowerCase() == "opera" || navigator.userAgent.indexOf("OPR") != -1)
                return false;

            //IE 9+, Chrome 28+, Firefox 22+, Safari 5+ are supported
            var N = navigator.appName, tem,
                M = ua.match(/(chrome|safari|firefox|msie)\/?\s*([\d\.]+)/i) || [];

            M = M[2] ? [M[1], M[2]] : [N, navigator.appVersion, '-?'];
            if (M && (tem = ua.match(/version\/([\.\d]+)/i)) != null) M[2] = tem[1];

            var browser = M[0].toLowerCase();
            var version = parseInt(M[1], 10);

            if (browser == "chrome" && version >= 28 ||
                browser == "msie" && version >= 9 ||
                browser == "firefox" && version >= 22 ||
                browser == "safari" && version >= 533)
                return true;

            return false;
        }());

        if (isMobileDevice) {
            return isSupportedMobile ? 'viewmodels/notsupportedbrowserMobile' : 'viewmodels/shell';
        } else {
            return isSupportedBrowser ? 'viewmodels/shell' : 'viewmodels/notsupportedbrowser';
        }
    });