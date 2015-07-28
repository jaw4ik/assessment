define(['viewmodels/learningPaths/learningPath/publish'], function(viewModel) {

    var eventTracker = require('eventTracker'),
        getLearningPathByIdQuery = require('viewmodels/learningPaths/learningPath/queries/getLearningPathByIdQuery');

    describe('viewModel [learningPath publish]', function () {

        beforeEach(function() {
            spyOn(eventTracker, 'publish');
        });

        describe('learningPath:', function () {
            it('should be defined', function() {
                expect(viewModel.learningPath).toBeDefined();
            });
        });

        describe('publishAction:', function() {
            it('should be object', function() {
                expect(viewModel.publishAction).toBeObject();
            });
        });

        describe('downloadAction:', function () {
            it('should be object', function () {
                expect(viewModel.downloadAction).toBeObject();
            });
        });

        describe('onOpenLinkTab:', function() {
            it('should be function', function() {
                expect(viewModel.onOpenLinkTab).toBeFunction();
            });

            it('should publish event \'Open link tab\'', function() {
                viewModel.onOpenLinkTab();
                expect(eventTracker.publish).toHaveBeenCalledWith('Open link tab');
            });
        });

        describe('onOpenEmbedTab:', function() {
            it('should be function', function() {
                expect(viewModel.onOpenEmbedTab).toBeFunction();
            });

            it('should publish event \'Open emped tab\'', function() {
                viewModel.onOpenEmbedTab();
                expect(eventTracker.publish).toHaveBeenCalledWith('Open embed tab');
            });
        });

        describe('onOpenHtmlTab:', function() {
            it('should be function', function() {
                expect(viewModel.onOpenHtmlTab).toBeFunction();
            });

            it('should publish event \'Open \'downoload HTML\'\'', function() {
                viewModel.onOpenHtmlTab();
                expect(eventTracker.publish).toHaveBeenCalledWith('Open \'downoload HTML\'');
            });
        });

        describe('activate:', function () {
            var getLearningPathDefer,
                learningPath = { id: 'learningPathId' };

            beforeEach(function () {
                getLearningPathDefer = Q.defer();
                spyOn(getLearningPathByIdQuery, 'execute').and.returnValue(getLearningPathDefer.promise);
            });

            it('should be function', function() {
                expect(viewModel.activate).toBeFunction();
            });

            it('should return promise', function() {
                var result = viewModel.activate('learningPathId');
                expect(result).toBePromise();
            });

            it('should get learningPath by id', function() {
                viewModel.activate('learningPathId');
                expect(getLearningPathByIdQuery.execute).toHaveBeenCalledWith('learningPathId');
            });

            describe('when received learning path', function () {

                beforeEach(function() {
                    getLearningPathDefer.resolve(learningPath);
                });

                it('should set learningPath', function (done) {
                    viewModel.laerningPath = null;

                    var promise = viewModel.activate('learningPathId');

                    promise.fin(function () {
                        expect(viewModel.learningPath).toBe(learningPath);
                        done();
                    });
                });
                
            });

        });

        describe('deactivate:', function() {
            beforeEach(function() {
                viewModel.publishAction = { deactivate: function () { } };
                viewModel.downloadAction = { deactivate: function () { } };
                spyOn(viewModel.publishAction, 'deactivate');
                spyOn(viewModel.downloadAction, 'deactivate');
            });

            it('should be function', function () {
                expect(viewModel.deactivate).toBeFunction();
            });

            it('should deactivate publish action', function() {
                viewModel.deactivate();
                expect(viewModel.publishAction.deactivate).toHaveBeenCalled();
            });

            it('should deactivate download action', function() {
                viewModel.deactivate();
                expect(viewModel.downloadAction.deactivate).toHaveBeenCalled();
            });
        });
    });
});