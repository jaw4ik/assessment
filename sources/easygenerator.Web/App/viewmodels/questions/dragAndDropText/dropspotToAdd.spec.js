import dropspotToAdd from './dropspotToAdd';

describe('[dropspotToAdd]', function () {

    it('should be observable', function () {
        expect(dropspotToAdd).toBeObservable();
    });

    describe('isVisible:', function () {

        it('should be observable', function () {
            expect(dropspotToAdd.isVisible).toBeObservable();
        });

    });

    describe('hasFocus:', function () {

        it('should be observable', function () {
            expect(dropspotToAdd.hasFocus).toBeObservable();
        });

    });

    describe('show:', function () {

        it('should be function', function () {
            expect(dropspotToAdd.show).toBeFunction();
        });

        it('should change isVisible to true', function () {
            dropspotToAdd.isVisible(false);
            dropspotToAdd.show();

            expect(dropspotToAdd.isVisible()).toBeTruthy();
        });

        it('should change hasFocus to true', function () {
            dropspotToAdd.hasFocus(false);
            dropspotToAdd.show();

            expect(dropspotToAdd.hasFocus()).toBeTruthy();
        });

    });

    describe('hide:', function () {

        it('should be function', function () {
            expect(dropspotToAdd.hide).toBeFunction();
        });

        it('should change isVisible to false', function () {
            dropspotToAdd.isVisible(true);
            dropspotToAdd.hide();

            expect(dropspotToAdd.isVisible()).toBeFalsy();
        });

    });

    describe('clear:', function () {

        it('should be function', function () {
            expect(dropspotToAdd.clear).toBeFunction();
        });

        it('should clear dropspotToAdd text', function () {
            dropspotToAdd("dropspot");
            dropspotToAdd.clear();

            expect(dropspotToAdd()).toEqual("");
        });

    });

    describe('trim:', function () {

        it('should be function', function () {
            expect(dropspotToAdd.trim).toBeFunction();
        });

        it('should trim dropspotToAdd text', function () {
            dropspotToAdd("          dropspot          ");
            dropspotToAdd.trim();

            expect(dropspotToAdd()).toEqual("dropspot");
        });
    });

    describe('isValid:', function () {

        describe('when text is undefined', function () {

            it('should be false', function () {
                dropspotToAdd(undefined);
                expect(dropspotToAdd.isValid()).toBeFalsy();
            });

        });

        describe('when text is null', function () {

            it('should be false', function () {
                dropspotToAdd(null);
                expect(dropspotToAdd.isValid()).toBeFalsy();
            });

        });

        describe('when text is empty', function () {

            it('should be false', function () {
                dropspotToAdd("");
                expect(dropspotToAdd.isValid()).toBeFalsy();
            });

        });

        describe('when text is whitespace', function () {

            it('should be false', function () {
                dropspotToAdd("    ");
                expect(dropspotToAdd.isValid()).toBeFalsy();
            });

        });

    });

});
