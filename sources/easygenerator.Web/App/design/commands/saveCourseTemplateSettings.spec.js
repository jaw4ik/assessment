import $ from 'jquery';

import http from 'plugins/http';

import * as command  from './saveCourseTemplateSettings.js';

describe('command [saveCourseTemplateSettings]', () => {

    it('should post settings', () => {
        spyOn(http, 'post').and.returnValue($.Deferred().resolve(true));
        command.saveCourseTemplateSettings('courseId', 'templateId', {}, {});
        expect(http.post).toHaveBeenCalledWith('/api/course/courseId/template/templateId', { settings : '{}', extraData : '{}' }, jasmine.any(Object));
    });

    describe('when post failed', () => {

        it('should reject promise', done => {
            spyOn(http, 'post').and.returnValue($.Deferred().reject());
            command.saveCourseTemplateSettings().catch(() => {
                done();
            });
        });

    });

    describe('when response is truthy', () => {

        beforeEach(() => {
            spyOn(http, 'post').and.returnValue($.Deferred().resolve(true));
        });

        it('should resolve promise', done => {
            command.saveCourseTemplateSettings().then(() => {
                done();
            });
        });

    });

    describe('when response is falsy', () => {

        beforeEach(() => {
            spyOn(http, 'post').and.returnValue($.Deferred().resolve());
        });

        it('should reject promise', done => {
            command.saveCourseTemplateSettings().catch(() => {
                done();
            });
        });

    });

});