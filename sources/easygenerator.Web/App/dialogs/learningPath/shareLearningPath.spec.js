import shareLearningPath from 'dialogs/learningPath/shareLearningPath';
import userContext from 'userContext';
import defaultPublishModel from 'dialogs/learningPath/defaultPublish';
import customPublishModel from 'dialogs/learningPath/customPublish';

describe('dialog [shareLearningPath]', () => {

    it('should be object', () => {
        expect(shareLearningPath).toBeObject();
    });

    describe('publishModel:', () => {

        it('should be defined', () => {
            expect(shareLearningPath.publishModel).toBeDefined();
        });

    });

    describe('company:', () => {

        it('should be defined', () => {
            expect(shareLearningPath.company).toBeDefined();
        });

    });

    describe('isShown:', () => {

        it('should be defined', () => {
            expect(shareLearningPath.isShown).toBeObservable();
        });

    });

    describe('isActivated:', () => {

        it('should be defined', () => {
            expect(shareLearningPath.isActivated).toBeObservable();
        });

    });

    describe('activate:', () => {

        it('should be function', () => {
            expect(shareLearningPath.activate).toBeFunction();
        });

        describe('when user doesn\'t have company', () => {

            beforeEach(() => {
                userContext.identity = {};
                userContext.identity.companies = [];
            });

            it('should set defult publish model', () => {
                shareLearningPath.publishModel = null;
                shareLearningPath.activate();
                expect(shareLearningPath.publishModel).toBe(defaultPublishModel);
            });

            it('should set company to null', () => {
                shareLearningPath.activate();
                expect(shareLearningPath.company).toBeNull();
            });

        });

        describe('when user has company', () => {

            var company1 = { priority: 0 },
                company2 = { priority: 1 };

            beforeEach(() => {
                userContext.identity = {};
                userContext.identity.companies = [company1, company2];
            });

            it('should set custom publish model', () => {
                shareLearningPath.publishModel = null;
                shareLearningPath.activate();
                expect(shareLearningPath.publishModel).toBe(customPublishModel);
            });

            it('should set company to company with the most largest priority', () => {
                shareLearningPath.company = null;
                shareLearningPath.activate();
                expect(shareLearningPath.company).toBe(company2);
            });

        });
            
    });

    describe('show:', () => {

        beforeEach(() => {
            shareLearningPath.publishModel = { activate: () => {} };
            spyOn(shareLearningPath.publishModel, 'activate');
        });

        it('should be function', () => {
            expect(shareLearningPath.show).toBeFunction();
        });

        it('should return promise', () => {
            shareLearningPath.company = null;
            expect(shareLearningPath.show()).toBePromise();
        });

        it('should set isActivated to true', done => (async () => {
            shareLearningPath.company = null;
            shareLearningPath.isActivated(false);
            await shareLearningPath.show('learningPathId');
            expect(shareLearningPath.isActivated()).toBeTruthy();
        })().then(done));

        it('should show dialog', done => (async () => {
            shareLearningPath.company = null;
            shareLearningPath.isShown(false);
            await shareLearningPath.show('learningPathId');
            expect(shareLearningPath.isShown()).toBeTruthy();
        })().then(done));

        describe('when user has no companies', () => {

            beforeEach(() => {
                shareLearningPath.company = null;
            });

            it('should activate publish model', () => {
                shareLearningPath.show('learningPathId');
                expect(shareLearningPath.publishModel.activate).toHaveBeenCalledWith('learningPathId');
            });

        });

        describe('when user has companies', () => {

            var company = { priority: 0 };

            beforeEach(() => {
                shareLearningPath.company = company;
            });

            it('should activate publish model', () => {
                shareLearningPath.show('learningPathId');
                expect(shareLearningPath.publishModel.activate).toHaveBeenCalledWith({ learningPathId: 'learningPathId', companyInfo: company });
            });

        });

    });

    describe('hide:', () => {

        beforeEach(() => {
            shareLearningPath.publishModel = { deactivate: () => { } };
            spyOn(shareLearningPath.publishModel, 'deactivate');
        });

        it('should be function', () => {
            expect(shareLearningPath.hide).toBeFunction();
        });

        it('should deactivate publish model', () => {
            shareLearningPath.hide();
            expect(shareLearningPath.publishModel.deactivate).toHaveBeenCalled();
        });

        it('should set isActivated to false', () => {
            shareLearningPath.isActivated(null);
            shareLearningPath.hide();
            expect(shareLearningPath.isActivated()).toBeFalsy();
        });

        it('should hide dilog', () => {
            shareLearningPath.isShown(null);
            shareLearningPath.hide();
            expect(shareLearningPath.isShown()).toBeFalsy();
        });

    });

});