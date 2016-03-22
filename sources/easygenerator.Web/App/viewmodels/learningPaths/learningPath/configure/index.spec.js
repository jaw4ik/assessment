import notify from 'notify';
import localizationManager from 'localization/localizationManager';
import * as getSettings from './commands/getSettings';
import * as saveSettings  from './commands/saveSettings';
import TrackingDataModel from './trackingDataModel.js';
import viewModel from './index.js';


describe('[configure learning path]', () => {
    let settings = { xApi:{} },
        learningPathId = 'learningPathId';

    beforeEach(() => {
        spyOn(notify, 'saved');
        spyOn(notify, 'error');
        spyOn(localizationManager, 'localize');
    });

    describe('activate:', () => {
        it('should set learning path id', done => {
            spyOn(getSettings, 'execute').and.returnValue(Promise.resolve(settings));
            viewModel.learningPathId = '';
            viewModel.activate(learningPathId).then(() => {
                expect(viewModel.learningPathId).toBe(learningPathId);
                done();
            });
        });

        it('should get learning path settings from server', done => {
            spyOn(getSettings, 'execute').and.returnValue(Promise.resolve(settings));
            viewModel.learningPathId = '';
            viewModel.activate(learningPathId).then(() => {
                expect(getSettings.execute).toHaveBeenCalledWith(learningPathId);
                done();
            });
        });

        describe('and when response is successful and contains xapi', () => {
            beforeEach(() => {
                spyOn(getSettings, 'execute').and.returnValue(Promise.resolve(settings));
            });

            it('should set trackingData', done => {
                viewModel.trackingData = null;
                viewModel.activate(learningPathId).then(() => {
                    expect(viewModel.trackingData).toEqual(jasmine.any(TrackingDataModel));
                    done();
                });
            });
        });

        describe('and when response is not successful', () =>{
            beforeEach(() => {
                spyOn(getSettings, 'execute').and.returnValue(Promise.reject());
            });

            it('should notify error', done => {
                viewModel.activate(learningPathId).then(() => {
                    expect(notify.error).toHaveBeenCalled();
                    done();
                });
            });
        });

        describe('and when response does not contain xapi', () => {
            it('should notify error', done => {
                viewModel.activate(learningPathId).then(() => {
                    expect(notify.error).toHaveBeenCalled();
                    done();
                });
            });
        });
    });

    describe('save:', () => {
        beforeEach(() => {
            viewModel.trackingData = {
                getData: () => {
                    return {};
                }
            };

        });

        it('should save settings on server', done => {
            spyOn(saveSettings, 'execute').and.returnValue(Promise.resolve());
            viewModel.save().then(() => {
                expect(saveSettings.execute).toHaveBeenCalledWith(learningPathId, { xApi: { }});
                done();
            });
        });

        describe('and when response is successful', () => {
            it('should notify saved', done => {
                spyOn(saveSettings, 'execute').and.returnValue(Promise.resolve());
                viewModel.save().then(() => {
                    expect(notify.saved).toHaveBeenCalled();
                    done();
                });
            });
        });

        describe('and when response is not successful', () => {
            it('should notify error', done => {
                spyOn(saveSettings, 'execute').and.returnValue(Promise.reject());
                viewModel.save().then(() => {
                    expect(notify.error).toHaveBeenCalled();
                    done();
                });
            });
        });
    });
});