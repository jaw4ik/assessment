import allowCoggnoDialog from './viewmodel';

import allowCoggnoCommand from 'commands/allowCoggnoCommand';

describe('allowCoggnoDialog:', () => {

    beforeEach(() => {
        spyOn(allowCoggnoCommand, 'execute').and.returnValue(Promise.resolve());
    });

    it('should be object', () => {
        expect(allowCoggnoDialog).toBeObject();
    });

    describe('show:', () => {

        beforeEach(() => {
            allowCoggnoDialog.isShown(false);
        });

        it('should be function', () => {
            expect(allowCoggnoDialog.show).toBeFunction();
        });

        it('should set isShown to true', () => {
            allowCoggnoDialog.show();
            expect(allowCoggnoDialog.isShown()).toBeTruthy();
        });

        describe('when callback is a function', () => {

            beforeEach(() => {
                allowCoggnoDialog.callback = null;
            });

            it('should set callback', () => {
                var f = () => {};
                allowCoggnoDialog.show(f);
                expect(allowCoggnoDialog.callback).toBe(f);
            });

        });

    });

    describe('hide:', () => {

        beforeEach(() => {
            allowCoggnoDialog.isShown(true);
        });

        it('should be function', () => {
            expect(allowCoggnoDialog.hide).toBeFunction();
        });

        it('should set isShown to false', () => {
            allowCoggnoDialog.hide();
            expect(allowCoggnoDialog.isShown()).toBeFalsy();
        });

    });

    describe('allow:', () => {

        it('should be function', () => {
            expect(allowCoggnoDialog.allow).toBeFunction();
        });

        it('should return promise', () => {
            allowCoggnoDialog.callback = null;
            expect(allowCoggnoDialog.allow()).toBePromise();
        });

        it('should execute allowCoggnoCommand', done => {
            allowCoggnoDialog.callback = null;
            allowCoggnoDialog.allow().then(() => {
                expect(allowCoggnoCommand.execute).toHaveBeenCalled();
                done();
            });
        });

        it('should hide allowCoggno dialog after command has been executed', done => {
            spyOn(allowCoggnoDialog, 'hide');
            allowCoggnoDialog.callback = null;
            allowCoggnoDialog.allow().then(() => {
                expect(allowCoggnoDialog.hide).toHaveBeenCalled();
                done();
            });
        });

        describe('when callback is null', () => {

            beforeEach(() => {
                spyOn(allowCoggnoDialog, 'hide');
                allowCoggnoDialog.callback = null;
            });

            it('should return false', done => (async () => {
                var res = await allowCoggnoDialog.allow();
                expect(res).toBeFalsy();
            })().then(done));

        });

        describe('when callback is a function', () => {

            beforeEach(() => {
                spyOn(allowCoggnoDialog, 'hide');
                allowCoggnoDialog.callback = () => {};
                spyOn(allowCoggnoDialog, 'callback');
            });

            it('should execute callback', done => {
                allowCoggnoDialog.allow().then(() => {
                    expect(allowCoggnoDialog.callback).toHaveBeenCalled();
                    done();
                });
            });

        });

    });

});