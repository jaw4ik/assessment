import Viewmodel from './Viewmodel';
import constants from 'constants';

describe('viewmodel [media editor - video in the right]', () => {

    let viewModel = null;

    beforeEach(() => {
        viewModel = new Viewmodel();
    });

    describe('contentType', () => {

        it(`should be equal ${constants.contentsTypes.videoInTheRight}`, () => {
            expect(viewModel.contentType).toBe(constants.contentsTypes.videoInTheRight);
        });

    });

});