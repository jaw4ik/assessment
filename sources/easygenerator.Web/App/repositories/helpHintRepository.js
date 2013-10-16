define(['dataContext', 'httpWrapper', 'guard'],
    function (dataContext, httpWrapper, guard) {

        var
            getCollection = function () {
                return Q.fcall(function() {
                    return dataContext.helpHints;
                });
            },

            hideHint = function (hintId) {
                return Q.fcall(function () {
                    guard.throwIfNotString(hintId, 'Hint id is not a string');

                    var data = {
                        hintId: hintId
                    };

                    return httpWrapper.post('api/helpHint/hide', data).then(function () {
                        dataContext.helpHints = _.reject(dataContext.helpHints, function (item) {
                            return item.id === hintId;
                        });
                    });
                });
            },
            
            showHint = function (hintKey) {
                return Q.fcall(function () {
                    guard.throwIfNotString(hintKey, 'Hint key is not a string');

                    var data = {
                        hintKey: hintKey
                    };

                    return httpWrapper.post('api/helpHint/show', data).then(function (response) {
                        guard.throwIfNotString(response.Id, 'Response does not have Id string');
                        guard.throwIfNotString(response.Name, 'Response does not have Name string');

                        var newHint = {
                            id: response.Id,
                            name: response.Name,
                            localizationKey: response.Name + 'HelpHint'
                        };
                        
                        dataContext.helpHints.push(newHint);

                        return newHint;
                    });
                });
            };

        return {
            getCollection: getCollection,

            hideHint: hideHint,
            showHint: showHint
        };
    });