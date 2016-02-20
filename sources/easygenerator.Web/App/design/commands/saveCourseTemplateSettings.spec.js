import * as command  from './saveCourseTemplateSettings.js';

import $ from 'jquery';
import http from 'plugins/http';

describe('command [saveCourseTemplateSettings]', () => {

    it('should post settings', () => {
        spyOn(http, 'post').and.returnValue($.Deferred().resolve(true));
        command.saveCourseTemplateSettings('courseId', 'templateId', {}, {});
        expect(http.post).toHaveBeenCalledWith('/api/course/courseId/template/templateId', { settings : '{}', extraData : '{}' }, jasmine.any(Object));
    });

    describe('when post failed', () => {

        it('should reject promise', done => {
            spyOn(http, 'post').and.returnValue($.Deferred().reject());
            var promise = command.saveCourseTemplateSettings();
            promise.then(() => {
                expect(false).toBeTruthy();
                done();
            }).catch(() => {
                expect(true).toBeTruthy();
                done();
            });
        });

    });

    describe('when response is truthy', () => {

        beforeEach(() => {
            spyOn(http, 'post').and.returnValue($.Deferred().resolve(true));
        });

        it('should resolve promise', done => {
            var promise = command.saveCourseTemplateSettings();
            promise.then(() => {
                expect(true).toBeTruthy();
                done();
            }).catch(() => {
                expect(false).toBeTruthy();
                done();
            });
        });

    });

    describe('when response is falsy', () => {

        beforeEach(() => {
            spyOn(http, 'post').and.returnValue($.Deferred().resolve());
        });

        it('should reject promise', done => {
            var promise = command.saveCourseTemplateSettings();
            promise.then(() => {
                expect(false).toBeTruthy();
                done();
            }).catch(() => {
                expect(true).toBeTruthy();
                done();
            });
        });

    });

});