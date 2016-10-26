import viewModel from 'fonts.js'

describe('fonts', () => {
    describe('load:', () => {
        it('should be defined', done => {

            expect(viewModel.load).toBeDefined();
            done();
        });

        it('should be a function', done => {

            expect(viewModel.load).toBeFunction();
            done();
        });
    });
});