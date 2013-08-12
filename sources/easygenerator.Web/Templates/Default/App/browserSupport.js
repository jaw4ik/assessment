define([],
    function () {

        // check iOS 6+
        if (/iP(hone|od|ad)/.test(navigator.platform)) {
            var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
            if (parseInt(v[1], 10) < 6)
                return false;
        }

        // check Opera 
        if (navigator.appName.toLowerCase() == "opera" || navigator.userAgent.indexOf("OPR") != -1)
            return false;

        //check IE 9+, Chrome 28+, Firefox 22+, Safari 5+
        var ua = navigator.userAgent,
            N = navigator.appName, tem,
            M = ua.match(/(chrome|safari|firefox|msie)\/?\s*([\d\.]+)/i) || [];

        M = M[2] ? [M[1], M[2]] : [N, navigator.appVersion, '-?'];
        if (M && (tem = ua.match(/version\/([\.\d]+)/i)) != null) M[2] = tem[1];

        var browser = M[0].toLowerCase();
        var version = parseInt(M[1], 10);

        if (browser == "chrome" && version < 28 ||
            browser == "msie" && version < 9 ||
            browser == "firefox" && version < 22 ||
            browser == "safari" && version < 533)
            return false;

        return true;

    });