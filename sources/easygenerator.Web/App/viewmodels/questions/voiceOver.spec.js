define(function (require) {
    "use strict";

    var
        ctor = require('viewmodels/questions/voiceOver'),
        repository = require('repositories/questionRepository'),
        notify = require('notify'),
		audioLibraryDialog = require('dialogs/audio/audioLibrary'),
		eventTracker = require('eventTracker'),
        app = require('durandal/app'),
        constants = require('constants')
    ;

    describe('viewModel [voiceOver]', function () {

        var viewModel;
        var questionId = 'questionId',
            vimeoId = 'vimeoId',
			embed = '<iframe title="title" audioId="vimeoId"></iframe>';

        beforeEach(function () {
            viewModel = ctor(questionId, embed);

            spyOn(notify, 'success');
            spyOn(notify, 'saved');
            spyOn(eventTracker, 'publish');
            spyOn(app, 'on');

            spyOn(audioLibraryDialog, 'show');
        });

        describe('ctor:', function () {
            it('should sunscribe on question voiceOverUpdatedByCollaborator', function () {
                var vm = ctor(questionId, embed);
                expect(app.on).toHaveBeenCalledWith(constants.messages.question.voiceOverUpdatedByCollaborator + questionId, vm.voiceOverUpdatedByCollaborator);
            });

            describe('when embed code is not a string', function () {

                it('should set title to null', function () {
                    var vm = ctor(questionId, null);
                    expect(vm.title()).toEqual(null);
                });

                it('should set vimeoId to null', function () {
                    var vm = ctor(questionId, null);
                    expect(vm.vimeoId).toEqual(null);
                });
            });

            it('should set title from embed code', function () {
                var vm = ctor(questionId, embed);
                expect(vm.title()).toEqual('title');
            });

            it('should set vimeoId from embed code', function () {
                var vm = ctor(questionId, embed);
                expect(vm.vimeoId).toEqual('vimeoId');
            });
        });

        describe('title', function () {

            it('should be observable', function () {
                expect(viewModel.title).toBeObservable();
            });

        });

        describe('getTitle', function () {

            describe('when embed code is not a string', function () {

                it('should return null', function () {
                    expect(viewModel.getTitle()).toEqual(null);
                });

            });

            it('should return title from embed code', function () {
                expect(viewModel.getTitle('<iframe title="title"></iframe>')).toEqual('title');
            });

        });

        describe('voiceOverUpdatedByCollaborator:', function () {
            describe('when voice over code is not a string', function () {

                it('should set title to null', function () {
                    viewModel.title('titile');
                    viewModel.voiceOverUpdatedByCollaborator(null);
                    expect(viewModel.title()).toEqual(null);
                });

                it('should set vimeoId to null', function () {
                    viewModel.vimeoId = 'asd';
                    viewModel.voiceOverUpdatedByCollaborator(null);
                    expect(viewModel.vimeoId).toEqual(null);
                });

            });

            it('should set title from embed code', function () {
                viewModel.title('asd');
                viewModel.voiceOverUpdatedByCollaborator(embed);
                expect(viewModel.title()).toEqual('title');
            });

            it('should set vimeoId from embed code', function () {
                viewModel.vimeoId = 'asd';
                viewModel.voiceOverUpdatedByCollaborator(embed);
                expect(viewModel.vimeoId).toEqual(vimeoId);
            });
        });

        describe('update:', function () {
            it('should publish \'Open \'Choose voice over from audio library\' dialog\' event', function () {
                viewModel.update();
                expect(eventTracker.publish).toHaveBeenCalledWith('Open \'Choose voice over from audio library\' dialog');
            });

            it('should show audio library dialog', function () {
                viewModel.vimeoId = vimeoId;
                viewModel.update();
                expect(audioLibraryDialog.show).toHaveBeenCalledWith(vimeoId, viewModel.onAudioSelected);
            });
        });

        describe('onAudioSelected', function () {
            describe('when voice over vimeoId is not defined', function () {
                beforeEach(function () {
                    viewModel.vimeoId = null;
                });

                it('should publish \'Add voice over\' event', function () {
                    viewModel.onAudioSelected({
                        title: 'title',
                        vimeoId: 'vimeoId'
                    });
                    expect(eventTracker.publish).toHaveBeenCalledWith('Add voice over');
                });
            });

            describe('when voice over vimeoId is defined', function () {
                beforeEach(function () {
                    viewModel.vimeoId = 'vvv';
                });

                it('should publish \'Change voice over\' event', function () {
                    viewModel.onAudioSelected({
                        title: 'title',
                        vimeoId: 'vimeoId'
                    });
                    expect(eventTracker.publish).toHaveBeenCalledWith('Change voice over');
                });
            });

            var updateDefer;
            beforeEach(function () {
                updateDefer = Q.defer();
                spyOn(repository, 'updateVoiceOver').and.returnValue(updateDefer.promise);
                spyOn(viewModel, 'getEmbedCode').and.returnValue('embed');
                updateDefer.resolve();
            });

            describe('when audio is not an object', function () {

                it('should throw exception', function () {
                    var f = function () {
                        viewModel.onAudioSelected();
                    };

                    expect(f).toThrow();
                });

            });

            describe('when vimeoId is not a string', function () {

                it('should throw exception', function () {
                    var f = function () {
                        viewModel.onAudioSelected({ title: 'title' });
                    };

                    expect(f).toThrow();
                });

            });

            describe('when video title is not a string', function () {

                it('should throw exception', function () {
                    var f = function () {
                        viewModel.onAudioSelected({ vimeoId: 'vimeoId' });
                    };

                    expect(f).toThrow();
                });

            });

            it('should set voice over title', function () {
                viewModel.title(null);
                viewModel.onAudioSelected({
                    title: 'title',
                    vimeoId: 'vimeoId'
                });
                expect(viewModel.title()).toEqual('title');
            });

            it('should set voice over vimeoId', function () {
                viewModel.vimeoId = null;
                viewModel.onAudioSelected({
                    title: 'title',
                    vimeoId: 'vimeoId'
                });
                expect(viewModel.vimeoId).toEqual('vimeoId');
            });

            it('should send request to server', function () {
                viewModel.onAudioSelected({
                    title: 'title',
                    vimeoId: 'vimeoId'
                });
                expect(repository.updateVoiceOver).toHaveBeenCalledWith(questionId, 'embed');
            });

            describe('and when voice over is updated', function () {

                it('should show notification', function (done) {
                    viewModel.onAudioSelected({
                        title: 'title',
                        vimeoId: 'vimeoId'
                    });
                    updateDefer.promise.fin(function () {
                        expect(notify.saved).toHaveBeenCalled();
                        done();
                    });
                });

            });

        });

        describe('remove', function () {

            it('should publish \'Delete voice over\' event', function () {
                viewModel.remove();
                expect(eventTracker.publish).toHaveBeenCalledWith('Delete voice over');
            });

            var updateDefer;
            beforeEach(function () {
                updateDefer = Q.defer();
                spyOn(repository, 'updateVoiceOver').and.returnValue(updateDefer.promise);
                updateDefer.resolve();
            });

            it('should send request to server', function () {
                viewModel.remove();
                expect(repository.updateVoiceOver).toHaveBeenCalledWith(questionId, null);
            });

            describe('and when voice over is removed', function () {

                it('should clear title', function (done) {
                    viewModel.title('title');
                    viewModel.remove().then(function () {
                        expect(viewModel.title()).toEqual(null);
                        done();
                    });
                });

                it('should show notification', function (done) {
                    viewModel.remove().then(function () {
                        expect(notify.saved).toHaveBeenCalled();
                        done();
                    });
                });

            });

        });
    });
})