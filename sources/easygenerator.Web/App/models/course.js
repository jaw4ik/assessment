define(['models/entity', 'durandal/app', 'constants', 'services/publishService'],
    function (EntityModel, app, constants, publishService) {
        "use strict";

        function Course(spec) {

            EntityModel.call(this, spec);

            this.title = spec.title;
            this.objectives = spec.objectives;
            this.builtOn = spec.builtOn;
            this.packageUrl = spec.packageUrl;
            this.scormPackageUrl = spec.scormPackageUrl;
            this.template = spec.template;
            this.publishedPackageUrl = spec.publishedPackageUrl;
            this.reviewUrl = spec.reviewUrl;
            this.publishingState = constants.publishingStates.notStarted;
            this.introductionContent = spec.introductionContent;
        };
        
        Course.prototype.build = function () {
            var that = this;
            var deferred = Q.defer();
            if (that.publishingState == constants.publishingStates.building || that.publishingState == constants.publishingStates.publishing) {
                deferred.reject('Course is already building or publishing.');
            }
        
            that.publishingState = constants.publishingStates.building;
            app.trigger(constants.messages.course.build.started, that);
            app.trigger(constants.messages.course.action.started, that.id);

            publishService.buildCourse(that.id).then(function (buildInfo) {
                that.packageUrl = buildInfo.packageUrl;
                that.builtOn = buildInfo.builtOn;
                that.publishingState = constants.publishingStates.succeed;
                app.trigger(constants.messages.course.build.completed, that);
                deferred.resolve(that);
            }).fail(function (message) {
                that.publishingState = constants.publishingStates.failed;
                that.packageUrl = '';
                app.trigger(constants.messages.course.build.failed, that.id, message);
                deferred.reject(message);
            });
            
            return deferred.promise;
        };
        
        Course.prototype.scormBuild = function () {
            var that = this;
            var deferred = Q.defer();
            if (that.publishingState == constants.publishingStates.building || that.publishingState == constants.publishingStates.publishing) {
                deferred.reject('Course is already building or publishing.');
            }

            that.publishingState = constants.publishingStates.building;
            app.trigger(constants.messages.course.scormBuild.started, that);
            app.trigger(constants.messages.course.action.started, that.id);

            publishService.scormBuildCourse(that.id).then(function (buildInfo) {
                that.scormPackageUrl = buildInfo.scormPackageUrl;
                that.publishingState = constants.publishingStates.succeed;
                app.trigger(constants.messages.course.scormBuild.completed, that);
                deferred.resolve(that);
            }).fail(function (message) {
                that.publishingState = constants.publishingStates.failed;
                that.scormPackageUrl = '';
                app.trigger(constants.messages.course.scormBuild.failed, that.id, message);
                deferred.reject(message);
            });

            return deferred.promise;
        };
        

        Course.prototype.publish = function () {
            var that = this;
            var deferred = Q.defer();

            if (that.publishingState == constants.publishingStates.building || that.publishingState == constants.publishingStates.publishing) {
                deferred.reject('Course is already building or publishing.');
            }

            that.build().then(function() {
                that.publishingState = constants.publishingStates.publishing;
                app.trigger(constants.messages.course.publish.started, that);

                return publishService.publishCourse(that.id).then(function(publishInfo) {
                    that.publishedPackageUrl = publishInfo.publishedPackageUrl;
                    that.publishingState = constants.publishingStates.succeed;
                    app.trigger(constants.messages.course.publish.completed, that);
                    deferred.resolve(that);
                });
            }).fail(function (message) {
                that.publishingState = constants.publishingStates.failed;
                that.publishedPackageUrl = '';
                app.trigger(constants.messages.course.publish.failed, that.id, message);
                deferred.reject(message);
            });
                        
            return deferred.promise;
        };
        
        Course.prototype.publishForReview = function () {
            var that = this;
            var deferred = Q.defer();

            if (that.publishingState == constants.publishingStates.building || that.publishingState == constants.publishingStates.publishing) {
                deferred.reject('Course is already building or publishing.');
            }

            that.build().then(function () {
                that.publishingState = constants.publishingStates.publishing;
                app.trigger(constants.messages.course.publishForReview.started, that);

                return publishService.publishCourseForReview(that.id).then(function (publishInfo) {
                    that.reviewUrl = publishInfo.reviewUrl;
                    that.publishingState = constants.publishingStates.succeed;
                    app.trigger(constants.messages.course.publishForReview.completed, that);
                    deferred.resolve(that);
                });
            }).fail(function (message) {
                that.publishingState = constants.publishingStates.failed;
                that.reviewUrl = '';
                app.trigger(constants.messages.course.publishForReview.failed, that.id, message);
                deferred.reject(message);
            });

            return deferred.promise;
        };

        Course.prototype.publishToStore = function() {
            var that = this;
            var deferred = Q.defer();
            
            if (that.publishingState == constants.publishingStates.building || that.publishingState == constants.publishingStates.publishing) {
                deferred.reject('Course is already building or publishing to Aim4You.');
            }
            
            that.build().then(function() {
                that.publishingState = constants.publishingStates.publishing;
                app.trigger(constants.messages.course.publishToAim4You.started, that);
                return publishService.publishCourseToStore(that.id).then(function() {
                    that.publishingState = constants.publishingStates.succeed;
                    app.trigger(constants.messages.course.publishToAim4You.completed, that);
                    deferred.resolve(that);
                });
            }).fail(function (message) {
                that.publishingState = constants.publishingStates.failed;
                app.trigger(constants.messages.course.publishToAim4You.failed, that.id, message);
                deferred.reject(message);
            });

            return deferred.promise;
        };
            
        return Course;
    }
);