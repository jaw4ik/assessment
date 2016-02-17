import * as command  from './getCourseTemplateSettings.js';

import http from 'http/apiHttpWrapper';

describe('command [getCourseTemplateSettings]', () => {

    it('should get settings', done => {
        spyOn(http, 'get').and.returnValue(Promise.reject());
        command.getCourseTemplateSettings('courseId', 'templateId').catch(() => {
            expect(http.get).toHaveBeenCalled();
            done();
        });
    });

    describe('when get failed', () => {

        it('should reject promise', done => {
            spyOn(http, 'get').and.returnValue(Promise.reject('reason'));
            command.getCourseTemplateSettings().catch(reason => {
                expect(reason).toEqual('reason');
                done();
            });
        });

    });

    describe('when response is not an object', () => {

        beforeEach(() => {
            spyOn(http, 'get').and.returnValue(Promise.resolve());
        });

        it('should reject promise', done => {
            command.getCourseTemplateSettings().catch(reason => {
                expect(reason).toBeDefined();
                done();
            });
        });

    });

    describe('when settings are not a valid JSON', () => {

        beforeEach(() => {
            spyOn(http, 'get').and.returnValue(Promise.resolve({ settings: '>>', extraData: '{}' }));
        });

        it('should reject promise', done => {
            command.getCourseTemplateSettings().catch(reason => {
                expect(reason).toBeDefined();
                done();
            });
        });

    });

    describe('when extrdaData is not a valid JSON', () => {

        beforeEach(() => {
            spyOn(http, 'get').and.returnValue(Promise.resolve({ settings: '{}', extraData: '>>' }));
        });

        it('should reject promise', done => {
            command.getCourseTemplateSettings('courseId', 'templateId').catch(reason => {
                expect(reason).toBeDefined();
                done();
            });
        });

    });

});