﻿define(['viewmodels/audios/AudioViewModel'], function (ViewModel) {

    describe('[AudioViewModel]', function () {


        it('should be constructor function', function () {
            expect(ViewModel).toBeFunction();
        });

        it('should create an instance of audio view model', function () {
            expect(new ViewModel({})).toBeObject();
        });


        describe('when create an instance', function () {

            it('id should be defined', function () {
                var viewModel = new ViewModel({
                    id: 'id'
                });
                expect(viewModel.id).toEqual('id');
            });

            it('title should be defined', function () {
                var viewModel = new ViewModel({
                    title: 'title'
                });
                expect(viewModel.title).toEqual('title');
            });

            it('vimeoId should be observable', function () {
                var viewModel = new ViewModel({
                    vimeoId: 'vimeoId'
                });
                expect(viewModel.vimeoId).toBeObservable();
                expect(viewModel.vimeoId()).toEqual('vimeoId');
            });

            it('progress should be observable', function () {
                var viewModel = new ViewModel({
                    progress: 2
                });
                expect(viewModel.progress).toBeObservable();
                expect(viewModel.progress()).toEqual(2);
            });

            it('status should be observable', function () {
                var viewModel = new ViewModel({
                    status: 'not started'
                });
                expect(viewModel.status).toBeObservable();
                expect(viewModel.status()).toEqual('not started');
            });

            it('duration should be computed', function () {
                var viewModel = new ViewModel({
                    duration: 0
                });
                expect(viewModel.duration).toBeComputed();
            });

            describe('when duration is not defined', function () {

                it('should be \'--:--\'', function () {
                    var viewModel = new ViewModel({
                        duration: undefined
                    });
                    expect(viewModel.duration()).toEqual('--:--');
                });

            });

            describe('when duration is less then a minute', function () {

                it('should be 00:ss', function () {
                    var viewModel = new ViewModel({
                        duration: 35
                    });
                    expect(viewModel.duration()).toEqual('00:35');
                });

            });

            describe('when duration is more then a minute', function () {

                it('should be mm:ss', function () {
                    var viewModel = new ViewModel({
                        duration: 65
                    });
                    expect(viewModel.duration()).toEqual('01:05');
                });

            });

        });

    });
})