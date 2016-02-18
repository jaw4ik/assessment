import viewModel from './publish';

import eventTracker from 'eventTracker';
import userContext from 'userContext';

describe('viewModel [learningPath publish]', function () {

    beforeEach(function () {
        spyOn(eventTracker, 'publish');
    });

    describe('learningPathId:', function () {
        it('should be defined', function () {
            expect(viewModel.learningPathId).toBeDefined();
        });
    });

    describe('companyInfo:', function() {
        it('should be defined', function () {
            expect(viewModel.companyInfo).toBeDefined();
        });
    });

    describe('publishAction:', function () {
        it('should be object', function () {
            expect(viewModel.publishAction).toBeObject();
        });
    });

    describe('downloadAction:', function () {
        it('should be object', function () {
            expect(viewModel.downloadAction).toBeObject();
        });
    });

    describe('onOpenLinkTab:', function () {
        it('should be function', function () {
            expect(viewModel.onOpenLinkTab).toBeFunction();
        });

        it('should publish event \'Open link tab\'', function () {
            viewModel.onOpenLinkTab();
            expect(eventTracker.publish).toHaveBeenCalledWith('Open link tab');
        });
    });

    describe('onOpenEmbedTab:', function () {
        it('should be function', function () {
            expect(viewModel.onOpenEmbedTab).toBeFunction();
        });

        it('should publish event \'Open emped tab\'', function () {
            viewModel.onOpenEmbedTab();
            expect(eventTracker.publish).toHaveBeenCalledWith('Open embed tab');
        });
    });

    describe('onOpenHtmlTab:', function () {
        it('should be function', function () {
            expect(viewModel.onOpenHtmlTab).toBeFunction();
        });

        it('should publish event \'Open \'downoload HTML\'\'', function () {
            viewModel.onOpenHtmlTab();
            expect(eventTracker.publish).toHaveBeenCalledWith('Open \'downoload HTML\'');
        });
    });

    describe('activate:', function () {
        var identifyDefer;

        beforeEach(function () {
            identifyDefer = Q.defer();
            spyOn(userContext, 'identify').and.returnValue(identifyDefer.promise);
        });

        it('should be function', function () {
            expect(viewModel.activate).toBeFunction();
        });

        it('should return promise', function () {
            var result = viewModel.activate('learningPathId');
            expect(result).toBePromise();
        });

        it('should identify user', function () {
            viewModel.activate('learningPathId');
            expect(userContext.identify).toHaveBeenCalled();
        });

        describe('when user is identified', function () {
            var company = { name: 'Company' };
            beforeEach(function () {
                identifyDefer.resolve();
                userContext.identity = { company: company };
            });

            it('should set companyInfo', function (done) {
                viewModel.companyInfo = null;
                viewModel.activate('learningPathId');

                identifyDefer.promise.fin(function () {
                    expect(viewModel.companyInfo).toBe(company);
                    done();
                });
            });

            it('should set learningPathId', function (done) {
                viewModel.laerningPathId = '';

                var promise = viewModel.activate('learningPathId');

                promise.fin(function () {
                    expect(viewModel.learningPathId).toBe('learningPathId');
                    done();
                });
            });

        });

    });

    describe('deactivate:', function () {
        beforeEach(function () {
            viewModel.publishAction = { deactivate: function () { } };
            viewModel.downloadAction = { deactivate: function () { } };
            viewModel.publishToCustomLmsAction = { deactivate: function () { } };
            spyOn(viewModel.publishAction, 'deactivate');
            spyOn(viewModel.publishToCustomLmsAction, 'deactivate');
            spyOn(viewModel.downloadAction, 'deactivate');
        });

        it('should be function', function () {
            expect(viewModel.deactivate).toBeFunction();
        });

        it('should deactivate publish action', function () {
            viewModel.deactivate();
            expect(viewModel.publishAction.deactivate).toHaveBeenCalled();
        });

        it('should deactivate publish to custom LMS action', function () {
            viewModel.deactivate();
            expect(viewModel.publishToCustomLmsAction.deactivate).toHaveBeenCalled();
        });

        it('should deactivate download action', function () {
            viewModel.deactivate();
            expect(viewModel.downloadAction.deactivate).toHaveBeenCalled();
        });
    });
});
