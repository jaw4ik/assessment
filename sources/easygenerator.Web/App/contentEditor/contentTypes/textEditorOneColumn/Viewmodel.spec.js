import constants from 'constants';
import Viewmodel from './Viewmodel';

describe('[textEditor with columns Viewmodel]', () => {

    var viewmodel;
    beforeEach(() => {
        viewmodel = new Viewmodel();
    });

    describe('data', ()=>{

        it('must be observable', ()=>{
            expect(viewmodel.data).toBeObservable();
        });

    });
    
    describe('justCreated', ()=>{

        it('must be defined', ()=>{
            expect(viewmodel.justCreated).toBeDefined();
        });

    });

    describe('hasFocus', ()=>{
        
        it('must be observable and false', ()=>{
            expect(viewmodel.hasFocus).toBeObservable();
            expect(viewmodel.hasFocus()).toBeFalsy();
        });

    });

    describe('isActive', ()=>{
        
        it('must be defined',()=>{
            expect(viewmodel.isActive).toBeDefined();
            expect(viewmodel.isActive).toBeFalsy();
        });

    });

    describe('activate', ()=>{

        it('must be function', ()=>{
            expect(viewmodel.activate).toBeFunction()
        });

        describe('when data is not defined or content is just created',()=>{
            it('must assign default text', ()=>{
                viewmodel.activate(null, true);
                expect(viewmodel.data()).toEqual([constants.templates.newEditorDefaultText]);
            });
        });

        it('must set justCreated',()=>{
            let justCreated = true;
            viewmodel.activate(null, justCreated);
            expect(viewmodel.justCreated).toEqual(justCreated);
        });
        
        it('must set data', ()=>{
            let justCreated = false;
            let data = 'newData';
            viewmodel.activate(data, justCreated);
            expect(viewmodel.data()).toEqual(data);
        });

    });

    describe('update', ()=>{

        it('must be function', ()=>{
            expect(viewmodel.update).toBeFunction()
        });

        it('must update data', ()=>{
            let data = 'oldData';
            viewmodel.data = ko.observable(data);
            let newData = 'newData';
            viewmodel.update(newData);
            expect(viewmodel.data()).toEqual(newData);
        });

    });6

    describe('saveData', ()=>{
        
        it('must be function', ()=>{
            expect(viewmodel.saveData).toBeFunction()
        });

        describe('when data is empty html', ()=>{

            it('must delete content', ()=>{
                spyOn(viewmodel, 'delete');
                viewmodel.saveData('');
                expect(viewmodel.delete).toHaveBeenCalled();
            });
            
        });

        describe('when data is not empty',()=>{
            
            it('must save data', ()=>{
                let data = 'someData';
                spyOn(viewmodel, 'save');
                viewmodel.saveData(data);
                expect(viewmodel.save).toHaveBeenCalledWith(data);
            });

        });

    });

});