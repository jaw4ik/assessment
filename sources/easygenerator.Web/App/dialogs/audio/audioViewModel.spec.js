define(['dialogs/audio/audioViewModel'], function (ViewModel) {

    describe('audio library dialog [AudioViewModel]', function () {

        it('should be constructor function', function () {
            expect(ViewModel).toBeFunction();
        });

        it('should create an instance of audio view model', function () {
            expect(new ViewModel({})).toBeObject();
        });

        describe('when create an instance', function () {

            it('title should be defined', function () {
                var viewModel = new ViewModel({
                    title: 'title'
                });
                expect(viewModel.title).toEqual('title');
            });

            it('vimeoId should be defined', function () {
                var viewModel = new ViewModel({
                    vimeoId: 'vimeoId'
                });
                expect(viewModel.vimeoId).toEqual('vimeoId');
            });
        });

    });
})