import viewModel from './deleteTheme';

import eventTracker from 'eventTracker';
import constants from 'constants';
import themeRepository from 'repositories/themeRepository';
import dialog from 'widgets/dialog/viewmodel';

describe('dialog [deleteTheme]', () => {

    var theme = {
        id: 'id',
        name: 'name'
    };

    beforeEach(() => {
        spyOn(eventTracker, 'publish');
        spyOn(dialog, 'show');
        spyOn(dialog, 'close');
    });

    describe('isDeleting:', () => {
        it('should be observable', () => {
            expect(viewModel.isDeleting).toBeObservable();
        });
    });

    describe('themeId:', () => {
        it('should be defined', () => {
            expect(viewModel.themeId).toBeDefined();
        });
    });

    describe('themeName:', () => {
        it('should be observable', () => {
            expect(viewModel.themeName).toBeObservable();
        });
    });

    describe('show:', () => {

        it('should set themeId', () => {
            viewModel.themeId = '';
            viewModel.show(theme.id, theme.name);
            expect(viewModel.themeId).toBe(theme.id);
        });

        it('should set themeName', () => {
            viewModel.themeName('');
            viewModel.show(theme.id, theme.name);
            expect(viewModel.themeName()).toBe(theme.name);
        });

        it('should show dialog', () => {
            viewModel.show(theme.id, theme.name);
            expect(dialog.show).toHaveBeenCalledWith(viewModel, constants.dialogs.deleteItem.settings);
        });
    });

    describe('cancel:', () => {
        it('should publish \'Cancel delete theme\' event', () => {
            viewModel.cancel();
            expect(eventTracker.publish).toHaveBeenCalledWith('Cancel delete theme');
        });

        it('should close dialog', () => {
            viewModel.cancel();
            expect(dialog.close).toHaveBeenCalled();
        });
    });

    describe('deleteTheme:', () => {
        describe('when theme is deleting', () => {
            beforeEach(() => {
                spyOn(themeRepository, 'remove').and.returnValue(Promise.resolve());
                viewModel.isDeleting(true);
            });

            it('should not publish delete event', () => {
                viewModel.deleteTheme();
                expect(eventTracker.publish).not.toHaveBeenCalled();
            });

            it('should not delete theme', () => {
                viewModel.deleteTheme();
                expect(themeRepository.remove).not.toHaveBeenCalled();
            });
        });



        it('should set isDeleting to true', () => {
            viewModel.isDeleting(false);
            spyOn(themeRepository, 'remove').and.returnValue(Promise.resolve());

            viewModel.deleteTheme();
            expect(viewModel.isDeleting()).toBeTruthy();
        });

        it('should publish \'Confirm delete theme\' event', () => {
            viewModel.isDeleting(false);
            spyOn(themeRepository, 'remove').and.returnValue(Promise.resolve());

            viewModel.deleteTheme();
            expect(eventTracker.publish).toHaveBeenCalledWith('Confirm delete theme');
        });

        it('should remove theme', () => {
            viewModel.isDeleting(false);
            spyOn(themeRepository, 'remove').and.returnValue(Promise.resolve());

            viewModel.deleteTheme();
            expect(themeRepository.remove).toHaveBeenCalledWith(viewModel.themeId);
        });

        describe('when theme is removed successfully', () => {
            beforeEach(() => {
                viewModel.isDeleting(false);
                spyOn(themeRepository, 'remove').and.returnValue(Promise.resolve());
            });

            it('should close dialog', done => {
                viewModel.deleteTheme()
                    .then(() => {
                        expect(dialog.close).toHaveBeenCalled();
                        done();    
                    });
            });

            it('should set isDeleting to false', done => {
                viewModel.deleteTheme()
                    .then(() => {
                        expect(viewModel.isDeleting()).toBeFalsy();
                        done();
                    });
            });
        });

        describe('when theme is not removed', () => {
            beforeEach(() => {
                viewModel.isDeleting(false);
                spyOn(themeRepository, 'remove').and.returnValue(Promise.reject());
            });

            it('should set isDeleting to false', done => {
                viewModel.deleteTheme()
                    .then(() => {
                        expect(viewModel.isDeleting()).toBeFalsy();
                        done();
                    });
            });
        });
    });
});
