import ko from 'knockout';
import _ from 'underscore';
import MediaEditorViewModel, { errors } from './viewModel';
import binder from 'binder';
import constants from 'constants';
import contentEditorParser from './components/parser';
import { getDefaultDataByType } from './components/defaultDataGenerator';
import VideoEditor, { className as videoEditorClassName } from '../editors/videoEditor/index';
import TextEditor, { className as textEditorClassName } from '../editors/textEditor/index';


describe('viewmodel [mediaEditor]', () => {

    let viewModel = new MediaEditorViewModel();
    let id = '123';
    let data = ko.observable('');
    let contentType = constants.contentsTypes.singleVideo;
    let justCreated = true;
    let callbacks = {
        startEditing: () => {},
        enableOverlay: () => {},
        disableOverlay: () => {},
        save: () => {},
        endEditing: () => {}
    };
    

    it('should return ctor function', () => {
        expect(MediaEditorViewModel).toBeFunction();
    });

    describe('ctor', () => {
        beforeEach(() => {
            spyOn(binder, 'bindClass');
        });

        it('should bind class', () => {
            viewModel = new MediaEditorViewModel();
            expect(binder.bindClass).toHaveBeenCalled();
        });

        it('should initialize fields', () => {
            expect(viewModel.editorInstances).toBeObservableArray();
            expect(viewModel.isEditing).toBeObservable();
            expect(viewModel.isEditing()).toBeFalsy();
            expect(viewModel.contentType).toBe('');
            expect(viewModel.learningContentId).toBe(null);
            expect(viewModel.callbacks).toBe(null);
        });
    });

    describe('activate:', () => {

        describe('when data is not a function', () => {
            it(`should throw an exception -> ${errors.dataMustBeObservable}`, () => {
                let action = () => { 
                    viewModel.activate('', null);
                };
                expect(action).toThrow(errors.dataMustBeObservable);
            });
        });

        describe('when justCreated is not a boolean', () => {
            it(`should throw an exceprion ${errors.justCreatedMustBeABoolean}`, () => {
                let action = () => {
                    viewModel.activate('', () => {}, '');
                };
                expect(action).toThrow(errors.justCreatedMustBeABoolean);
            });
        });

        describe('when content type is not a string', () => {
            it(`should throw an exception ${errors.contentTypeMustBeAStringAndOneOfAvailableTypes}`, () => {
                let action = () => {
                    viewModel.activate('', () => {}, false, {});
                };
                expect(action).toThrow(errors.contentTypeMustBeAStringAndOneOfAvailableTypes);
            });

            describe('and when content type is string but not supprted', () => {
                it(`should throw an exception ${errors.contentTypeMustBeAStringAndOneOfAvailableTypes}`, () => {
                    let action = () => {
                        viewModel.activate('', () => {}, false, 'some string');
                    };
                    expect(action).toThrow(errors.contentTypeMustBeAStringAndOneOfAvailableTypes);
                });
            });
        });

        describe('when callbacks is not provided', () => {
            it(`should throw an exception ${errors.callbacksIsNotProvided}`, () => {
                let action = () => {
                    viewModel.activate('', () => {}, false, constants.contentsTypes.singleVideo);
                };
                expect(action).toThrow(errors.callbacksIsNotProvided);
            });
        });

        describe('when callbacks not provide needed function', () => {
            it(`should throw an exception ${errors.callbacksMustProvideFunctions}`, () => {
                let action = () => {
                    viewModel.activate('', 
                        () => {},
                        false,
                        constants.contentsTypes.singleVideo, 
                        {});
                };
                expect(action).toThrow(errors.callbacksMustProvideFunctions);
            });
        });

        describe('when all arguments are valid', () => {
            beforeEach(() => {
                spyOn(viewModel, 'setData');
                spyOn(viewModel, 'saveData');
            });

            it('should initialize callbacks', () => {
                viewModel.activate(id, data, justCreated, contentType, callbacks);
                expect(viewModel.callbacks).toBe(callbacks);
            });

            it('should initialize content type', () => {
                viewModel.activate(id, data, justCreated, contentType, callbacks);
                expect(viewModel.contentType).toBe(contentType);
            });

            it('should call setData', () => {
                viewModel.activate(id, data, justCreated, contentType, callbacks);
                expect(viewModel.setData).toHaveBeenCalledWith(data, justCreated);
            });

            describe('and when content just created', () => {
                it('should call saveData', () => {
                    viewModel.activate(id, data, justCreated, contentType, callbacks);
                    expect(viewModel.saveData).toHaveBeenCalled();
                });
            });
        });
    });

    describe('setData:', () => {
        beforeEach(() => {
            spyOn(contentEditorParser, 'parse').and.returnValue({output: 'data', contentType: 'videoEditor'});
        });

        it('should not call parse when justCreated', () => {
            viewModel.setData(data, true);
            expect(contentEditorParser.parse).not.toHaveBeenCalled();
        });

        it('should call parse when not justCreated', () => {
            viewModel.setData(data, false);
            expect(contentEditorParser.parse).toHaveBeenCalled();
        });
    });

    describe('_setVideoEditorOnFocus', () => {
        let videoEditorInstance;
        
        beforeEach(() => {
            viewModel.isEditing(false);
            videoEditorInstance = viewModel._createInstance(videoEditorClassName, 'data');
            spyOn(videoEditorInstance, 'startEditMode');
        });

        it('isEditing property should be true after calling _setVideoEditorOnFocus', () => {
            viewModel._setVideoEditorOnFocus(videoEditorInstance, true);
            expect(viewModel.isEditing()).toBe(true);
        });
        
        it('should call startEditMode', () => {
            viewModel._setVideoEditorOnFocus(videoEditorInstance, true);
            expect(videoEditorInstance.startEditMode).toHaveBeenCalled();
        });
    });
    
    describe('_createInstance:', () => {
        describe('when creating instance typeof VideoEditor:', () => {
            it('should be instance typeof VideoEditor', () => {
                let videoEditorInstance = viewModel._createInstance(videoEditorClassName, 'data');
                expect(videoEditorInstance instanceof VideoEditor).toBe(true);
            });
        }); 

        describe('when creating instance typeof TextEditor:', () => {
            it('should be instance typeof TextEditor', () => {
                let textEditorInstance = viewModel._createInstance(textEditorClassName, 'data');
                expect(textEditorInstance instanceof TextEditor).toBe(true);
            });
        }); 
    });   

    describe('endEditing:', () => {
        let instances;
        
        beforeEach(() => {
            contentType = constants.contentsTypes.videoInTheLeft;
            viewModel.activate(id, data, justCreated, contentType, callbacks);
            instances = viewModel.getVideoAndTextInstance(viewModel.editorInstances());

            spyOn(instances.videoInstance, 'stopEditMode');
            viewModel.endEditing();
        });

        it('should call stopEditMode on videoEditorInstance',() => {
            expect(instances.videoInstance.stopEditMode).toHaveBeenCalled();
            
        });

        it('should set hasFocus at false on textEditorInstance',() => {
            expect(instances.textInstance.hasFocus()).toBe(false);
        });
    });

    describe('saveData:', () => {
        beforeEach(() => {
            spyOn(viewModel.callbacks, 'save');
        });

        it('should call save callback', () => {
            viewModel.activate(id, data, justCreated, contentType, callbacks);
            viewModel.saveData(justCreated);
            expect(viewModel.callbacks.save).toHaveBeenCalled();
        });
    });

    describe('changeType to specified:', () => {
        beforeEach(() => {
            viewModel.activate(id, data, justCreated, contentType, callbacks);
        });

        it('should change content type to videoInTheLeft', () => {
            viewModel.changeType(constants.contentsTypes.videoInTheLeft);
            expect(viewModel.contentType).toEqual(constants.contentsTypes.videoInTheLeft);
        }); 
        
        it('should change content type to videoInTheRight', () => {
            viewModel.changeType(constants.contentsTypes.videoInTheRight);
            expect(viewModel.contentType).toEqual(constants.contentsTypes.videoInTheRight);
        });

        it('should change content type to videoWithText', () => {
            viewModel.changeType(constants.contentsTypes.videoWithText);
            expect(viewModel.contentType).toEqual(constants.contentsTypes.videoWithText);
        });
    });

    describe('getVideoAndTextInstance:', () => {
        describe('should return object', () => {
            let instances;

            it('{ textInstance should be null; videoInstance not to be null } for singleVideo type', () => {
                contentType = constants.contentsTypes.singleVideo;
                viewModel.activate(id, data, justCreated, contentType, callbacks);
                instances = viewModel.getVideoAndTextInstance(viewModel.editorInstances());

                expect(instances.videoInstance).not.toBeNull();
                expect(instances.textInstance).toBeNull();
            });

            it('{ videoInstance and textInstance should not to be null } for videoInTheLeft type', () => {
                contentType = constants.contentsTypes.videoInTheLeft;
                viewModel.activate(id, data, justCreated, contentType, callbacks);
                instances = viewModel.getVideoAndTextInstance(viewModel.editorInstances());

                expect(instances.videoInstance).not.toBeNull();
                expect(instances.textInstance).not.toBeNull();
            });

            it('{ videoInstance and textInstance should not to be null } for videoInTheRight type', () => {
                contentType = constants.contentsTypes.videoInTheRight;
                viewModel.activate(id, data, justCreated, contentType, callbacks);
                instances = viewModel.getVideoAndTextInstance(viewModel.editorInstances());

                expect(instances.videoInstance).not.toBeNull();
                expect(instances.textInstance).not.toBeNull();
            });
            
            it('{ videoInstance and textInstance should not to be null } for videoWithText type', () => {
                contentType = constants.contentsTypes.videoWithText;
                viewModel.activate(id, data, justCreated, contentType, callbacks);
                instances = viewModel.getVideoAndTextInstance(viewModel.editorInstances());

                expect(instances.videoInstance).not.toBeNull();
                expect(instances.textInstance).not.toBeNull();
            });
        });
    });

});