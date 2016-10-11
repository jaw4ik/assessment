import Editor from './editor';

import adaptersLoader from './adapters/adaptersLoader';
import contentTypesFactory from './contentTypes/contentTypesFactory';
import eventTracker from 'eventTracker';
import notify from 'notify';
import app from 'durandal/app';
import constants from 'constants';
import ko from 'knockout';

describe('[Content editor]', () => {

    let editor,
        adapter = {
            on: () => {}, 
            getContentsList: () => [],
            updateContentText: () => {},
            updateContentPosition: () => {},
            createContent: () => {},
            deleteContent: () => {}
        },
        viewmodel = { on: () => {} };

    beforeEach(() => {
        editor = new Editor();
        editor.adapter = adapter;
        spyOn(eventTracker, 'publish');
        spyOn(notify, 'saved');
        spyOn(contentTypesFactory, 'createContentViewmodel').and.returnValue(Promise.resolve(viewmodel));
    });

    describe('activate:', () => {

        let activationData;
        beforeEach(() => {
            spyOn(editor, 'mapContent').and.returnValue(Promise.resolve({}));
        });

        describe('when activationData is not defined', () => {

            beforeEach(() => {
                activationData = undefined;
            });

            it('should throw exception', done => (async () => {
                try {
                    await editor.activate(activationData);
                } catch(e) {
                    expect(e).toBe('Adapter for content editor not defined.');
                }
            })().then(done));

        });

        describe('when activationData.adapter is not defined', () => {

            beforeEach(() => {
                activationData = {};
            });

            it('should throw exception', done => (async () => {
                try {
                    await editor.activate(activationData);
                } catch(e) {
                    expect(e).toBe('Adapter for content editor not defined.');
                }
            })().then(done));

        });

        describe('when activationData and adapter is defined', () => {

            beforeEach(() => {
                activationData = { adapter: 'adapter/path' };
            });

            describe('but adapter not found', () => {

                beforeEach(() => {
                    spyOn(adaptersLoader, 'load').and.returnValue(Promise.resolve(null));
                });
                
                it('should throw exception', done => (async () => {
                    try {
                        await editor.activate(activationData);
                    } catch(e) {
                        expect(e).toBe('Adapter for content editor not found. Adapter path: ' + activationData.adapter);
                    }
                })().then(done));

            });

            describe('and when adapter found', () => {

                beforeEach(() => {
                    spyOn(adaptersLoader, 'load').and.returnValue(Promise.resolve(adapter));
                });

                it('should set adapter', done => (async () => {
                    editor.adapter = null;
                    await editor.activate(activationData);
                    expect(editor.adapter).toBe(adapter);
                })().then(done));

                it('should subscribe to adapter events', done => (async () => {
                    spyOn(adapter, 'on');
                    await editor.activate(activationData);
                    expect(adapter.on).toHaveBeenCalledWith('created', editor.createdByCollaborator);
                    expect(adapter.on).toHaveBeenCalledWith('deleted', editor.deletedByCollaborator);
                    expect(adapter.on).toHaveBeenCalledWith('updated', editor.updatedByCollaborator);
                })().then(done));

                it('should fill contentsList', done => (async () => {
                    let list = [{}, {}, {}];
                    spyOn(adapter, 'getContentsList').and.returnValue(Promise.resolve(list));
                    await editor.activate(activationData);
                    expect(editor.contentsList().length).toBe(list.length);
                })().then(done));

                it('should set activePlaceholderIndex to null', done => (async () => {
                    editor.activePlaceholderIndex(10);
                    await editor.activate(activationData);
                    expect(editor.activePlaceholderIndex()).toBeNull();
                })().then(done));

            });

        });

    });

    describe('mapContent:', () => {

        let content = { type: 'type' };
        
        it('should create content viewmodel', done => (async () => {
            await editor.mapContent(content);
            expect(contentTypesFactory.createContentViewmodel).toHaveBeenCalledWith(content.type);
        })().then(done));

        it('should subscribe to viewmodel events', done => (async () => {
            spyOn(viewmodel, 'on');
            await editor.mapContent(content);
            expect(viewmodel.on).toHaveBeenCalledWith('save', jasmine.any(Function));
            expect(viewmodel.on).toHaveBeenCalledWith('startEditing', jasmine.any(Function));
            expect(viewmodel.on).toHaveBeenCalledWith('endEditing', jasmine.any(Function));
            expect(viewmodel.on).toHaveBeenCalledWith('duplicateContent', jasmine.any(Function));
            expect(viewmodel.on).toHaveBeenCalledWith('deleteContent', jasmine.any(Function));
        })().then(done));

        it('should create needed fields for content', done => (async () => {
            let mappedContent = await editor.mapContent(content, true);
            expect(mappedContent.viewmodel).toBe(viewmodel);
            expect(mappedContent.isActive).toBeObservable();
            expect(mappedContent.isDeleted).toBeObservable();
            expect(mappedContent.isDragging).toBeObservable();
            expect(mappedContent.justCreated).toBeTruthy();
            expect(mappedContent.setActive).toBeFunction();
            expect(mappedContent.setInactive).toBeFunction();
        })().then(done));

        describe('content.setActive', () => {
            
            let mappedContent;
            beforeEach(done => (async () => {
                mappedContent = await editor.mapContent(content, true);
            })().then(done));

            describe('when content already active', () => {

                beforeEach(() => {
                    mappedContent.isActive(true);
                });

                it('should do nothing', () => {
                    mappedContent.setActive();
                    expect(eventTracker.publish).not.toHaveBeenCalled();
                });

            });

            describe('when content not active', () => {

                beforeEach(() => {
                    mappedContent.isActive(false);
                });

                it('should send event', () => {
                    mappedContent.setActive();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Start editing content');
                });

                it('should set isActive to true', () => {
                    mappedContent.setActive();
                    expect(mappedContent.isActive()).toBeTruthy();
                });

                it('should trigger event', () => {
                    spyOn(app, 'trigger');
                    mappedContent.setActive();
                    expect(app.trigger).toHaveBeenCalledWith(constants.messages.content.startEditing);
                });

            });

        });

        describe('content.setInactive', () => {

            let mappedContent;
            beforeEach(done => (async () => {
                mappedContent = await editor.mapContent(content, true);
            })().then(done));

            describe('when content already inactive', () => {

                beforeEach(() => {
                    mappedContent.isActive(false);
                });

                it('should do nothing', () => {
                    mappedContent.setInactive();
                    expect(eventTracker.publish).not.toHaveBeenCalled();
                });

            });

            describe('when content is active', () => {

                beforeEach(() => {
                    mappedContent.isActive(true);
                });

                it('should send event', () => {
                    mappedContent.setInactive();
                    expect(eventTracker.publish).toHaveBeenCalledWith('End editing content');
                });

                it('should set isActive to false', () => {
                    mappedContent.setInactive();
                    expect(mappedContent.isActive()).toBeFalsy();
                });

            });

        });

    });

    describe('saveContent:', () => {

        let content,
            newText = '';

        beforeEach(() => {
            content = { id: '111', text: 'some text' };
            spyOn(adapter, 'updateContentText');
        });

        describe('when old text equals to new text', () => {

            beforeEach(() => {
                newText = content.text;
            });

            it('should do nothing', done => (async () => {
                await editor.saveContent(content, newText);
                expect(eventTracker.publish).not.toHaveBeenCalled();
                expect(notify.saved).not.toHaveBeenCalled();
            })().then(done));

        });

        describe('when content not presented in contentsList', () => {

            beforeEach(() => {
                editor.contentsList([]);
            });

            it('should do nothing', done => (async () => {
                await editor.saveContent(content, newText);
                expect(eventTracker.publish).not.toHaveBeenCalled();
                expect(notify.saved).not.toHaveBeenCalled();
            })().then(done));

        });

        describe('when old text not equal to new text and content exists', () => {

            beforeEach(() => {
                newText = 'some new text';
                editor.contentsList([content]);
            });

            it('should send event', done => (async () => {
                await editor.saveContent(content, newText);
                expect(eventTracker.publish).toHaveBeenCalledWith('Edit content');
            })().then(done));

            it('should set content text to new text', done => (async () => {
                await editor.saveContent(content, newText);
                expect(content.text).toBe(newText);
            })().then(done));

            it('should call adapter.updateContentText', done => (async () => {
                await editor.saveContent(content, newText);
                expect(adapter.updateContentText).toHaveBeenCalledWith(content.id, newText);
            })().then(done));

            it('should show notification', done => (async () => {
                await editor.saveContent(content, newText);
                expect(notify.saved).toHaveBeenCalled();
            })().then(done));

        });

    });

    describe('startEditingContent:', () => {

        let content, content2, content3;
        beforeEach(done => (async () => {
            content = await editor.mapContent({}, true);
            spyOn(content, 'setActive');
            spyOn(content, 'setInactive');
            content2 = await editor.mapContent({}, true);
            spyOn(content2, 'setInactive');
            content3 = await editor.mapContent({}, true);
            spyOn(content3, 'setInactive');
            
            editor.contentsList([content, content2, content3]);
        })().then(done));

        it('should set inactive all other contents', () => {
            editor.startEditingContent(content);
            expect(content2.setInactive).toHaveBeenCalled();
            expect(content3.setInactive).toHaveBeenCalled();
            expect(content.setInactive).not.toHaveBeenCalled();
        });

        it('should set content active', () => {
            editor.startEditingContent(content);
            expect(content.setActive).toHaveBeenCalled();
        });

    });

    describe('endEditingContent:', () => {
        
        let content;
        beforeEach(done => (async () => {
            content = await editor.mapContent({}, true);
            spyOn(content, 'setInactive');
        })().then(done));

        it('should set content inactive', () => {
            editor.endEditingContent(content);
            expect(content.setInactive).toHaveBeenCalled();
        });

    });

    describe('createContent:', () => {

        let content = { id: '666' },
            mappedContent = { justCreated: false },
            contentType = 'contentType',
            position = 2,
            text = '';

        beforeEach(() => {
            spyOn(editor, 'mapContent').and.returnValue(mappedContent);
        });

        describe('when input text is empty', () => {

            beforeEach(() => {
                text = '';
            });

            it('should map content', done => (async () => {
                let result = await editor.createContent(contentType, position, text);
                expect(editor.mapContent).toHaveBeenCalledWith({ type: contentType, position: position, text: text }, true);
                expect(result).toBe(mappedContent);
            })().then(done));

        });

        describe('when input text is not empty', () => {
            
            beforeEach(() => {
                text = 'some new text';
            });

            it('should call adapter.createContent', done => (async () => {
                spyOn(adapter, 'createContent').and.returnValue(Promise.resolve(content));
                await editor.createContent(contentType, position, text);
                expect(adapter.createContent).toHaveBeenCalledWith(contentType, position, text);
            })().then(done));

        });

    });

    describe('duplicateContent:', () => {

        let content = { id: '666', type: 'hotspot', position: 5, text: 'text' },
            newContent = { justCreated: false };

        beforeEach(() => {
            editor.contentsList([content]);
            spyOn(editor, 'createContent').and.returnValue(Promise.resolve(newContent));
        });

        it('should send event', () => {
            editor.duplicateContent(content);
            expect(eventTracker.publish).toHaveBeenCalledWith('Duplicate content');
        });

        it('should create new content in contentsList', done => (async () => {
            await editor.duplicateContent(content);
            expect(editor.contentsList().length).toBe(2);
            expect(editor.contentsList()[1]).toBe(newContent);
        })().then(done));

        it('should show notification', done => (async () => {
            await editor.duplicateContent(content);
            expect(notify.saved).toHaveBeenCalled();
        })().then(done));

    });

    describe('deleteContent:', () => {

        let content = { id: '666', type: 'hotspot', position: 5, text: 'text', isDeleted: ko.observable(), setInactive: () => {} };
        beforeEach(() => {
            editor.contentsList([content]);
            spyOn(adapter, 'deleteContent');
        });

        it('should send event', () => {
            editor.deleteContent(content);
            expect(eventTracker.publish).toHaveBeenCalledWith('Delete content');
        });

        describe('when content just created', () => {

            beforeEach(() => {
                content.justCreated = true;
            });

            it('should not call adapter.deleteContent', done => (async () => {
                await editor.deleteContent(content);
                expect(adapter.deleteContent).not.toHaveBeenCalled();
            })().then(done));

            it('should not show notification', done => (async () => {
                await editor.deleteContent(content);
                expect(notify.saved).not.toHaveBeenCalled();
            })().then(done));

        });

        describe('when content not just created', () => {

            beforeEach(() => {
                content.justCreated = false;
            });

            it('should call adapter.deleteContent', done => (async () => {
                await editor.deleteContent(content);
                expect(adapter.deleteContent).toHaveBeenCalledWith(content.id);
            })().then(done));

            it('should show notification', done => (async () => {
                await editor.deleteContent(content);
                expect(notify.saved).toHaveBeenCalled();
            })().then(done));

        });

        describe('when content.text is empty', () => {

            beforeEach(() => {
                content.text = '';
            });

            it('should remove content from contentsList', done => (async () => {
                await editor.deleteContent(content);
                expect(editor.contentsList().length).toBe(0);
            })().then(done));

        });

        describe('when content.text is not empty', () => {

            beforeEach(() => {
                content.text = 'some text';
            });

            it('should set isDeleted to true', done => (async () => {
                content.isDeleted(false);
                await editor.deleteContent(content);
                expect(content.isDeleted()).toBeTruthy();
            })().then(done));

            it('should set content inactive', done => (async () => {
                spyOn(content, 'setInactive');
                await editor.deleteContent(content);
                expect(content.setInactive).toHaveBeenCalled();
            })().then(done));

        });

    });

    describe('restoreContent:', () => {
        
        let content = { id: '666', type: 'hotspot', position: 5, text: 'text' },
            restoredContent = { id: '666' };

        beforeEach(() => {
            editor.contentsList([content]);
            spyOn(editor, 'createContent').and.returnValue(Promise.resolve(restoredContent));
        });

        it('should send event', () => {
            editor.restoreContent(content);
            expect(eventTracker.publish).toHaveBeenCalledWith('Restore content');
        });

        it('should replace deleted content by new', done => (async () => {
            await editor.restoreContent(content);
            expect(editor.contentsList().length).toBe(1);
            expect(editor.contentsList()[0]).toBe(restoredContent);
        })().then(done));

        it('should show notification', done => (async () => {
            await editor.restoreContent(content);
            expect(notify.saved).toHaveBeenCalled();
        })().then(done));

    });

    describe('createContentItem:', () => {
        
        let contentType = 'type',
            nextContentPosition = 4,
            targetIndex = 0,
            newContent = { id: '666' };

        beforeEach(() => {
            spyOn(editor, 'createContent').and.returnValue(Promise.resolve(newContent));
        });

        it('should send event', () => {
            editor.createContentItem(contentType, nextContentPosition, targetIndex);
            expect(eventTracker.publish).toHaveBeenCalledWith('Create content');
        });

        it('should add content to contentsList', done => (async () => {
            await editor.createContentItem(contentType, nextContentPosition, targetIndex);
            expect(editor.contentsList().length).toBe(1);
            expect(editor.contentsList()[0]).toBe(newContent);
        })().then(done));

        it('should clear activePlaceholderIndex', done => (async () => {
            editor.activePlaceholderIndex(0);
            await editor.createContentItem(contentType, nextContentPosition, targetIndex);
            expect(editor.activePlaceholderIndex()).toBeNull();
        })().then(done));

    });

    describe('reorderContent:', () => {

        let content, nextContent, contentPosition, nextContentPosition;
        beforeEach(() => {
            content = { id: 555, position: 0, isDragging: ko.observable(false) };
            nextContent = { id: 666, position: 1, isDragging: ko.observable(false) };
            contentPosition = content.position;
            nextContentPosition = nextContent.position;

            spyOn(adapter, 'updateContentPosition');
            editor.contentsList([content, nextContent]);
        });

        it('should send event', () => {
            editor.reorderContent(contentPosition, nextContentPosition);
            expect(eventTracker.publish).toHaveBeenCalledWith('Reorder content');
        });

        describe('when content just created', () => {

            beforeEach(() => {
                content.justCreated = true;
            });

            it('should not call adapter.deleteContent', done => (async () => {
                await editor.reorderContent(contentPosition, nextContentPosition);
                expect(adapter.updateContentPosition).not.toHaveBeenCalled();
            })().then(done));

            it('should not show notification', done => (async () => {
                await editor.reorderContent(contentPosition, nextContentPosition);
                expect(notify.saved).not.toHaveBeenCalled();
            })().then(done));

        });

        describe('when content not just created', () => {

            beforeEach(() => {
                content.justCreated = false;
            });

            it('should call adapter.deleteContent', done => (async () => {
                await editor.reorderContent(contentPosition, nextContentPosition);
                expect(adapter.updateContentPosition).toHaveBeenCalledWith(content.id, jasmine.any(Number));
            })().then(done));

            it('should show notification', done => (async () => {
                await editor.reorderContent(contentPosition, nextContentPosition);
                expect(notify.saved).toHaveBeenCalled();
            })().then(done));

        });

        it('should change content position', done => (async () => {
            await editor.reorderContent(contentPosition, null);
            expect(content.position).not.toBe(0);
        })().then(done));

        it('should move content in contentsList', done => (async () => {
            await editor.reorderContent(contentPosition, null);
            expect(editor.contentsList()[1].id).toBe(content.id);
        })().then(done));

    });

    describe('startDragging:', () => {

        let content, contentPosition;
        beforeEach(() => {
            content = { id: 555, position: 0, isDragging: ko.observable(false), setInactive: () => {}, viewmodel: {} };

            spyOn(adapter, 'updateContentPosition');
            editor.contentsList([content]);
        });

        it('should set dragging state to true', () => {
            editor.dragging(false);
            editor.startDragging();
            expect(editor.dragging()).toBeTruthy();
        });

        describe('when now dragging existing content (reordering)', () => {

            beforeEach(() => {
                contentPosition = content.position;
            });

            it('should set isDragging to true', () => {
                content.isDragging(false);
                editor.startDragging(contentPosition);
                expect(content.isDragging()).toBeTruthy();
            });

        });

        describe('when now dragging new content (create)', () => {

            beforeEach(() => {
                contentPosition = null;
            });

            it('should set showPlaceholders to true', () => {
                editor.showPlaceholders(false);
                editor.startDragging(contentPosition);
                expect(editor.showPlaceholders()).toBeTruthy();
            });

            it('should set all contents inactive', () => {
                spyOn(content, 'setInactive');
                editor.startDragging(contentPosition);
                expect(content.setInactive).toHaveBeenCalled();
            });

            it('should call editingEnded when it exists', () => {
                content.viewmodel.editingEnded = jasmine.createSpy();
                editor.startDragging(contentPosition);
                expect(content.viewmodel.editingEnded).toHaveBeenCalled();
            });

        });

    });

    describe('endDragging:', () => {
            
        let content;
        beforeEach(() => {
            content = { id: 555, position: 0, isDragging: ko.observable(false) };
            editor.contentsList([content]);
        });

        it('should set dragging state to false', () => {
            editor.dragging(true);
            editor.endDragging();
            expect(editor.dragging()).toBeFalsy();
        });

        it('should set showPlaceholders to false', () => {
            editor.showPlaceholders(true);
            editor.endDragging();
            expect(editor.showPlaceholders()).toBeFalsy();
        });

        it('should set isDragging to false for all contents', () => {
            content.isDragging(true);
            editor.endDragging();
            expect(content.isDragging()).toBeFalsy();
        });

    });

    describe('showPlaceholder:', () => {

        it('should set activePlaceholderIndex', () => {
            editor.activePlaceholderIndex(null);
            editor.showPlaceholder(1);
            expect(editor.activePlaceholderIndex()).toBe(1);
        });

        it('should trigger event', () => {
            spyOn(app, 'trigger');
            editor.showPlaceholder(1);
            expect(app.trigger).toHaveBeenCalledWith(constants.messages.content.startEditing);
        });

    });

    describe('hidePlaceholder:', () => {

        it('should clear activePlaceholderIndex', () => {
            editor.activePlaceholderIndex(2);
            editor.hidePlaceholder();
            expect(editor.activePlaceholderIndex()).toBeNull();
        });

    });

    describe('createContentFromPanel:', () => {

        let content, contentType = 'someType';
        beforeEach(() => {
            content = { id: 555, position: 0, isDragging: ko.observable(false), isActive: ko.observable(false) };
            editor.contentsList([content]);

            spyOn(editor, 'createContentItem');
        });

        describe('when activePlaceholderIndex is not null', () => {

            beforeEach(() => {
                editor.activePlaceholderIndex(1);
            });

            it('should call createContentItem', () => {
                editor.createContentFromPanel(contentType);
                expect(editor.createContentItem).toHaveBeenCalledWith(contentType, null, editor.activePlaceholderIndex());
            });

        });

        describe('when activePlaceholderIndex is null', () => {

            beforeEach(() => {
                editor.activePlaceholderIndex(null);
            });

            describe('and when there are no active contents', () => {

                beforeEach(() => {
                    content.isActive(false);
                });

                it('should do nothing', () => {
                    editor.createContentFromPanel(contentType);
                    expect(editor.createContentItem).not.toHaveBeenCalled();
                });

            });

            describe('and when active content exists', () => {
                
                beforeEach(() => {
                    content.isActive(true);
                });

                it('should call createContentItem', () => {
                    editor.createContentFromPanel(contentType);
                    expect(editor.createContentItem).toHaveBeenCalledWith(contentType, null, editor.contentsList.indexOf(content) + 1);
                });

            });

        });

    });

    describe('startCreatingContents:', () => {

        it('should show first placeholder', () => {
            spyOn(editor, 'showPlaceholder');
            editor.startCreatingContents();
            expect(editor.showPlaceholder).toHaveBeenCalledWith(0);
        });

    });

    describe('endEditingContents:', () => {

        let content, content2, content3;
        beforeEach(done => (async () => {
            content = await editor.mapContent({}, true);
            spyOn(content, 'setInactive');
            content2 = await editor.mapContent({}, true);
            spyOn(content2, 'setInactive');
            content3 = await editor.mapContent({}, true);
            spyOn(content3, 'setInactive');
            
            editor.contentsList([content, content2, content3]);
        })().then(done));

        it('should hide placeholder', () => {
            spyOn(editor, 'hidePlaceholder');
            editor.endEditingContents();
            expect(editor.hidePlaceholder).toHaveBeenCalled();
        });

        it('should set all contents inactive', () => {
            editor.endEditingContents();
            expect(content.setInactive).toHaveBeenCalled();
            expect(content2.setInactive).toHaveBeenCalled();
            expect(content3.setInactive).toHaveBeenCalled();
        });

        it('should call editingEnded if exists', () => {
            content.viewmodel.editingEnded = jasmine.createSpy('editingEnded');
            editor.endEditingContents();
            expect(content.viewmodel.editingEnded).toHaveBeenCalled();
        });

    });

});