define(['http/apiHttpWrapper', 'localization/localizationManager', 'uiLocker', 'routing/router', 'mappers/learningPathModelMapper', 'dataContext', 'clientContext', 'constants'],
    function (apiHttpWrapper, localizationManager, uiLocker, router, mapper, dataContext, clientContext, constants) {
        "use strict";

        return {
            execute: function () {
                var title = localizationManager.localize('learningPathDefaultTitle');
                uiLocker.lock();
                return apiHttpWrapper.post('/api/learningpath/create', { title: title })
                    .then(function (entity) {
                        var learningPath = mapper.map(entity);
                        dataContext.learningPaths.push(learningPath);
                        clientContext.set(constants.clientContextKeys.lastCreatedLearningPathId, learningPath.id);
                        uiLocker.unlock();
                        router.navigate('learningpaths/' + learningPath.id);
                    })
                    .fail(function () {
                        uiLocker.unlock();
                    });
            }
        }

    })