define(['repositories/objectiveRepository', 'durandal/plugins/router', 'eventTracker'],
    function (objectiveRepository, router, eventTracker) {

        var
            events = {
                category: 'Create learning objective',
                createAndNew: "Create learning objective and create new",
                createAndOpen: "Create learning objective and open it properties",
            },

            sendEvent = function (eventName) {
                eventTracker.publish(eventName, events.category);
            };


        var
            title = (function() {
                var t = ko.observable();
                t.minlength = 1;
                t.maxlength = 255;
                t.isValid = ko.computed(function () {
                    var text = t();                    
                    return text && text.length > t.minlength && text.length < t.maxlength;
                });
                return t;
            })(),
            
            showValidation = ko.observable(false),
            
            createAndNew = function () {
                sendEvent(events.createAndNew);
                objectiveRepository.addObjective({ title: ko.unwrap(this.title) })
                    .then(function () {
                        router.navigateTo('#/objective/create');
                    });
            },
            createAndOpen = function () {
                //if (!this.title.isValid()) {
                //    this.showValidation(true);
                //    return;
                //}
                sendEvent(events.createAndOpen);
                objectiveRepository.addObjective({ title: ko.unwrap(this.title) })
                    .then(function (objectiveId) {
                        router.navigateTo('#/objective/' + objectiveId);
                    });
            },

            activate = function () {                
                this.title("");
            };


        return {
            activate: activate,

            title: title,

            showValidation: showValidation,

            createAndNew: createAndNew,
            createAndOpen: createAndOpen
        };
    }
);