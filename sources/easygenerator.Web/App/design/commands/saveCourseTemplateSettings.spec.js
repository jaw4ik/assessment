import * as command  from './saveCourseTemplateSettings.js';

import $ from 'jquery';
import http from 'plugins/http';

describe('command [saveCourseTemplateSettings]', () => {

    it('should get api header', () => {
        spyOn(window.auth, 'getHeader').and.returnValue($.Deferred());
        command.saveCourseTemplateSettings('courseId', 'templateId', {}, {});
        expect(window.auth.getHeader).toHaveBeenCalledWith('api');
    });

    describe('when header exists', () => {

        beforeEach(() => {
            spyOn(window.auth, 'getHeader').and.returnValue($.Deferred().resolve({ api: 'api' }));
        });

        it('should post settings', done => {
            spyOn(http, 'post').and.returnValue($.Deferred().resolve(true));
            command.saveCourseTemplateSettings('courseId', 'templateId', {}, {}).then(() => {
                expect(http.post).toHaveBeenCalledWith('/api/course/courseId/template/templateId', { settings : '{}', extraData : '{}' }, jasmine.any(Object));
                done();
            });
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

});