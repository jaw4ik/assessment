import Viewmodel from './Viewmodel';
import constants from 'constants';

describe('viewmodel [media editor - single video]', () => {

    let viewModel = null;

    beforeEach(() => {
        viewModel = new Viewmodel();
    });

    describe('contentType', () => {

        it(`should be equal ${constants.contentsTypes.singleVideo}`, () => {
            expect(viewModel.contentType).toBe(constants.contentsTypes.singleVideo);
        });

    });

});