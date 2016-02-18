import DocumentBrief from './documentBrief';

import previewDocumentDialog from 'dialogs/document/preview/index';
import app from 'durandal/app';
import constants from 'constants';
import eventTracker from 'eventTracker';

var documentModel = {
    id: '123',
    documentType: 1,
    title: 'title',
    embedCode: 'embedCode',
    modifiedOn: new Date()
};
var document = new DocumentBrief(documentModel);

describe('DocumentBrief:', () => {

    beforeEach(() => {
        spyOn(app, 'trigger');
        spyOn(eventTracker, 'publish');
        spyOn(previewDocumentDialog, 'show');
    });

    it('should be class', () => {
        expect(DocumentBrief).toBeFunction();
    });

    describe('id', () => {

        it('should be defined', () => {
            expect(document.id).toBeDefined();
        });

    });

    describe('type', () => {

        it('should be defined', () => {
            expect(document.type).toBeDefined();
        });

    });

    describe('title', () => {

        it('should be observable', () => {
            expect(document.title).toBeObservable();
        });

    });

    describe('embedCode', () => {

        it('should be observable', () => {
            expect(document.embedCode).toBeObservable();
        });

    });

    describe('modifiedOn', () => {

        it('should be defined', () => {
            expect(document.modifiedOn).toBeDefined();
        });

    });

    describe('previewEvent', () => {

        describe('when type is PowerPoint', () => {

            it('should be defined', () => {
                documentModel.documentType = 1;
                var doc = new DocumentBrief(documentModel);
                expect(doc.previewEvent).toBe('Preview PowerPoint document');
            });

        });

        describe('when type is PDF', () => {

            it('should be defined', () => {
                documentModel.documentType = 2;
                var doc = new DocumentBrief(documentModel);
                expect(doc.previewEvent).toBe('Preview PDF document');
            });

        });

        describe('when type is Office', () => {

            it('should be defined', () => {
                documentModel.documentType = 3;
                var doc = new DocumentBrief(documentModel);
                expect(doc.previewEvent).toBe('Preview Office document');
            });

        });

    });

    describe('constructor', () => {

        it('should set all passed data', () => {
            var documentBrief = new DocumentBrief(documentModel);
            expect(documentBrief.id).toBe(documentModel.id);
            expect(documentBrief.type).toBe(documentModel.documentType);
            expect(documentBrief.title()).toBe(documentModel.title);
            expect(documentBrief.embedCode()).toBe(documentModel.embedCode);
            expect(documentBrief.modifiedOn()).toBe(documentModel.modifiedOn);
        });

    });

    describe('preview', () => {

        it('should be function', () => {
            expect(document.preview).toBeFunction();
        });

        it('should publish event', () => {
            document.preview();
            expect(eventTracker.publish).toHaveBeenCalledWith(document.previewEvent);
        });

        it('should open document in preview mode', () => {
            document.preview();
            expect(previewDocumentDialog.show).toHaveBeenCalledWith(document.title(), document.embedCode(), document.type);
        });

    });

    describe('remove', () => {

        it('should be function', () => {
            expect(document.remove).toBeFunction();
        });

        it('should trigger up event', () => {
            document.remove();
            expect(app.trigger).toHaveBeenCalledWith(constants.messages.learningPath.removeDocument, document.id);
        });

    });

});