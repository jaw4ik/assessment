import TrackingDataModel from './trackingDataModel.js';
import LrsOption from './lrsOption.js';
import TextField from './textField.js';

describe('[trackingDataModel]', function () {
    let viewModel,
        xApiSettings = {
            enabled: true,
            required: false,
            selectedLrs: "default",
            lrs: {
                uri: "someLrsUrl",
                authenticationRequired: true,
                credentials: {
                    username: "username",
                    password: "password"
                }
            },
            allowedVerbs: ["started", "stopped", "passed", "failed"]
        },
        isCallbackCalled,
        callback = () => {
            isCallbackCalled = true;
        };
    
    describe('when xApiSettings and callback are not defined:', () => {
        beforeEach(() => {
            viewModel = new TrackingDataModel();
        });
        
        describe('advancedSettingsExpanded:', () => {
            it('should be false', () => {
                expect(viewModel.advancedSettingsExpanded()).toBeFalsy();
            });
        });

        describe('enableXAPI:', () => {
            it('should be true', () => {
                expect(viewModel.enableXAPI()).toBeTruthy();
            });
        });

        describe('allowToSkipTracking:', () => {
            it('should be true', () => {
                expect(viewModel.allowToSkipTracking()).toBeTruthy();
            });
        });

        describe('lrsOptions:', () => {
            it('should have length 2', () => {
                expect(viewModel.lrsOptions.length).toBe(2);
            });

            it('should have LrsOption as items', () => {
                expect(viewModel.lrsOptions[0]).toEqual(jasmine.any(LrsOption));
                expect(viewModel.lrsOptions[1]).toEqual(jasmine.any(LrsOption));
            });

            it('should set isSelected to default option', () => {
                expect(viewModel.lrsOptions[0].name).toBe("default");
                expect(viewModel.lrsOptions[0].isSelected()).toBeTruthy();
                expect(viewModel.lrsOptions[1].name).toBe("custom");
                expect(viewModel.lrsOptions[1].isSelected()).toBeFalsy();
            });
        });

        describe('selectedLrs:', () => {
            it('should be the name of selected lrs option', () => {
                viewModel.lrsOptions[0].isSelected(false);
                viewModel.lrsOptions[1].isSelected(true);
                expect(viewModel.selectedLrs()).toBe(viewModel.lrsOptions[1].name);
            });
        });

        describe('customLrsEnabled:', () => {
            describe('when xapi is enabled and custom lrs is selected', () => {
                beforeEach(() => {
                    viewModel.lrsOptions[0].isSelected(false);
                    viewModel.lrsOptions[1].isSelected(true);
                    viewModel.enableXAPI(true);
                });

                it('should be true', () => {
                    expect(viewModel.customLrsEnabled()).toBeTruthy();
                });
            });

            describe('when xapi is not enabled and custom lrs is selected', () => {
                beforeEach(() => {
                    viewModel.lrsOptions[0].isSelected(false);
                    viewModel.lrsOptions[1].isSelected(true);
                    viewModel.enableXAPI(false);
                });

                it('should be false', () => {
                    expect(viewModel.customLrsEnabled()).toBeFalsy();
                });
            });

            describe('when xapi is enabled and default lrs is selected', () => {
                beforeEach(() => {
                    viewModel.lrsOptions[0].isSelected(true);
                    viewModel.lrsOptions[1].isSelected(false);
                    viewModel.enableXAPI(true);
                });

                it('should be false', () => {
                    expect(viewModel.customLrsEnabled()).toBeFalsy();
                });
            });
        });
    
        describe('lrsUrl:', () => {
            it('should be TextField', () => {
                expect(viewModel.lrsUrl).toEqual(jasmine.any(TextField));
            });

            it('should be empty', () => {
                expect(viewModel.lrsUrl.value()).toBe('');
            });
        });

        describe('lapLogin:', () => {
            it('should be TextField', () => {
                expect(viewModel.lapLogin).toEqual(jasmine.any(TextField));
            });

            it('should be empty', () => {
                expect(viewModel.lapLogin.value()).toBe('');
            });
        });

        describe('lapPassword:', () => {
            it('should be TextField', () => {
                expect(viewModel.lapPassword).toEqual(jasmine.any(TextField));
            });

            it('should be empty', () => {
                expect(viewModel.lapPassword.value()).toBe('');
            });
        });
    
        describe('authenticationRequired:', () => {
            it('should be false', () => {
                expect(viewModel.authenticationRequired()).toBeFalsy();
            });
        });

        describe('credentialsEnabled:', () => {
            describe('when custom lrs enabled and authentication is required', () => {
                beforeEach(() => {
                    viewModel.lrsOptions[0].isSelected(false);
                    viewModel.lrsOptions[1].isSelected(true);
                    viewModel.enableXAPI(true);
                    viewModel.authenticationRequired(true)
                });

                it('should be true', () => {
                    expect(viewModel.credentialsEnabled()).toBeTruthy();
                });
            });

            describe('when default lrs enabled', () => {
                beforeEach(() => {
                    viewModel.lrsOptions[0].isSelected(true);
                    viewModel.lrsOptions[1].isSelected(false);
                    viewModel.enableXAPI(true);
                    viewModel.authenticationRequired(true)
                });

                it('should be false', () => {
                    expect(viewModel.credentialsEnabled()).toBeFalsy();
                });
            });

            describe('when authentication is not required', () => {
                beforeEach(() => {
                    viewModel.lrsOptions[0].isSelected(false);
                    viewModel.lrsOptions[1].isSelected(true);
                    viewModel.enableXAPI(true);
                    viewModel.authenticationRequired(false)
                });

                it('should be false', () => {
                    expect(viewModel.credentialsEnabled()).toBeFalsy();
                });
            });
        });
    
        describe('statements:', () => {
            it('should have all statements types enabled', () => {
                expect(viewModel.statements['started']()).toBeTruthy();
                expect(viewModel.statements['stopped']()).toBeTruthy();
                expect(viewModel.statements['mastered']()).toBeTruthy();
                expect(viewModel.statements['answered']()).toBeTruthy();
                expect(viewModel.statements['passed']()).toBeTruthy();
                expect(viewModel.statements['experienced']()).toBeTruthy();
                expect(viewModel.statements['failed']()).toBeTruthy();
            });
        });

        describe('onSettingsChanged:', () => {
            it('should be undefined', () => {
                expect(viewModel.onSettingsChanged).not.toBeDefined();
            });
        });
    });

    describe('when xApiSettings and callback are defined', () => {
        beforeEach(() => {
            viewModel = new TrackingDataModel(xApiSettings, callback);
        });
                
        describe('enableXAPI:', () => {
            it('should be the same as xApiSettings enabled', () => {
                expect(viewModel.enableXAPI()).toBe(xApiSettings.enabled);
            });
        });

        describe('allowToSkipTracking:', () => {
            it('should be the different from xApiSettings required', () => {
                expect(viewModel.allowToSkipTracking()).toBe(!xApiSettings.required);
            });
        });
        
        describe('selectedLrs:', () => {
            it('should be the same as xApiSettings selectedLrs', () => {
                expect(viewModel.selectedLrs()).toBe(xApiSettings.selectedLrs);
            });
        });
        
        describe('lrsUrl:', () => {
            it('should be the same as xApiSettings lrs uri', () => {
                expect(viewModel.lrsUrl.value()).toBe(xApiSettings.lrs.uri);
            });
        });

        describe('lapLogin:', () => {
            it('should be the same as xApiSettings lrs credentials username', () => {
                expect(viewModel.lapLogin.value()).toBe(xApiSettings.lrs.credentials.username);
            });
        });

        describe('lapPassword:', () => {
            it('should be the same as xApiSettings lrs credentials password', () => {
                expect(viewModel.lapPassword.value()).toBe(xApiSettings.lrs.credentials.password);
            });
        });
    
        describe('authenticationRequired:', () => {
            it('should be the same as xApiSettings lrs authenticationRequired', () => {
                expect(viewModel.authenticationRequired()).toBe(xApiSettings.lrs.authenticationRequired);
            });
        });

        describe('statements:', () => {
            it('should have xApiSettings allowedVerbs enabled', () => {
                expect(viewModel.statements['started']()).toBeTruthy();
                expect(viewModel.statements['stopped']()).toBeTruthy();
                expect(viewModel.statements['mastered']()).toBeFalsy();
                expect(viewModel.statements['answered']()).toBeFalsy();
                expect(viewModel.statements['passed']()).toBeTruthy();
                expect(viewModel.statements['experienced']()).toBeFalsy();
                expect(viewModel.statements['failed']()).toBeTruthy();
            });
        });

        describe('onSettingsChanged:', () => {
            it('should be callback', () => {
                expect(viewModel.onSettingsChanged).toBe(callback);
            });
        });
    });

    describe('settingsChanged:', () => {
        describe('when onSettingsChanged is function', () => {
            beforeEach(() => {
                viewModel = new TrackingDataModel(xApiSettings, callback);
            });

            it('should call onSettingsChanged', () => {
                isCallbackCalled = false;
                viewModel.settingsChanged();
                expect(isCallbackCalled).toBeTruthy();
            });
        });

        describe('when onSettingsChanged is undefined', () => {
            beforeEach(() => {
                viewModel = new TrackingDataModel();
            });

            it('should not call onSettingsChanged', () => {
                isCallbackCalled = false;
                viewModel.settingsChanged();
                expect(isCallbackCalled).toBeFalsy();
            });
        });
    });

    describe('toggleAdvancedSettings:', () => {
        beforeEach(() => {
            viewModel = new TrackingDataModel(xApiSettings, callback);
        });

        it('should toggle advancedSettingsExpanded', () => {
            viewModel.advancedSettingsExpanded(true);
            viewModel.toggleAdvancedSettings();
            expect(viewModel.advancedSettingsExpanded()).toBeFalsy();
        });
    });

    describe('toggleAuthenticationRequired:', () => {
        beforeEach(() => {
            viewModel = new TrackingDataModel(xApiSettings, callback);
        });

        it('should toggle authenticationRequired', () => {
            viewModel.authenticationRequired(true);
            viewModel.toggleAuthenticationRequired();
            expect(viewModel.authenticationRequired()).toBeFalsy();
        });

        it('should call settingsChanged', () => {
            isCallbackCalled = false;
            viewModel.toggleAuthenticationRequired();
            expect(isCallbackCalled).toBeTruthy();
        });
    });

    describe('selectLrs:', () => {
        beforeEach(() => {
            viewModel = new TrackingDataModel(xApiSettings, callback);
            viewModel.lrsOptions[0].isSelected(true);
            viewModel.lrsOptions[1].isSelected(false);
        });

        it('should change selected lrs option', () => {
            viewModel.selectLrs(viewModel.lrsOptions[1]);

            expect(viewModel.lrsOptions[0].isSelected()).toBeFalsy();
            expect(viewModel.lrsOptions[1].isSelected()).toBeTruthy();
        });

        it('should call settingsChanged', () => {
            isCallbackCalled = false;
            viewModel.selectLrs(viewModel.lrsOptions[1]);
            expect(isCallbackCalled).toBeTruthy();
        });
    });

    describe('getData:', () => {
        beforeEach(() => {
            viewModel = new TrackingDataModel(xApiSettings, callback);

            viewModel.enableXAPI(false);
            viewModel.allowToSkipTracking(false);

            viewModel.lrsOptions[0].isSelected(true);
            viewModel.lrsOptions[1].isSelected(false);
            
            viewModel.lrsUrl.value('url1');
            viewModel.authenticationRequired(true);
            viewModel.lapLogin.value('user1');
            viewModel.lapPassword.value('password1');

            viewModel.statements['started'](true);
            viewModel.statements['stopped'](true);
            viewModel.statements['mastered'](false);
            viewModel.statements['answered'](false);
            viewModel.statements['passed'](false);
            viewModel.statements['experienced'](false);
            viewModel.statements['failed'](false);
        });

        it('should return json settings', () => {
            let result = viewModel.getData();

            expect(result.enabled).toBeFalsy();
            expect(result.required).toBeTruthy();
            expect(result.selectedLrs).toBe('default');
            expect(result.lrs.uri).toBe('url1');
            expect(result.lrs.authenticationRequired).toBeTruthy();
            expect(result.lrs.credentials.username).toBe('user1');
            expect(result.lrs.credentials.password).toBe('password1');
            expect(result.allowedVerbs.length).toBe(2);
            expect(result.allowedVerbs[0]).toBe('started');
            expect(result.allowedVerbs[1]).toBe('stopped');
        });
    });
});