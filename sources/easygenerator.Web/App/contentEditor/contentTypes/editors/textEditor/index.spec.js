import ko from 'knockout';
import TextEditor from './index';
import eventTracker from 'eventTracker';
import constants from 'constants';
import localizationManager from 'localization/localizationManager';

describe('content editor [TextEditor]', () => {

    let textEditor = null,
        text = 'some text',
        callbacks = {
            startEditing: () => {},
            endEditing: () => {},
            save: () => {}
        };

    beforeEach(() => {
        textEditor = new TextEditor(text, callbacks);
    });

    it(`autosaveInterval should be equal to ${constants.autosaveTimersInterval.learningContent}`, () => {
        expect(textEditor.autosaveInterval).toBe(constants.autosaveTimersInterval.learningContent);
    });

    it('eventTracker', () => {
        expect(textEditor.eventTracker).toBe(eventTracker);
    });

    it('localizationManager', () => {
        expect(textEditor.localizationManager).toBe(localizationManager);
    });

    it(`should initialize data as "${text}"`, () => {
        expect(textEditor.data()).toBe(text);
    });

    it('should be observable', () => {
        expect(textEditor.hasFocus).toBeObservable();
    });

    it('should initialize all calbacks', () => {
        expect(textEditor.callbacks).toBeObject();
        expect(textEditor.callbacks.startEditing).toBeFunction();
        expect(textEditor.callbacks.endEditing).toBeFunction();
        expect(textEditor.callbacks.save).toBeFunction();
    });

    it(`should initialize viewUrl to "${'contentEditor/contentTypes/editors/textEditor/index.html'}"`, () => {
        expect(textEditor.viewUrl).toBe('contentEditor/contentTypes/editors/textEditor/index.html');
    });

    describe('save:', () => {

        beforeEach(() => {
            spyOn(textEditor.callbacks, 'save');
        });

        it('should update data', () => {
            let newData = 'some new text';
            textEditor.save({ data: ko.observable(newData) });
            expect(textEditor.data()).toBe(newData);
        });

        it('should call callbacks.save method', () => {
            textEditor.save({ data: ko.observable('some new text') });
            expect(textEditor.callbacks.save).toHaveBeenCalled();
        });

    });

});