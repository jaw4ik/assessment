define(['dataContext', 'httpWrapper', 'guard'],
    function (dataContext, httpWrapper, guard) {

        var
            getCollection = function () {
                return dataContext.helpHints;
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
            };

        return {
            getCollection: getCollection,

            hideHint: hideHint
        };
    });