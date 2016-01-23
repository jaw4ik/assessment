define(['http/apiHttpWrapper', 'dataContext'],
    function (apiHttpWrapper, dataContext) {
        "use strict";

        return {
            execute: function (learningPathId) {
                return apiHttpWrapper.post('/api/learningpath/delete', { learningPathId: learningPathId })
                .then(function (response) {
                    if (response && response.deletedDocumentIds) {
                        dataContext.documents = _.reject(dataContext.documents, function(item) {
                            return _.contains(response.deletedDocumentIds, item.id);
                        });
                    }
                    dataContext.learningPaths = _.reject(dataContext.learningPaths, function (item) {
                        return item.id === learningPathId;
                    });
                });
            }
        }

    })