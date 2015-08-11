define(['viewmodels/audios/UploadAudioViewModel', 'viewmodels/audios/UploadAudioModel'], function (ViewModel, Model) {

    describe('[UploadAudioViewModel]', function () {

        var constants = require('constants');

        it('should be constructor function', function () {
            expect(ViewModel).toBeFunction();
        });

        it('should create an instance of audio view model', function () {
            expect(new ViewModel(new Model({ name: 'sample.wav' }))).toBeObject();
        });

        it('id should be undefined', function () {
            var viewModel = new ViewModel(new Model({ name: 'sample.wav' }));

            expect(viewModel.id).toBeUndefined();
        });

        it('title should be defined', function () {
            var viewModel = new ViewModel(new Model({ name: 'sample.wav' }));

            expect(viewModel.title).toEqual('sample');
        });

        it('vimeoId should be observable', function () {
            var viewModel = new ViewModel(new Model({ name: 'sample.wav' }));

            expect(viewModel.vimeoId).toBeObservable();
        });

        it('progress should be observable', function () {
            var viewModel = new ViewModel(new Model({ name: 'sample.wav' }));

            expect(viewModel.progress).toBeObservable();
            expect(viewModel.progress()).toEqual(0);
        });

        it('status should be observable', function () {
            var viewModel = new ViewModel(new Model({ name: 'sample.wav' }));

            expect(viewModel.status).toBeObservable();
            expect(viewModel.status()).toEqual(constants.storage.audio.statuses.inProgress);
        });

        it('duration should be computed', function () {
            var viewModel = new ViewModel(new Model({ name: 'sample.wav' }));
            expect(viewModel.duration).toBeComputed();
        });

        describe('when duration is not defined', function () {

            it('should be \'--:--\'', function () {
                var viewModel = new ViewModel(new Model({ name: 'sample.wav' }));
                viewModel.duration(undefined);
                expect(viewModel.duration()).toEqual('--:--');
            });

        });

        describe('when duration is less then a minute', function () {

            it('should be 00:ss', function () {
                var viewModel = new ViewModel(new Model({ name: 'sample.wav' }));
                viewModel.duration(35);
                expect(viewModel.duration()).toEqual('00:35');
            });

        });

        describe('when duration is more then a minute', function () {

            it('should be mm:ss', function () {
                var viewModel = new ViewModel(new Model({ name: 'sample.wav' }));
                viewModel.duration(65);
                expect(viewModel.duration()).toEqual('01:05');
            });

        });

        describe('when progress reported', function () {
            var model, viewModel;

            beforeEach(function (done) {
                model = new Model({ name: 'sample.wav' });
                viewModel = new ViewModel(model);

                model.on('progress').then(function () {
                    done();
                });
                model.trigger('progress', 55);
            });


            it('should update progress', function () {
                expect(viewModel.progress()).toEqual(55);
            });

        });

        describe('when success reported', function () {
            var model, viewModel;

            beforeEach(function (done) {
                model = new Model({ name: 'sample.wav' });
                viewModel = new ViewModel(model);

                model.on('success').then(function () {
                    done();
                });
                model.trigger('success', {
                    id: 'id',
                    vimeoId: 'vimeoId',
                    duration: 5
                });
            });

            it('should update id', function () {
                expect(viewModel.id).toEqual('id');
            });

            it('should update vimeoId', function () {
                expect(viewModel.vimeoId()).toEqual('vimeoId');
            });

            it('should update duration', function () {
                expect(viewModel.duration()).toEqual('00:05');
            });

            it('should update status', function () {
                expect(viewModel.status()).toEqual(constants.storage.audio.statuses.loaded);
            });
        });

        describe('when error reported', function () {
            var model, viewModel;

            beforeEach(function (done) {
                model = new Model({ name: 'sample.wav' });
                viewModel = new ViewModel(model);

                model.on('error').then(function () {
                    done();
                });
                model.trigger('error', 'reason');
            });

            it('should update status', function () {
                expect(viewModel.status()).toEqual(constants.storage.audio.statuses.failed);
            });
        });

    });
})