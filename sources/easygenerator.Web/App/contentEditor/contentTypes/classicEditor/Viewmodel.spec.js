import Viewmodel from './Viewmodel';

import constants from 'constants';

describe('[classicEditor Viewmodel]', () => {

    var viewmodel;
    beforeEach(() => {
        viewmodel = new Viewmodel();
    });

    describe('localizationManager:', () => {

        it('should be defined', () => {
            expect(viewmodel.localizationManager).toBeDefined();
        });

    });

    describe('eventTracker:', () => {

        it('should be defined', () => {
            expect(viewmodel.eventTracker).toBeDefined();
        });

    });

    describe('autosaveInterval:', () => {

        it('should be defined', () => {
            expect(viewmodel.autosaveInterval).toBe(constants.autosaveTimersInterval.learningContent);
        });

    });

    describe('activate:', () => {

        it('should set data', () => {
            let newData = 'newData';
            viewmodel.data(null);
            viewmodel.activate(newData);
            expect(viewmodel.data()).toBe(newData);
        });

        describe('when new data is empty and justCreated is true', () => {

            it('should set hasFocus to true', () => {
                viewmodel.hasFocus(false);
                viewmodel.activate('', true);
                expect(viewmodel.hasFocus()).toBeTruthy();
            });

        });

    });

    describe('update:', () => {

        it('should set data', () => {
            let newData = 'newData';
            viewmodel.data(null);
            viewmodel.update(newData);
            expect(viewmodel.data()).toBe(newData);
        });

    });

    describe('saveData:', () => {

        let dataToSave = 'dataToSave';
        it('should call save function', () => {
            spyOn(viewmodel, 'save');
            viewmodel.saveData(dataToSave);
            expect(viewmodel.save).toHaveBeenCalledWith(dataToSave);
        });

        describe('when data is empty', () => {

            beforeEach(() => {
                dataToSave = '';
            });

            it('should call delete function', () => {
                spyOn(viewmodel, 'delete');
                viewmodel.saveData(dataToSave);
                expect(viewmodel.delete).toHaveBeenCalled();
            });

        });

    });

});