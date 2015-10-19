define(['dialogs/audio/audioLibrary'], function (viewModel) {

    var dialog = require('widgets/dialog/viewmodel'),
        constants = require('constants'),
        getAudiosQuery = require('audio/queries/getCollection');

    describe('dialog [audio library]', function () {
        var audios = [
        { title: 'Its Friday!', vimeoId: 'qwe' },
        { title: 'Hello!', vimeoId: 'asd' }];

        beforeEach(function () {
            spyOn(dialog, 'show');
            spyOn(dialog, 'close');
        });

        describe('selectedAudio:', function () {
            it('should be observable', function () {
                expect(viewModel.selectedAudio).toBeObservable();
            });
        });

        describe('isLoading:', function () {
            it('should be observable', function () {
                expect(viewModel.isLoading).toBeObservable();
            });
        });

        describe('audios:', function () {
            it('should be observable arra', function () {
                expect(viewModel.audios).toBeObservableArray();
            });
        });

        describe('selectAudio:', function () {
            it('should set selected audio', function () {
                viewModel.selectedAudio(null);
                viewModel.selectAudio(audios[0]);
                expect(viewModel.selectedAudio()).toBe(audios[0]);
            });
        });

        describe('submit:', function () {
            it('should close dialog', function () {
                viewModel.submit();
                expect(dialog.close).toHaveBeenCalled();
            });

            describe('when callback is defined', function () {
                beforeEach(function () {
                    viewModel.callback = jasmine.createSpy();
                });

                describe('when selected audio is set', function () {
                    beforeEach(function () {
                        viewModel.selectedAudio(audios[0]);
                    });

                    it('should call callback with selected audio', function () {
                        viewModel.submit();
                        expect(viewModel.callback).toHaveBeenCalledWith(audios[0]);
                    });
                });

                describe('when selected audio is not set', function () {
                    beforeEach(function () {
                        viewModel.selectedAudio(null);
                    });

                    it('should call callback with null', function () {
                        viewModel.submit();
                        expect(viewModel.callback).toHaveBeenCalledWith(null);
                    });
                });
            });
        });

        describe('show:', function () {
            it('should set callback', function () {
                var callback = function () { };
                viewModel.show(null, callback);
                expect(viewModel.callback).toBe(callback);
            });

            it('should set isLoading to true', function () {
                viewModel.show(null, null);
                expect(viewModel.isLoading()).toBeTruthy();
            });

            it('should clear all audios', function () {
                viewModel.audios([{}, {}]);
                viewModel.show(null, null);
                expect(viewModel.audios().length).toBe(0);
            });

            it('should show dialog', function () {
                viewModel.show(null, null);
                expect(dialog.show).toHaveBeenCalledWith(viewModel, constants.dialogs.audioLibrary.settings);
            });

            var getAudiosDefer;
            beforeEach(function () {
                getAudiosDefer = Q.defer();
                spyOn(getAudiosQuery, 'execute').and.returnValue(getAudiosDefer.promise);
                getAudiosDefer.resolve(audios);
            });

            it('should request audio collection', function () {
                viewModel.show(null, null);
                expect(getAudiosQuery.execute).toHaveBeenCalled();
            });

            describe('and when audios received', function () {
                it('should set isLoading to false', function (done) {
                    viewModel.show(null, null);
                    getAudiosDefer.promise.fin(function () {
                        expect(viewModel.isLoading()).toBeFalsy();
                        done();
                    });
                });

                it('should fill audios collection', function (done) {
                    viewModel.show(null, null);
                    getAudiosDefer.promise.fin(function () {
                        expect(viewModel.audios().length).toBe(audios.length);
                        done();
                    });
                });

                it('should set selectedAudio if vomeoId matches', function (done) {
                    viewModel.selectedAudio(null);
                    viewModel.show(audios[0].vimeoId, null);
                    getAudiosDefer.promise.fin(function () {
                        expect(viewModel.selectedAudio().vimeoId).toBe(audios[0].vimeoId);
                        done();
                    });
                });
            });
        });
    });
})