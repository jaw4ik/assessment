import ContentTypeBase from './ContentTypeBase';

describe('[ContentTypeBase]', () => {

    let viewModel = null;

    beforeEach(() => {
        viewModel = new ContentTypeBase();
    });


    describe('class inherited from ContentTypeBase', () => {
        
        it('should contains activate and update function', () => {
            class SomeContentType extends ContentTypeBase {}

            let someInstance = new SomeContentType();
            expect(someInstance.activate).toBeFunction();
            expect(someInstance.update).toBeFunction();
        });

    });

    describe('activate:', () => {

        let id, data, justCreated;

        beforeEach(() => {
            id = '123';
            data = 'some data';
            justCreated = false;
        });

        it('should initialize data with value', () => {
            viewModel.activate(data, justCreated);
            expect(viewModel.data()).toBe(data);
        });

        it('should initialize jastCreated with value', () => {
            viewModel.activate(data, justCreated);
            expect(viewModel.justCreated).toBeFalsy();
        });

        it('should initialize id with value', () => {
            viewModel.activate(data, justCreated, id);
            expect(viewModel.id).toEqual('123');
        });

    });

    describe('update', () => {

        it('should update data value', () => {
            let newData = 'new data';
            viewModel.data('some data');
            viewModel.update(newData);
            expect(viewModel.data()).toBe(newData);
        });
    
    });
});