import command from './createSectionCommand';

import sectionRepository from 'repositories/sectionRepository';
import courseRepository from 'repositories/courseRepository';
import localizationManager from 'localization/localizationManager';
import router from 'routing/router';
import uiLocker from 'uiLocker';
import clientContext from 'clientContext';
import eventTracker from 'eventTracker';
import constants from 'constants';
import app from 'durandal/app';

describe('command [createSectionCommand]', function () {

    describe('execute:', function () {

        var addSectionDefer,
            title = 'title';

        beforeEach(function () {
            addSectionDefer = Q.defer();

            spyOn(router, 'navigate');
            spyOn(sectionRepository, 'addSection').and.returnValue(addSectionDefer.promise);

            spyOn(uiLocker, 'lock');
            spyOn(uiLocker, 'unlock');
            spyOn(clientContext, 'set');
            spyOn(eventTracker, 'publish');
            spyOn(app, 'trigger');
        });

        it('should be function', function () {
            expect(command.execute).toBeFunction();
        });

        it('should return promise', function () {
            expect(command.execute()).toBePromise();
        });

        it('should send event \'Create learning section and open it properties', function () {
            command.execute();
            expect(eventTracker.publish).toHaveBeenCalledWith('Create learning section and open it properties');
        });

        it('should lock content', function () {
            command.execute();
            expect(uiLocker.lock).toHaveBeenCalled();
        });

        it('should add section to repository', function () {
            spyOn(localizationManager, 'localize').and.returnValue(title);
            command.execute();
            expect(sectionRepository.addSection).toHaveBeenCalledWith({ title: title });
        });

        describe('when section added', function () {
            var sectionId = 'sectionId',
                section = { id: sectionId };

            beforeEach(function () {
                addSectionDefer.resolve(section);
            });

            describe('and when context course id is a string', function () {
                var courseId = 'courseId',
                    relateSectionDefer;

                beforeEach(function () {
                    relateSectionDefer = Q.defer();

                    spyOn(courseRepository, 'relateSection').and.returnValue(relateSectionDefer.promise);
                });

                it('should set lastCreatedSectionId in client context', function (done) {
                    relateSectionDefer.resolve();
                    command.execute(courseId).then(function () {
                        expect(clientContext.set).toHaveBeenCalledWith(constants.clientContextKeys.lastCreatedSectionId, sectionId);
                        done();
                    });
                });

                it('should relate created section to course', function (done) {
                    relateSectionDefer.resolve();
                    command.execute(courseId).then(function () {
                        expect(courseRepository.relateSection).toHaveBeenCalledWith(courseId, sectionId);
                        done();
                    });
                });

                describe('and when section related to course', function () {
                    beforeEach(function () {
                        relateSectionDefer.resolve();
                    });

                    it('should trigger app event', function (done) {
                        command.execute(courseId).then(function () {
                            expect(app.trigger).toHaveBeenCalledWith(constants.messages.section.createdInCourse);
                            done();
                        });
                    });

                    it('should unlock content', function (done) {
                        command.execute(courseId).then(function () {
                            expect(uiLocker.unlock).toHaveBeenCalled();
                            done();
                        });
                    });

                    it('should navigate to created section withint course', function (done) {
                        command.execute(courseId).then(function () {
                            expect(router.navigate).toHaveBeenCalledWith('courses/' + courseId + '/sections/' + sectionId);
                            done();
                        });
                    });
                });
            });

            describe('and when context course id is not a string', function () {

                it('should set lastCreatedSectionId in client context', function (done) {
                    command.execute().then(function () {
                        expect(clientContext.set).toHaveBeenCalledWith(constants.clientContextKeys.lastCreatedSectionId, sectionId);
                        done();
                    });
                });

                it('should unlock content', function (done) {
                    command.execute().then(function () {
                        expect(uiLocker.unlock).toHaveBeenCalled();
                        done();
                    });
                });

                it('should navigate to created section', function (done) {
                    command.execute().then(function () {
                        expect(router.navigate).toHaveBeenCalledWith('library/sections/' + sectionId);
                        done();
                    });
                });
            });
        });

        describe('when failed to  add section', function () {
            beforeEach(function () {
                addSectionDefer.reject();
            });

            it('should unlock content', function (done) {
                command.execute().then(function () {
                    expect(uiLocker.unlock).toHaveBeenCalled();
                    done();
                });
            });
        });
    });

});
