import Viewmodel from './Viewmodel';
import constants from 'constants';

describe('viewmodel [media editor - video with text]', () => {

    let viewModel = null;

    beforeEach(() => {
        viewModel = new Viewmodel();
    });

    describe('contentType', () => {

        it(`should be equal ${constants.contentsTypes.videoWithText}`, () => {
            expect(viewModel.contentType).toBe(constants.contentsTypes.videoWithText);
        });

    });

});