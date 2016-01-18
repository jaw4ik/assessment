
import http from 'http/apiHttpWrapper';

import * as command  from './getCourseTemplateSettings.js';

describe('command [saveCourseTemplateSettings]', () => {

    it('should get settings', () => {
        spyOn(http, 'get').and.returnValue(Promise.resolve());
        command.getCourseTemplateSettings('courseId', 'templateId');
        expect(http.get).toHaveBeenCalled();
    });

    describe('when get failed', () => {

        it('should reject promise', done => {
            spyOn(http, 'get').and.returnValue(Promise.reject());
            command.getCourseTemplateSettings().catch(() => {
                done();
            });
        });

    });

    describe('when response is not an object', () => {

        beforeEach(() => {
            spyOn(http, 'get').and.returnValue(Promise.reject());
        });

        it('should reject promise', done => {
            command.getCourseTemplateSettings().catch(() => {
                done();
            });
        });

    });

    describe('when settings are not a valid JSON', () => {

        beforeEach(() => {
            spyOn(http, 'get').and.returnValue(Promise.resolve({ settings: '>>', extraData: '{}' }));
        });

        it('should reject promise', done => {
            command.getCourseTemplateSettings().catch(() => {
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
                done();
            });
        });

    });

});