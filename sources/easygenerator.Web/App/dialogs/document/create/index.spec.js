import createDocumentDialog from 'dialogs/document/create/index';
import eventTracker from 'eventTracker';

describe('createDocumentDialog:', () => {

    it('should be defined', () => {
        expect(createDocumentDialog).toBeDefined();
    });

    describe('isShown:', () => {

        it('should be observable', () => {
            expect(createDocumentDialog.isShown).toBeObservable();
        });

        it('should be false by default', () => {
            expect(createDocumentDialog.isShown()).toBeFalsy();
        });

    });

    describe('cancelEvent', () => {

        it('should be defined', () => {
            expect(createDocumentDialog.cancelEvent).toBeDefined();
        });

        it('should be null by default', () => {
            expect(createDocumentDialog.cancelEvent).toBeNull();
        });

    });

    describe('callback', () => {

        it('should be defined', () => {
            expect(createDocumentDialog.callback).toBeDefined();
        });

        it('should be null by default', () => {
            expect(createDocumentDialog.callback).toBeNull();
        });

    });

    describe('description', () => {

        it('should be defined', () => {
            expect(createDocumentDialog.description).toBeDefined();
        });

    });

    describe('title', () => {

        it('should be observable', () => {
            expect(createDocumentDialog.title).toBeObservable();
        });

        it('should be empty by default', () => {
            expect(createDocumentDialog.title()).toBe('');
        });

    });

    describe('titleMaxLength', () => {

        it('should be defined', () => {
            expect(createDocumentDialog.titleMaxLength).toBeDefined();
        });

    });

    describe('isTitleEditing', () => {

        it('should be observable', () => {
            expect(createDocumentDialog.isTitleEditing).toBeObservable();
        });

    });

    describe('isTitleChanged', () => {

        it('should be observable', () => {
            expect(createDocumentDialog.isTitleChanged).toBeObservable();
        });

    });

    describe('isTitleValid', () => {

        it('should be computed', () => {
            expect(createDocumentDialog.isTitleValid).toBeComputed();
        });

        describe('when title is not defined', () => {

            beforeEach(() => {
                createDocumentDialog.title(null);
            });

            it('should return false', () => {
                expect(createDocumentDialog.isTitleValid()).toBeFalsy();
            });

        });

        describe('when title is larger that max title length', () => {

            beforeEach(() => {
                createDocumentDialog.title('1'.repeat(256));
            });

            it('should return false', () => {
                expect(createDocumentDialog.isTitleValid()).toBeFalsy();
            });

        });

        describe('when title is correct', () => {

            beforeEach(() => {
                createDocumentDialog.title('1');
            });

            it('should return true', () => {
                expect(createDocumentDialog.isTitleValid()).toBeTruthy();
            });

        });

    });

    describe('embedCode', () => {

        it('should be observable', () => {
            expect(createDocumentDialog.embedCode).toBeObservable();
        });

        it('should be empty by default', () => {
            expect(createDocumentDialog.embedCode()).toBe('');
        });

    });

    describe('isEmbedCodeEditing', () => {

        it('should be observable', () => {
            expect(createDocumentDialog.isEmbedCodeEditing).toBeObservable();
        });

    });

    describe('isEmbedCodeChanged', () => {

        it('should be observable', () => {
            expect(createDocumentDialog.isEmbedCodeChanged).toBeObservable();
        });

    });

    describe('isEmbedCodeValid', () => {

        it('should be computed', () => {
            expect(createDocumentDialog.isEmbedCodeValid).toBeComputed();
        });

        describe('when embedCode is not defined', () => {

            beforeEach(() => {
                createDocumentDialog.embedCode(null);
            });

            it('should return false', () => {
                expect(createDocumentDialog.isEmbedCodeValid()).toBeFalsy();
            });

        });

        describe('when embedCode is correct', () => {

            beforeEach(() => {
                createDocumentDialog.embedCode('1');
            });

            it('should return true', () => {
                expect(createDocumentDialog.isEmbedCodeValid()).toBeTruthy();
            });

        });

    });

    describe('titleChanged', () => {

        it('should be function', () => {
            expect(createDocumentDialog.titleChanged).toBeFunction();
        });

        it('should set isTitleChanged to true', () => {
            createDocumentDialog.isTitleChanged(false);
            createDocumentDialog.titleChanged();
            expect(createDocumentDialog.isTitleChanged()).toBeTruthy();
        });

    });

    describe('embedCodeChanged', () => {

        it('should be function', () => {
            expect(createDocumentDialog.embedCodeChanged).toBeFunction();
        });

        it('should set isEmbedCodeChanged to true', () => {
            createDocumentDialog.isEmbedCodeChanged(false);
            createDocumentDialog.embedCodeChanged();
            expect(createDocumentDialog.isEmbedCodeChanged()).toBeTruthy();
        });

    });

    describe('submit', () => {

        it('should be function', () => {
            expect(createDocumentDialog.submit).toBeFunction();
        });

        describe('when title is not valid', () => {

            beforeEach(() => {
                createDocumentDialog.title('');
                createDocumentDialog.isTitleChanged(false);
            });

            it('should set isTitleChanged to true', () => {
                createDocumentDialog.submit();
                expect(createDocumentDialog.isTitleChanged()).toBeTruthy();
            });

        });

        describe('when embedCode is not valid', () => {

            beforeEach(() => {
                createDocumentDialog.embedCode('');
                createDocumentDialog.isEmbedCodeChanged(false);
            });

            it('should set isEmbedCodeChanged to true', () => {
                createDocumentDialog.submit();
                expect(createDocumentDialog.isEmbedCodeChanged()).toBeTruthy();
            });

        });

        describe('when title and embedCode are valid', () => {

            beforeEach(() => {
                createDocumentDialog.title('title');
                createDocumentDialog.embedCode('embedCode');
                createDocumentDialog.isShown(true);
            });

            it('should set isShown to true', () => {
                createDocumentDialog.submit();
                expect(createDocumentDialog.isShown()).toBeFalsy();
            });

            describe('when callback is defined', () => {

                beforeEach(() => {
                    createDocumentDialog.callback = function(arg1, arg2) {};
                    spyOn(createDocumentDialog, 'callback');
                });

                it('should call callback with correct arguments', () => {
                    createDocumentDialog.submit();
                    expect(createDocumentDialog.callback).toHaveBeenCalledWith(createDocumentDialog.title(), createDocumentDialog.embedCode());
                });

            });

        });

    });

    describe('show', () => {

        it('should be function', () => {
            expect(createDocumentDialog.show).toBeFunction();
        });

        it('should prepare popup to be opened', () => {
            var cancelEvent = 'event';
            var callback = function() {};
            var title = '123';
            var embedCode = '456';

            createDocumentDialog.show(cancelEvent, callback, title, embedCode);

            expect(createDocumentDialog.cancelEvent).toBe(cancelEvent);
            expect(createDocumentDialog.callback).toBe(callback);
            expect(createDocumentDialog.title()).toBe(title);
            expect(createDocumentDialog.embedCode()).toBe(embedCode);
            expect(createDocumentDialog.isTitleEditing()).toBeFalsy();
            expect(createDocumentDialog.isTitleChanged()).toBeFalsy();
            expect(createDocumentDialog.isEmbedCodeEditing()).toBeFalsy();
            expect(createDocumentDialog.isEmbedCodeChanged()).toBeFalsy();
            expect(createDocumentDialog.isShown()).toBeTruthy();
        });

    });

    describe('hide', () => {

        beforeEach(() => {
            spyOn(eventTracker, 'publish');
            createDocumentDialog.isShown(true);
            createDocumentDialog.cancelEvent = 'cancel';
        });

        it('should publish event', () => {
            createDocumentDialog.hide();
            expect(eventTracker.publish).toHaveBeenCalledWith(createDocumentDialog.cancelEvent);
        });

        it('should set isShown to false', () => {
            createDocumentDialog.hide();
            expect(createDocumentDialog.isShown()).toBeFalsy();
        });

    });

    describe('beginEditTitle', () => {

        it('should be function', () => {
            expect(createDocumentDialog.beginEditTitle).toBeFunction();
        });

        it('should set isTitleEditing to true', () => {
            createDocumentDialog.isTitleEditing(false);
            createDocumentDialog.beginEditTitle();
            expect(createDocumentDialog.isTitleEditing()).toBeTruthy();
        });

    });

    describe('endEditTitle', () => {

        it('should be function', () => {
            expect(createDocumentDialog.endEditTitle).toBeFunction();
        });

        it('should set isTitleEditing to false', () => {
            createDocumentDialog.isTitleEditing(true);
            createDocumentDialog.endEditTitle();
            expect(createDocumentDialog.isTitleEditing()).toBeFalsy();
        });

    });

    describe('beginEditEmbedCode', () => {

        it('should be function', () => {
            expect(createDocumentDialog.beginEditEmbedCode).toBeFunction();
        });

        it('should set isEmbedCodeEditing to true', () => {
            createDocumentDialog.isEmbedCodeEditing(false);
            createDocumentDialog.beginEditEmbedCode();
            expect(createDocumentDialog.isEmbedCodeEditing()).toBeTruthy();
        });

    });

    describe('endEditEmbedCode', () => {

        it('should be function', () => {
            expect(createDocumentDialog.endEditEmbedCode).toBeFunction();
        });

        it('should set isEmbedCodeEditing to false', () => {
            createDocumentDialog.isEmbedCodeEditing(true);
            createDocumentDialog.endEditEmbedCode();
            expect(createDocumentDialog.isEmbedCodeEditing()).toBeFalsy();
        });

    });

});