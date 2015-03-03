(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else {
        root.branding = factory();
    }
}(this, function () {
    var html =
        '<a class="branding" href="http://www.easygenerator.com" target="_blank">' +
            '<span class="branding-logo-text"></span>' +
            '<span class="vertical-align-helper"></span>' +
        '</a>';

    var styles =
        '.branding {' +
            'position: fixed;' +
            'height: 40px;' +
            'left: 0;' +
            'bottom: 0;' +
            'padding: 0 18px;' +
            'background-color: #42515f;' +
            'border-radius: 0 8px 0 0;' +
            'opacity: 0.8;' +
            'cursor: pointer;' +
            'z-index: 9999;' +
        '}' +

        '.branding:hover {' +
            'opacity: 1;' +
        '}' +

        '.branding-logo-text {' +
            'width: 236px;' +
            'height: 16px;' +
            'background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOwAAAAQCAYAAAAVg5N2AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MDA1MTQ1MDVCRTkxMTFFNDg3QTJDM0U5M0FGRjdDQTAiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MDA1MTQ1MDZCRTkxMTFFNDg3QTJDM0U5M0FGRjdDQTAiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDowMDUxNDUwM0JFOTExMUU0ODdBMkMzRTkzQUZGN0NBMCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDowMDUxNDUwNEJFOTExMUU0ODdBMkMzRTkzQUZGN0NBMCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PpYQacUAAAoVSURBVHja7FrNb1vH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");' +
        '}' +

        '.branding-logo-text,' +
        '.vertical-align-helper {' +
            'display: inline-block;' +
            'vertical-align: middle;' +
        '}' +

        '.vertical-align-helper {' +
            'height: 100%;' +
        '}';

    return {
        initialize: function () {
            addStylesToDocument(styles);
            addHtmlContentToDocumentBody(html);
        }
    };

    function addStylesToDocument(cssStyles) {
        var styleNode = document.createElement('style');
        styleNode.type = 'text/css';
        styleNode.appendChild(document.createTextNode(cssStyles));
        document.getElementsByTagName('head')[0].appendChild(styleNode);
    }

    function addHtmlContentToDocumentBody(htmlContent) {
        var htmlNode = document.createElement('div');
        htmlNode.innerHTML = htmlContent;
        document.getElementsByTagName('body')[0].appendChild(htmlNode);
    }

}));