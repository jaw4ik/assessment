import dialog from 'dialogs/survey/survey';
import dialogWidget from 'widgets/dialog/viewmodel';
import constants from 'constants';
import updateVersionCommand from 'dialogs/survey/commands/updateVersionCommand';
import userContext from 'userContext';

describe('dialog [survey]', () => {
    var survey;

    beforeEach(() => {    
        survey = dialog;
        userContext.identity = {
            fullname: 'Some User',
            email: 'example@test.com',
        };
        constants.surveyPopup = {
            pageUrl: 'testUrl/page',
            originUrl: 'origin url'
        }
        spyOn(dialogWidget, 'close');
    });

    describe('show:', () => {

        beforeEach(() => {
            spyOn(dialogWidget, 'on');
            spyOn(dialogWidget, 'show');
            spyOn(window, 'addEventListener');
        });

        it('should be function', () => {
            expect(survey.show).toBeFunction();
        });

        it('should create page url', () => {
            survey.show();
            expect(survey.pageUrl).toEqual(constants.surveyPopup.pageUrl + "?email=" + userContext.identity.email + "&name=" + userContext.identity.fullname);
        });

        it('should show dialog', () => {
            survey.show();
            expect(dialogWidget.show).toHaveBeenCalledWith(survey, constants.dialogs.survey.settings);
        });

        it('should subscribe on dialog close event', () => {
            survey.show();
            expect(dialogWidget.on).toHaveBeenCalledWith(constants.dialogs.dialogClosed, survey.closed);
        });
    
    });

    describe('submit:', () => {

        let response, updateVersionCommandPromise;

        beforeEach(() => {
            response = {
                origin: 'origin url'
            };
            updateVersionCommandPromise = Promise.resolve();
            spyOn(updateVersionCommand, 'execute').and.returnValue(updateVersionCommandPromise);
            spyOn(window, 'removeEventListener');
        });

        it('should be function', () => {
            expect(survey.submit).toBeFunction();
        });

        describe('when response origin url supported', () => {

            it('should update last passed survey version for user', () => {
                survey.submit(response);
                expect(updateVersionCommand.execute).toHaveBeenCalled();
            });

            it('should update lastPassedSurveyPopup', done => (async () => {
                userContext.identity.showSurveyPopup = true;
                await survey.submit(response);
                expect(userContext.identity.showSurveyPopup).toBeFalsy();
            })().then(done));

            it('should close dialogWidget', done => (async () => {
                await survey.submit(response);
                expect(dialogWidget.close).toHaveBeenCalled();
            })().then(done));

        });
    });

    describe('closed:', () => {

        beforeEach(() => {
            spyOn(dialogWidget, 'off');
        });

        it('should be function', () => {
            expect(survey.closed).toBeFunction();
        });

        it('should unsubscribe event dialog close', () => {
            survey.closed();
            expect(dialogWidget.off).toHaveBeenCalledWith(constants.dialogs.dialogClosed, survey.closed);
        });

    });

});
