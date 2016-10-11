import ko from 'knockout';
import _ from 'underscore';
import ViewModel, { errors } from './viewModel';
import binder from 'binder';
import constants from 'constants';
import { getDefaultDataByType } from './components/defaultDataGenerator';
import contentEditorParser from './components/Parser';

describe('viewmodel [imageEditor]', () => {

    let viewModel = null;
    let data, justCreated, contentType, callbacks;
    beforeEach(() => {
        viewModel = new ViewModel();
        spyOn(binder, 'bindClass');
        data = ko.observable('');
        contentType = constants.contentsTypes.imageEditorOneColumn;
        justCreated = true;
        callbacks = {
            startEditing: () => {},
            enableOverlay: () => {},
            disableOverlay: () => {},
            save: () => {},
            editingEndedEventTrigger: ko.observable(() => {})
        };
    });

    it('should return ctor function',
        () => {
            expect(ViewModel).toBeFunction();
        });

    describe('ctor',
        () => {
            it('should bind class',
                () => {
                    let viewmodel = new ViewModel();
                    expect(binder.bindClass).toHaveBeenCalled();
                });

            it('should initialize fields',
                () => {
                    expect(viewModel.instances).toBeObservableArray();
                    expect(viewModel.isEditing).toBeObservable();
                    expect(viewModel.isEditing()).toBeFalsy();
                    expect(viewModel.contentType).toBe('');
                    expect(viewModel.callbacks).toBe(null);
                });
        });

    describe('activate:',
        () => {

            describe('when data is not a function',
                () => {
                    it(`should throw an exception -> ${errors.dataMustBeObservable}`,
                        () => {
                            let action = () => {
                                viewModel.activate(null);
                            };
                            expect(action).toThrow(errors.dataMustBeObservable);
                        });
                });

            describe('when justCreated is not a boolean',
                () => {
                    it(`should throw an exceprion ${errors.justCreatedMustBeABoolean}`,
                        () => {
                            let action = () => {
                                viewModel.activate(() => {}, '');
                            };
                            expect(action).toThrow(errors.justCreatedMustBeABoolean);
                        });
                });

            describe('when content type is not a string',
                () => {
                    it(`should throw an exception ${errors.contentTypeMustBeAStringAndOneOfAvailableTypes}`,
                        () => {
                            let action = () => {
                                viewModel.activate(() => {}, false, {});
                            };
                            expect(action).toThrow(errors.contentTypeMustBeAStringAndOneOfAvailableTypes);
                        });

                    describe('and when content type is string but not supprted',
                        () => {
                            it(`should throw an exception ${errors.contentTypeMustBeAStringAndOneOfAvailableTypes}`,
                                () => {
                                    let action = () => {
                                        viewModel.activate(() => {}, false, 'some string');
                                    };
                                    expect(action).toThrow(errors.contentTypeMustBeAStringAndOneOfAvailableTypes);
                                });
                        });
                });

            describe('when callbacks is not provided',
                () => {
                    it(`should throw an exception ${errors.callbacksIsNotProvided}`,
                        () => {
                            let action = () => {
                                viewModel.activate(() => {}, false, constants.contentsTypes.imageEditorOneColumn);
                            };
                            expect(action).toThrow(errors.callbacksIsNotProvided);
                        });
                });

            describe('when callbacks not provide needed function',
                () => {
                    it(`should throw an exception ${errors.callbacksMustProvideFunctions}`,
                        () => {
                            let action = () => {
                                viewModel.activate(() => {},
                                    false,
                                    constants.contentsTypes.imageEditorOneColumn,
                                    {});
                            };
                            expect(action).toThrow(errors.callbacksMustProvideFunctions);
                        });
                });

            describe('when all arguments are valid',
                () => {
                    beforeEach(() => {
                        spyOn(viewModel, 'setData');
                        spyOn(viewModel, 'saveData');
                    });

                    it('should initialize callbacks',
                        () => {
                            viewModel.activate(data, justCreated, contentType, callbacks);
                            expect(viewModel.callbacks).toBe(callbacks);
                        });

                    it('should initialize content type',
                        () => {
                            viewModel.activate(data, justCreated, contentType, callbacks);
                            expect(viewModel.contentType).toBe(contentType);
                        });

                    it('should call setData',
                        () => {
                            viewModel.activate(data, justCreated, contentType, callbacks);
                            expect(viewModel.setData).toHaveBeenCalledWith(data, justCreated);
                        });

                    describe('and when content just created',
                        () => {
                            it('should call saveData',
                                () => {
                                    viewModel.activate(data, justCreated, contentType, callbacks);
                                    expect(viewModel.saveData).toHaveBeenCalled();
                                });
                        });
                });
        });

    describe('setData:',
        () => {
            
        });

    describe('_createInstance:',
        () => {
            
        });

    describe('endEdit:',
        () => {
            
        });

    describe('saveData:',
        () => {
            beforeEach(() => {
                viewModel.activate(data, justCreated, contentType, callbacks);
                spyOn(contentEditorParser, 'toHtml').and.returnValue('data');
                spyOn(viewModel.callbacks, 'save');
            });

            it('should convert instances to html',
                () => {
                    viewModel.saveData();
                    expect(contentEditorParser.toHtml).toHaveBeenCalled();
                });

            it('should save data',
                () => {
                    viewModel.saveData();
                    expect(viewModel.callbacks.save).toHaveBeenCalledWith('data');
                });
        });

    describe('changeType:',
        () => {
            
        });

    describe('broadcastToOtherInstances:',
        () => {
            describe('when message type is sizeChanged',
                () => {
                    it('should call _instanceSizeChanged',
                        () => {
                            spyOn(viewModel, '_instanceSizeChanged');
                            viewModel.broadcastToOtherInstances(viewModel, 'sizeChanged', { width: 100, height: 200 });
                            expect(viewModel._instanceSizeChanged).toHaveBeenCalledWith(viewModel, 100, 200);
                        });
                });
            describe('when message type is resizingStopped',
                () => {
                    it('should call _instanceResizingStopped',
                        () => {
                            spyOn(viewModel, '_instanceResizingStopped');
                            viewModel.broadcastToOtherInstances(viewModel, 'resizingStopped', { width: 100, height: 200 });
                            expect(viewModel._instanceResizingStopped).toHaveBeenCalledWith(viewModel);
                        });
                });
        });

    describe('_instanceSizeChanged:',
        () => {
            
        });

    describe('_instanceResizingStopped:',
        () => {
            
        });
});