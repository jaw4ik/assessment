import publishDialog from 'dialogs/course/publishCourse/publishDialog';
import userContext from 'userContext';
import defaultPublishModel from 'dialogs/course/publishCourse/defaultPublish';
import customPublishModel from 'dialogs/course/publishCourse/customPublish';

describe('dialog [publishDialog]', () => {
        
    it('should be object', () => {
        expect(publishDialog).toBeObject();
    });

    describe('publishModel:', () => {

        it('should be defined', () => {
            expect(publishDialog.publishModel).toBeDefined();
        });

    });

    describe('company:', () => {

        it('should be defined', () => {
            expect(publishDialog.company).toBeDefined();
        });

    });

    describe('isShown:', () => {

        it('should be defined', () => {
            expect(publishDialog.isShown).toBeObservable();
        });

    });

    describe('isActivated:', () => {

        it('should be defined', () => {
            expect(publishDialog.isActivated).toBeObservable();
        });

    });

    describe('activate:', () => {

        it('should be function', () => {
            expect(publishDialog.activate).toBeFunction();
        });

        describe('when user doesn\'t have company', () => {

            beforeEach(() => {
                userContext.identity.companies = [];
            });

            it('should set defult publish model', () => {
                publishDialog.publishModel = null;
                publishDialog.activate();
                expect(publishDialog.publishModel).toBe(defaultPublishModel);
            });

            it('should set company to null', () => {
                publishDialog.activate();
                expect(publishDialog.company).toBeNull();
            });

        });

        describe('when user has company', () => {

            var company1 = { priority: 0 },
                company2 = { priority: 1 };

            beforeEach(() => {
                userContext.identity.companies = [company1, company2];
            });

            it('should set custom publish model', () => {
                publishDialog.publishModel = null;
                publishDialog.activate();
                expect(publishDialog.publishModel).toBe(customPublishModel);
            });

            it('should set company to company with the most largest priority', () => {
                publishDialog.company = null;
                publishDialog.activate();
                expect(publishDialog.company).toBe(company2);
            });

        });
            
    });

    describe('show:', () => {

        beforeEach(() => {
            publishDialog.publishModel = { activate: () => {} };
            spyOn(publishDialog.publishModel, 'activate');
        });

        it('should be function', () => {
            expect(publishDialog.show).toBeFunction();
        });

        it('should return promise', () => {
            publishDialog.company = null;
            expect(publishDialog.show()).toBePromise();
        });

        it('should set isActivated to true', done => (async () => {
            publishDialog.company = null;
            publishDialog.isActivated(false);
            await publishDialog.show('courseId');
            expect(publishDialog.isActivated()).toBeTruthy();
        })().then(done));

        it('should show dialog', done => (async () => {
            publishDialog.company = null;
            publishDialog.isShown(false);
            await publishDialog.show('courseId');
            expect(publishDialog.isShown()).toBeTruthy();
        })().then(done));

        describe('when user has no companies', () => {

            beforeEach(() => {
                publishDialog.company = null;
            });

            it('should activate publish model', () => {
                publishDialog.show('courseId');
                expect(publishDialog.publishModel.activate).toHaveBeenCalledWith('courseId');
            });

        });

        describe('when user has companies', () => {

            var company = { priority: 0 };

            beforeEach(() => {
                publishDialog.company = company;
            });

            it('should activate publish model', () => {
                publishDialog.show('courseId');
                expect(publishDialog.publishModel.activate).toHaveBeenCalledWith({ courseId: 'courseId', companyInfo: company });
            });

        });

    });

    describe('hide:', () => {

        beforeEach(() => {
            publishDialog.publishModel = { deactivate: () => { } };
            spyOn(publishDialog.publishModel, 'deactivate');
        });

        it('should be function', () => {
            expect(publishDialog.hide).toBeFunction();
        });

        it('should deactivate publish model', () => {
            publishDialog.hide();
            expect(publishDialog.publishModel.deactivate).toHaveBeenCalled();
        });

        it('should set isActivated to false', () => {
            publishDialog.isActivated(null);
            publishDialog.hide();
            expect(publishDialog.isActivated()).toBeFalsy();
        });

        it('should hide dilog', () => {
            publishDialog.isShown(null);
            publishDialog.hide();
            expect(publishDialog.isShown()).toBeFalsy();
        });

    });

});