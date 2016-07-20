(function (context) {
    var messagesPattern = /^#localStorage#(\d+)(null|complete)?#([\S\s]*)/;
    var storageFramesContainer = document.getElementById('crossProtocolStorageFrames');
    var actionDefers = {};

    function generateUniqueIdentifier() {
        return Math.floor(Math.random() * (999999999));
    }

    function doLoadFrame(src, identifier, defer) {
        var frameId = identifier;
        var frame = document.createElement('iframe');
        frame.setAttribute('style', 'display:none;');
        frame.setAttribute('id', frameId);
        frame.setAttribute('src', src);
        storageFramesContainer.appendChild(frame);
        setTimeout(function () {
            doRemoveFrame(identifier);
            doRejectDefer(identifier, defer);
        }, 15000);
    }

    function doRemoveFrame(identifier) {
        var frame = document.getElementById(identifier);
        if (frame) {
            frame.parentNode.removeChild(frame);
        }
    }

    function doRejectDefer(identifier, defer) {
        if (defer && defer.promise.isPending()) {
            defer.reject('cross protocol storage is failed to answer: 15 s timeout is over');
            delete actionDefers[identifier];
        }
    }

    function isFrameAllowed(source) {
        var frames = window.frames;
        for (var i = 0; i < frames.length; i++) {
            if (frames[i] === source) {
                return true;
            }
        }
        return false;
    }

    function listen(event) {
        if (isFrameAllowed(event.source)) {
            var data = messagesPattern.exec(event.data);
            if (data) {
                var identifier = data[1];
                var nullOrCompleteParameter = data[2];
                var value = data[3];
                var defer = actionDefers[identifier];
                if (defer && defer.promise.isPending()) {
                    if (nullOrCompleteParameter === 'complete') {
                        defer.resolve();
                    } else {
                        defer.resolve(nullOrCompleteParameter === 'null' ? null : value);
                    }
                }
                delete actionDefers[identifier];
                doRemoveFrame(identifier);
            }
        }
    }

    function createScr(identifier, data) {
        var src = (window.location.hostname === 'localhost' ? 'http://' : 'https://')
            + window.location.host + '/storageframe#protocol=' + window.location.protocol
            + '&identifier=' + encodeURIComponent(identifier) + '&data=' + encodeURIComponent(JSON.stringify(data));
        return src;
    }

    function doAction(obj) {
        var identifier = generateUniqueIdentifier();
        var defer = Q.defer();
        var src = createScr(identifier, obj);
        actionDefers[identifier] = defer;
        doLoadFrame(src, identifier, defer);
        return defer.promise;
    }

    function setItem(key, value) {
        return doAction({
            setItem: key,
            value: value
        });
    }

    function getItem(key) {
        return doAction({
            getItem: key
        });
    }

    function removeItem(key) {
        return doAction({
            removeItem: key
        });
    }

    window.addEventListener('message', listen);

    context.localStorageProvider = {
        setItem: setItem,
        getItem: getItem,
        removeItem: removeItem
    }

}(window));