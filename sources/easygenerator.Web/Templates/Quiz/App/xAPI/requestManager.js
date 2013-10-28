define(['xAPI/settings', 'xAPI/errorsHandler', 'xAPI/verbs', 'xAPI/base64', 'durandal/app', 'events'],
    function (settings, errorsHandler, verbs, base64, app, events) {

        "use strict";

        var
            actor = {},
            activity = {},

            init = function (actorName, actorMail, activityName, activityUrl, activityLanguage) {

                var hashIndex = activityUrl.indexOf("#/");
                if (hashIndex !== -1)
                    activityUrl = activityUrl.substring(0, hashIndex);

                actor = {
                    name: actorName,
                    mbox: actorMail
                };

                activity = {
                    name: activityName,
                    url: activityUrl,
                    language: activityLanguage
                };

                //add listeners to events
                app.on(events.courseStarted).then(function () {
                    trackAction(verbs.started);
                });

                app.on(events.courseFinished).then(function (data) {
                    Q().then(function () {
                        return trackAction(verbs.stopped);
                    }).then(function () {
                        if (typeof data === "undefined" ||
                        _.isUndefined(data.result) ||
                        typeof settings === "undefined" ||
                        _.isUndefined(settings.scoresDistribution.minScoreForPositiveResult) ||
                        _.isUndefined(settings.scoresDistribution.positiveVerb)) {
                            throw errorsHandler.errors.notEnoughDataInSettings;
                        }

                        if (data.result >= settings.scoresDistribution.minScoreForPositiveResult)
                            return trackAction(settings.scoresDistribution.positiveVerb, data.result);
                        else
                            return trackAction(verbs.failed, data.result);
                    }).then(function () {
                        if (!!data.callback) {
                            data.callback.call(this);
                        }
                    }).fail(function (error) {
                        errorsHandler.handleError(error);
                    });
                });
            },

            trackAction = function (verb, result) {
                var statement = buildStatement(verb, result);
                return sendRequest(statement);
            },

            buildStatement = function (verb, result) {

                if (typeof verb === "undefined" || !_.isObject(verb) || _.isUndefined(verb.id) || _.isUndefined(verb.display)) {
                    errorsHandler.handleError(errorsHandler.errors.verbIsIncorrect);
                    return;
                }

                if (_.isUndefined(actor.mbox) || _.isEmpty(actor.mbox)) {
                    errorsHandler.handleError(errorsHandler.errors.actorDataIsIncorrect);
                    return;
                }

                if (typeof result !== "undefined" && !_.isObject(result)) {

                    var formattedResult = { score: {} };

                    if (result >= 0 && result <= 1)
                        formattedResult.score.scaled = result;
                    else
                        formattedResult.score.raw = result;

                    result = formattedResult;
                }

                if (_.isUndefined(activity.url) && window && window.location)
                    activity.url = window.location.toString();

                if (_.isUndefined(activity.language))
                    activity.language = settings.defaultLanguage;

                if (actor.mbox.substring(0, 7) != "mailto:")
                    actor.mbox = "mailto:" + actor.mbox;

                if (_.isUndefined(actor.objectType))
                    actor.objectType = "Agent";

                var name = {};
                name[activity.language] = activity.name;

                var object = {
                    id: activity.url,
                    definition: {
                        name: name
                    }
                };

                var statement = {
                    id: generateGuid(),
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

                    options = getOptionsForIEMode(options);
                }

                return $.ajax(options);
            },

            buildRequestOptions = function (statement) {

                var lrsUrl = settings.LRS.uri;

                if (lrsUrl.indexOf("/statements") === -1)
                    lrsUrl = lrsUrl + "/statements";

                var auth = "Basic " + base64.encode(settings.LRS.credentials.username + ':' + settings.LRS.credentials.password);

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

            getOptionsForIEMode = function (options) {
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

                                    if (location.protocol != s.url.split("/")[0])
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

            generateGuid = function () {
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