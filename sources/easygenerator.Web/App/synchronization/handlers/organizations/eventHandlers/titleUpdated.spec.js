import handler from './titleUpdated';

import app from 'durandal/app';
import constants from 'constants';

describe('synchronization organizations [organizationTitleUpdated]', () => {
    let organizationId = 'id',
        title = 'title';
    
    beforeEach(() => {
        spyOn(app, 'trigger');
    });

    describe('when organizationId is not string', () => {

        it('should throw exception', () => {
            var f = () => {
                handler(null, title);
            };
            expect(f).toThrow('organizationId is not a string');
        });

    });

    describe('when title is not string', () => {

        it('should throw exception', () => {
            var f = () => {
                handler(organizationId, null);
            };
            expect(f).toThrow('organizationTitle is not a string');
        });

    });

    it('should trigger app event', () => {
        handler(organizationId, title);

        expect(app.trigger).toHaveBeenCalledWith(constants.messages.organization.titleUpdated + organizationId, title);
    });
});
