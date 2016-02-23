import widget from './viewmodel';

describe('widget cursorTooltip:', function () {

    describe('isVisible', function () {

        it('should be observable', function() {
            expect(widget.isVisible).toBeObservable();
        });

    });

    describe('text:', function() {

        it('should be observable', function() {
            expect(widget.text).toBeObservable();
        });

    });

    describe('show:', function() {

        it('should be function', function() {
            expect(widget.show).toBeFunction();
        });

        it('should show cursor tooltip', function() {
            widget.isVisible(false);
            widget.show();
            expect(widget.isVisible()).toBeTruthy();
        });

    });

    describe('hide:', function() {

        it('should be function', function() {
            expect(widget.hide).toBeFunction();
        });

        it('should hide cursor tooltip', function() {
            widget.isVisible(true);
            widget.hide();
            expect(widget.isVisible()).toBeFalsy();
        });

    });

    describe('changeText:', function () {

        it('should be function', function() {
            expect(widget.changeText).toBeFunction();
        });

    });

});
