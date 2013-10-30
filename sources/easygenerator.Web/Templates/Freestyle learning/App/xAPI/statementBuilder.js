define(['./errorsHandler', './languageMap'],
    function (errorsHandler, LanguageMap) {

        "use strict";

        var
            _buildActor = function (actor) {

                if (_.isNullOrUndefined(actor)) {
                    errorsHandler.handleError("Actor data is incorrect");
                    return;
                }

                if (_.isNullOrUndefined(actor.mbox)) {
                    errorsHandler.handleError("Actor 'mbox' field must not be empty");
                    return;
                }

                if (actor.mbox.substring(0, 7) != "mailto:")
                    actor.mbox = "mailto:" + actor.mbox;

                if (_.isNullOrUndefined(actor.objectType))
                    actor["objectType"] = "Agent";

                return actor;
            },

            _buildVerb = function (verb) {

                if (_.isNullOrUndefined(verb)) {
                    errorsHandler.handleError("Verb data is incorrect");
                    return;
                }

                if (_.isNullOrUndefined(verb.id)) {
                    errorsHandler.handleError("Verb 'id' field must not be empty");
                    return;
                }

                if (_.isNullOrUndefined(verb.display)) {
                    errorsHandler.handleError("Verb 'display' field must not be empty");
                    return;
                }

                return verb;
            },

            _buildObject = function (object) {

                if (_.isNullOrUndefined(object)) {
                    errorsHandler.handleError("Object data is incorrect");
                    return;
                }

                if (_.isNullOrUndefined(object.id)) {
                    if (window && window.location)
                        object.id = window.location.toString();
                    else {
                        errorsHandler.handleError("Object 'id' field must not be empty");
                        return;
                    }
                }

                if (_.isNullOrUndefined(object.definition)) {
                    if (!_.isNullOrUndefined(object.name)) {
                        object["definition"] = { name: new LanguageMap(object.name) };
                        object["name"] = undefined;
                    }
                }

                return object;
            },

            _buildResult = function (result) {

                if (!_.isNullOrUndefined(result) && !_.isObject(result) && _.isNumber(result)) {

                    var formattedResult = { score: {} };

                    if (result >= 0 && result <= 1)
                        formattedResult.score.scaled = result;
                    else
                        formattedResult.score.raw = result;

                    result = formattedResult;
                }

                return result;
            },

            _generateGuid = function () {
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
                    /[xy]/g,
                    function (c) {
                        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                        return v.toString(16);
                    }
                );
            },

            build = function (actor, verb, object, result, context) {

                var statement = {
                    id: _generateGuid(),
                    actor: _buildActor(actor),
                    verb: _buildVerb(verb),
                    object: _buildObject(object),
                    result: _buildResult(result),
                    context: context
                };

                return statement;
            };

        return {
            build: build
        };

    }
);