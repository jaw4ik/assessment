import bus from './bus';

describe('design event bus', () => {

    describe('on:', () => {
        it('should be function', () => {
            expect(bus.on).toBeFunction();
        });
    });

    describe('trigger:', () => {
        it('should be function', () => {
            expect(bus.trigger).toBeFunction();
        });
    });

});