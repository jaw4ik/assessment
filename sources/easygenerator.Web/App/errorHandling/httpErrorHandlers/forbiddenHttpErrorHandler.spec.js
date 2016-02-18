import errorHandler from './forbiddenHttpErrorHandler';

import notify from 'notify';
import localizationManager from 'localization/localizationManager';

describe('[forbiddenHttpErrorHandler]', function () {

    describe('handleError:', function () {

        var response;

        beforeEach(function () {
            spyOn(notify, 'error');
            spyOn(localizationManager, 'localize');
            response = jasmine.createSpyObj('response', ['getResponseHeader']);
        });

        it('should be function', function () {
            expect(errorHandler.handleError).toBeFunction();
        });

        it('should get response key', function() {
            errorHandler.handleError(response);

            expect(response.getResponseHeader).toHaveBeenCalledWith('ErrorMessageResourceKey');
        });

        it('should show notification', function () {
            errorHandler.handleError(response);

            expect(notify.error).toHaveBeenCalled();
        });

    });

});
