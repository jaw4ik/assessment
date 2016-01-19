import previewDocumentDialog from 'dialogs/document/preview/index';

describe('previewDocumentDialog:', () => {

    it('should be defined', () => {
        expect(previewDocumentDialog).toBeDefined();
    });

    describe('isShown:', () => {

        it('should be observable', () => {
            expect(previewDocumentDialog.isShown).toBeObservable();
        });

        it('should be false by default', () => {
            expect(previewDocumentDialog.isShown()).toBeFalsy();
        });

    });

    describe('show', () => {

        it('should be function', () => {
            expect(previewDocumentDialog.show).toBeFunction();
        });

        it('should prepare popup to be opened', () => {
            var type = 0;
            var title = '123';
            var embedCode = '456';

            previewDocumentDialog.show(title, embedCode, type);

            expect(previewDocumentDialog.title).toBe(title);
            expect(previewDocumentDialog.embedCode).toBe(embedCode);
            expect(previewDocumentDialog.type).toBe(type);
            expect(previewDocumentDialog.isShown()).toBeTruthy();
        });

    });

    describe('hide', () => {

        beforeEach(() => {
            previewDocumentDialog.isShown(true);
        });

        it('should set isShown to false', () => {
            previewDocumentDialog.hide();
            expect(previewDocumentDialog.isShown()).toBeFalsy();
        });

    });

});