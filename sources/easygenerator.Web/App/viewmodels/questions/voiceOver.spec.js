define(function (require) {
    "use strict";

    var
        ctor = require('viewmodels/questions/voiceOver'),
        repository = require('repositories/questionRepository'),
        notify = require('notify'),
		audioLibraryDialog = require('dialogs/audio/audioLibrary')
    ;

    describe('viewModel [voiceOver]', function () {

        var viewModel;
        var questionId = 'questionId',
			embed = "embed";

        beforeEach(function () {
            viewModel = ctor(questionId, embed);

            spyOn(notify, 'success');
            spyOn(notify, 'saved');

            spyOn(audioLibraryDialog, 'show');
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

        describe('update:', function () {
            it('should show audia library dialog', function () {
                viewModel.update();
                expect(audioLibraryDialog.show).toHaveBeenCalled();
            });
        });

        describe('onAudioSelected', function () {

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