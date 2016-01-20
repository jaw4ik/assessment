define(['http/apiHttpWrapper', 'dataContext'],
    function (apiHttpWrapper, dataContext) {
        "use strict";

        return {
            execute: function (learningPathId, entities) {
                return apiHttpWrapper.post('/api/learningpath/entities/order/update', {
                    learningPathId: learningPathId,
                    entities: _.map(entities, function (entity) {
                        return entity.id;
                    })
                })
                .then(function () {
                    var learningPath = _.find(dataContext.learningPaths, function (item) {
                        return item.id === learningPathId;
                    });

                    learningPath.entities = _.map(entities, function (entity) {
                        return _.find(learningPath.entities, function (item) {
                            return item.id === entity.id;
                        });
                    });
                });
            }
        }

    })