import createBar from './createBar';

import app from 'durandal/app';
import constants from 'constants';
import attributesHelper from 'dragAndDrop/helpers/attributesHelper';

describe('[createBar]', () => {

    beforeEach(() => {
        spyOn(app, 'trigger');
    });

    describe('createContent:', () => {

        it('should trigger event', () => {
            let contentType = 'contentType';
            spyOn(attributesHelper, 'getDataAttribute').and.returnValue(contentType);
            createBar.createContent(null, {});
            expect(app.trigger).toHaveBeenCalledWith(constants.messages.content.create, contentType);
        });

    });

    describe('done:', () => {

        it('should trigger event', () => {
            createBar.done();
            expect(app.trigger).toHaveBeenCalledWith(constants.messages.content.endEditing);
        });

    });

});