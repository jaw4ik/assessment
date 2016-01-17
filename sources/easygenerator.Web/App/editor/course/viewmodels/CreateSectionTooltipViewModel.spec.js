import userContext from 'userContext';
import clientContext from 'clientContext';
import CreateSectionTooltip from './CreateSectionTooltipViewModel';

describe('[CreateSectionTooltipViewModel]', () => {
    let viewModel;

    beforeEach(() => {
        viewModel = new CreateSectionTooltip();
        userContext.identity = {email: 'userEmail'};
    });

    it('should be function', () => {
        expect(CreateSectionTooltip).toBeFunction();
    });

    describe('visible:', () => {
        it('should be observable', () => {
            expect(viewModel.visible).toBeObservable();
        });
    });

    describe('hide:', () => {
        beforeEach(() => {
            spyOn(clientContext, 'set');
        });

        it('should be function', () => {
            expect(viewModel.hide).toBeFunction();
        });

        describe('when is visible', () => {
            beforeEach(() => {
                viewModel.visible(true);
            });

            it('should set hide', () => {
                viewModel.hide();
                expect(viewModel.visible()).toBeFalsy();
            });

            it('should save closed state in client context', () => {
                viewModel.hide();
                expect(clientContext.set).toHaveBeenCalledWith('userEmail:createSectionTooltipClosed', true);
            });
        });

        describe('when is hidden', () => {
            beforeEach(() => {
                viewModel.visible(false);
            });

            it('should not save closed state', () => {
                viewModel.hide();
                expect(clientContext.set).not.toHaveBeenCalled();
            });
        });
    });

    describe('activate:', () => {
        it('should be function', () => {
            expect(viewModel.activate).toBeFunction();
        });

        describe('when closed state is saved', () => {
            beforeEach(() => {
                spyOn(clientContext, 'get').and.returnValue(true);
            });

            it('should hide tooltip', () => {
                viewModel.activate();
                expect(viewModel.visible()).toBeFalsy();
            });
        });

        describe('when closed state is not saved', () => {
            beforeEach(() => {
                spyOn(clientContext, 'get').and.returnValue(undefined);
            });

            it('should show tooltip', () => {
                viewModel.activate();
                expect(viewModel.visible()).toBeTruthy();
            });
        });
    });
});