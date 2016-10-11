import Viewmodel from './Viewmodel';
import constants from 'constants';

describe('viewmodel [image editor one column]', () => {

    let viewModel = null;

    beforeEach(() => {
        viewModel = new Viewmodel();
    });

    describe('contentType', () => {

        it(`should be equal ${constants.contentsTypes.imageEditorTwoColumns}`, () => {
            expect(viewModel.contentType).toBe(constants.contentsTypes.imageEditorTwoColumns);
        });

    });

    describe('activate:', () => {

        let data, justCreated;

        beforeEach(() => {
            data = 'some data';
            justCreated = false;
        });

        it('should initialize data value', () => {
            viewModel.activate(data, justCreated);
            expect(viewModel.data()).toBe(data);
        });

        it('should initialize justCreated value', () => {
            viewModel.activate(data, justCreated);
            expect(viewModel.justCreated).toBeFalsy();
        });

    });

    describe('update:', () => {

        it('should be function', () => {
            expect(viewModel.update).toBeFunction();
        });

        it('should update data value', () => {
            let newData = 'some new data';
            viewModel.data('some data');
            viewModel.update(newData);
            expect(viewModel.data()).toBe(newData);
        });

    });

});