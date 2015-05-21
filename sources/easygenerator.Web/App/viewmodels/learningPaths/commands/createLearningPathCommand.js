define(['http/httpWrapper', 'eventTracker', 'localization/localizationManager', 'uiLocker', 'plugins/router', 'mappers/learningpathModelMapper', 'dataContext'],
    function (httpWrapper, eventTracker, localizationManager, uiLocker, router, mapper, dataContext) {
        "use strict";
        var
          events = {
              createLearningPath: 'Create learning path and open its properties'
          };

        return {
            execute: function () {
                eventTracker.publish(events.createLearningPath);
                var title = localizationManager.localize('learningPathDefaultTitle');
                uiLocker.lock();
                return httpWrapper.post('/api/learningpath/create', { title: title })
                    .then(function (entity) {
                        var learningPath = mapper.map(entity);
                        dataContext.learningPaths.push(learningPath);
                        uiLocker.unlock();
                        router.navigate('learningpaths/' + learningPath.id);
                    })
                    .fail(function () {
                        uiLocker.unlock();
                    });
            }
        }

    })