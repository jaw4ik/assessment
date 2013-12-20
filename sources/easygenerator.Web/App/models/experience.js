define(['models/entity', 'durandal/app', 'constants', 'services/deliverService'],
    function (EntityModel, app, constants, deliverService) {

        function Experience(spec) {

            EntityModel.call(this, spec);

            this.title = spec.title;
            this.objectives = spec.objectives;
            this.builtOn = spec.builtOn;
            this.packageUrl = spec.packageUrl;
            this.template = spec.template;
            this.publishedPackageUrl = spec.publishedPackageUrl;
            this.deliveringState = constants.deliveringStates.notStarted;
        };
        
        Experience.prototype.build = function () {
            var that = this;
            var deferred = Q.defer();
            if (that.deliveringState == constants.deliveringStates.building || that.deliveringState == constants.deliveringStates.publishing) {
                deferred.reject('Experience is already building or publishing.');
            }
        
            that.deliveringState = constants.deliveringStates.building;
            app.trigger(constants.messages.experience.build.started, that);
            
            deliverService.buildExperience(that.id).then(function (buildInfo) {
                that.packageUrl = buildInfo.packageUrl;
                that.builtOn = buildInfo.builtOn;
                that.deliveringState = constants.deliveringStates.succeed;
                app.trigger(constants.messages.experience.build.completed, that);
                deferred.resolve(that);
            }).fail(function (message) {
                that.deliveringState = constants.deliveringStates.failed;
                that.packageUrl = '';
                app.trigger(constants.messages.experience.build.failed, that.id, message);
                deferred.reject(message);
            });
            
            return deferred.promise;
        };
        

        Experience.prototype.publish = function () {
            var that = this;
            var deferred = Q.defer();

            if (that.deliveringState == constants.deliveringStates.building || that.deliveringState == constants.deliveringStates.publishing) {
                deferred.reject('Experience is already building or publishing.');
            }

            that.build().then(function() {
                that.deliveringState = constants.deliveringStates.publishing;
                app.trigger(constants.messages.experience.publish.started, that);

                deliverService.publishExperience(that.id).then(function(publishInfo) {
                    that.publishedPackageUrl = publishInfo.publishedPackageUrl;
                    that.deliveringState = constants.deliveringStates.succeed;
                    app.trigger(constants.messages.experience.publish.completed, that);
                    deferred.resolve(that);
                });
            }).fail(function (message) {
                that.deliveringState = constants.deliveringStates.failed;
                that.publishedPackageUrl = '';
                app.trigger(constants.messages.experience.publish.failed, that.id, message);
                deferred.reject(message);
            });
                        
            return deferred.promise;
        };
            
        return Experience;
    }
);