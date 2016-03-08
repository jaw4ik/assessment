import modalView from 'widgets/modalView/viewmodel';
import app from 'durandal/app';

describe('widget modalView', () => {
    beforeEach(() => {
        spyOn(app, 'trigger');
    });

    describe('viewModel:', () => {
        it('should be observable', () => {
            expect(modalView.viewModel).toBeObservable();    
        });
    });

    describe('isShown:', () => {
        it('should be observable', () => {
            expect(modalView.isShown).toBeObservable();
        });
    });

    describe('initialize', () => {
        it('should be function', () => {
            expect(modalView.initialize).toBeFunction();
        });

        it('should set viewModel', () => {
            let viewModel = {};
            modalView.viewModel(null);
            modalView.initialize(viewModel);
            expect(modalView.viewModel()).toBe(viewModel);
        });
    });

    describe('open', () => {
        it('should be function', () => {
            expect(modalView.open).toBeFunction();
        });

        it('should open modal view', () => {
            modalView.isShown(false);
            modalView.open();
            expect(modalView.isShown()).toBeTruthy();
        });

        it('should trigger modal view visibility state changed with true', () => {
            modalView.open();
            expect(app.trigger).toHaveBeenCalledWith('modal-view:visibility-state-changed', true);
        });
    });

    describe('close', () => {
        it('should be function', () => {
            expect(modalView.close).toBeFunction();
        });

        it('should close modal view', () => {
            modalView.isShown(true);
            modalView.close();
            expect(modalView.isShown()).toBeFalsy();
        });

        it('should trigger modal view visibility state changed with false', () => {
            modalView.close();
            expect(app.trigger).toHaveBeenCalledWith('modal-view:visibility-state-changed', false);
        });
    });
});