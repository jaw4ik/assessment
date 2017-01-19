import survicate from 'analytics/survicate/survicateLoader';
import constants from 'constants';

var survicateConstants = constants.analytics.survicate;

describe(' [survicate]', () => {

    describe('load:', () => {

        let promise;

        beforeEach(() => {
            window._sv = window._sv || {};
            promise = Promise.resolve();
            spyOn(System, 'import').and.returnValue(promise);
        });

        it('should be function', () => {
            expect(survicate.load).toBeFunction();
        });

        it('should return promise', () => {
            expect(survicate.load('test')).toBePromise();
        });

        it('should set trackingCode', () => {
            window._sv.trackingCode = 'test';

            survicate.load('test');
            
            expect(window._sv.trackingCode).toBe(survicateConstants.trackingCode);
        });

        it('should set identity', () => {
            window._sv.identity = 'test1';

            survicate.load('test2');
            
            expect(window._sv.identity).toBe('test2');
        });

        it('should send request to load js file from api', () => {
            survicate.load('test');
            expect(System.import).toHaveBeenCalledWith(survicateConstants.apiUrl);
        });

    });
});
