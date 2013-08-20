define(['xAPI/settings', 'xAPI/errorsHandler', 'xAPI/verbs', 'xAPI/base64', 'events'],
    function (settings, errorsHandler, verbs, base64, events) {

        var
            actorData = {},
            activity = {},

            init = function (tracker, actorName, actorMail, activityName, activityUrl, activityLanguage) {

                if (typeof tracker === "undefined" || _.isNull(tracker))
                    return;

                actorData = {
                    name: actorName,
                    mbox: actorMail
                };

                activity = {
                    name: activityName,
                    url: activityUrl,
                    language: activityLanguage
                };

                if (_.isFunction(tracker.courseStarted))
                    tracker.addListener(events.courseStarted, function () {
                        trackAction(verbs.started);
                    });

                if (_.isFunction(tracker.courseStopped))
                    tracker.addListener(events.courseStopped, function () {
                        trackAction(verbs.stopped);
                    });

                if (_.isFunction(tracker.courseFinished))
                    tracker.addListener(events.courseFinished, function (score) {
                        if (typeof score === "undefined" ||
                            typeof settings === "undefined" ||
                            _.isUndefined(settings.scoresDistribution.minScoreForPositiveResult) ||
                            _.isUndefined(settings.scoresDistribution.positiveVerb)) {

                            errorsHandler.handleError(errorsHandler.errors.notEnoughDataInSettings);
                            return;
                        }

                        if (score >= settings.scoresDistribution.minScoreForPositiveResult)
                            trackAction(settings.scoresDistribution.positiveVerb, score);
                        else
                            trackAction(verbs.failed, score);
                    });

            },

            trackAction = function (verb, result, actor, activityName, activityUrl, activityLanguage) {

                var statement = buildStatement(verb, result, actor, activityName, activityUrl, activityLanguage);

                sendRequest(statement);
            },

            buildStatement = function (verb, result, actor, activityName, activityUrl, activityLanguage) {
                
                if (typeof verb === "undefined" || !_.isObject(verb) || _.isUndefined(verb.id) || _.isUndefined(verb.display)) {
                    errorsHandler.handleError(errorsHandler.errors.verbIsIncorrect);
                    return;
                }

                if (typeof result !== "undefined" && !_.isObject(result)) {
                    result = {
                        score: {
                            scaled: result
                        }
                    };
                }

                if (typeof activityName === "undefined")
                    activityName = activity.name;

                if (typeof activityUrl === "undefined") {
                    if (typeof activity.url !== "undefined")
                        activityUrl = activity.url;
                    else if (window && window.location)
                        activityUrl = window.location.toString();
                }

                if (typeof activityLanguage === "undefined") {
                    if (typeof activity.language !== "undefined")
                        activityLanguage = activity.language;
                    else
                        activityLanguage = settings.defaultLanguage;
                }

                if (typeof actor === "undefined") {
                    if (typeof actorData !== "undefined")
                        actor = actorData;
                    else
                        errorsHandler.handleError(errorsHandler.errors.actorDataIsIncorrect);
                }

                if (_.isUndefined(actor.mbox) || _.isEmpty(actor.mbox)) {
                    errorsHandler.handleError(errorsHandler.errors.actorDataIsIncorrect);
                    return;
                }

                if (actor.mbox.substring(0, 7) != "mailto:")
                    actor.mbox = "mailto:" + actor.mbox;

                if (_.isUndefined(actor.objectType))
                    actor.objectType = "Agent";

                var name = {};
                name[activityLanguage] = activityName;

                var object = {
                    id: activityUrl,
                    definition: {
                        name: name
                    }
                };

                var statement = {
                    id: ruuid(),
                    actor: actor,
                    verb: verb,
                    object: object,
                    result: result
                };

                return statement;
            },

            sendRequest = function (statement) {

                var options = buildRequestOptions(statement);

                if (!$.support.cors) {
                    initXDomainRequestTransport();

                    options = getXApiIEModeRequest(options);
                }

                $.ajax(options);
            },

            buildRequestOptions = function (statement) {

                var lrsUrl = settings.LRSUri + 'statements';
                var auth = "Basic " + base64.encode(settings.authenticationCredentials.username + ':' + settings.authenticationCredentials.password);

                var headers = [];
                headers["X-Experience-API-Version"] = settings.xApiVersion;
                headers["Content-Type"] = "application/json";
                headers["Authorization"] = auth;

                var options = {};

                options.url = lrsUrl;
                options.data = JSON.stringify(statement);
                options.type = 'POST';
                options.headers = headers;
                options.timeout = settings.timeout;
                options.contentType = 'application/json';
                options.dataType = 'json';
                options.async = true;

                options.beforeSend = function (xmlHttpRequest) {
                    if (!_.isUndefined(options.headers) && _.isArray(options.headers)) {
                        for (var headerName in options.headers)
                            xmlHttpRequest.setRequestHeader(headerName, options.headers[headerName]);
                    }
                    options.headers = null;
                };

                options.success = function (response) {
                };

                options.error = function (request, textStatus, error) {
                    if (textStatus == "timeout")
                        error = errorsHandler.errors.timeoutError;
                    else
                        switch (request.status) {
                            case 0:
                                error = errorsHandler.errors.invalidEndpoint;
                                break;
                            case 400:
                                if (request.responseText.indexOf("Mbox") !== -1)
                                    error = errorsHandler.errors.invalidEmail;

                                else if (request.responseText.indexOf("URL") !== -1 || request.responseText.indexOf("endpoint") !== -1)
                                    error = errorsHandler.errors.invalidEndpoint;

                                else error = errorsHandler.errors.badRequest + request.responseText;

                                break;
                            case 401:
                                error = errorsHandler.errors.invalidCredentials;
                                break;
                            case 404:
                                error = errorsHandler.errors.notFoundEndpoint;
                                break;
                            default:
                                error = errorsHandler.errors.unhandledMessage + request.statusText;
                                break;
                        }

                    errorsHandler.handleError(error);
                };

                return options;
            },

            getXApiIEModeRequest = function (options) {
                var newUrl = options.url;

                //Everything that was on query string goes into form vars
                var formData = new Array();
                var qsIndex = newUrl.indexOf('?');
                if (qsIndex > 0) {
                    formData.push(newUrl.substr(qsIndex + 1));
                    newUrl = newUrl.substr(0, qsIndex);
                }

                //Method has to go on querystring, and nothing else
                options.url = newUrl + '?method=' + options.type;

                //Headers
                if (!_.isUndefined(options.headers) && _.isArray(options.headers)) {
                    for (var headerName in options.headers)
                        formData.push(
                            headerName + "=" + encodeURIComponent(options.headers[headerName]));
                }

                options.headers = {};

                //The original data is repackaged as "content" form var
                if (!_.isUndefined(options.data)) {
                    formData.push('content=' + encodeURIComponent(options.data));
                }

                options.data = formData.join("&");
                options.type = "POST";

                return options;
            },

            initXDomainRequestTransport = function () {
                if (window.XDomainRequest) {
                    jQuery.ajaxTransport(function (s) {

                        var xdr;

                        return {

                            send: function (headers, complete) {

                                function callback(status, statusText, responses, responseHeaders) {
                                    xdr.onload = xdr.onerror = xdr.ontimeout = jQuery.noop;
                                    xdr = undefined;
                                    complete(status, statusText, responses, responseHeaders);
                                }

                                xdr = new window.XDomainRequest();

                                xdr.onload = function () {
                                    callback(200, "OK", { text: xdr.responseText });
                                };

                                xdr.onerror = function () {
                                    callback(-1, errorsHandler.errors.xDomainRequestError);
                                };

                                if (s.timeout) {
                                    xdr.timeout = s.timeout;
                                    xdr.ontimeout = function () {
                                        callback(-1, errorsHandler.errors.timeoutError);
                                    };
                                }

                                try {
                                    xdr.open(s.type, s.url, true);
                                }
                                catch (e) {
                                    var errorMessage;

                                    if (location.protocol != getProtocol(s.url))
                                        errorMessage = errorsHandler.errors.invalidProtocol;
                                    else
                                        errorMessage = e.message;

                                    callback(-1, errorMessage);
                                    return;
                                }

                                xdr.send((s.hasContent && s.data) || null);
                            },

                            abort: function () {
                                if (xdr) {
                                    xdr.onerror = jQuery.noop();
                                    xdr.abort();
                                }
                            }
                        };

                    });
                }
            },

            getProtocol = function (url) {
                var arr = url.split("/");
                return arr[0];
            },

            ruuid = function () {
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
                    /[xy]/g,
                    function (c) {
                        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                        return v.toString(16);
                    }
                );
            };

        return {
            init: init,
            trackAction: trackAction
        };
    }
);