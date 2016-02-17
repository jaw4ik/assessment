import Repository from './documentRepository';

import dataContext from 'dataContext';
import guard from 'guard';
import apiHttpWrapper from 'http/apiHttpWrapper';
import documentModelMapper from 'mappers/documentModelMapper';

var repository = new Repository();

describe('DocumentRepository:', () => {

    it('should be class', () => {
        expect(Repository).toBeFunction();
    });

    describe('getById:', () => {

        it('should be function', () => {
            expect(repository.getById).toBeFunction();
        });

        describe('when id is not a string', () => {

            it('should throw error', () => {
                var f = () => {
                    repository.getById(null);
                };
                expect(f).toThrow('Document id (string) was expected');
            });

        });

        describe('when no such document in dataContext', () => {

            it('should throw error', () => {
                var f = () => {
                    repository.getById('ololo++');
                }
                expect(f).toThrow('Document with this id is not found');
            });

        });

        describe('when document exists in dataContext', () => {
            var document = { id: '123' };

            beforeEach(() => {
                dataContext.documents = [document];
            });

            it('should return document from dataContext', () => {
                var _document = repository.getById('123');
                expect(_document).toBe(document);
            });

        });

    });

    describe('getCollection', () => {

        var documents = [{ id: '123' }, { id: '124' }];

        beforeEach(() => {
            dataContext.documents = documents;
        });

        it('should be function', () => {
            expect(repository.getCollection).toBeFunction();
        });

        it('should return documents collection', () => {
            var _documents = repository.getCollection();
            expect(_documents).toBe(documents);
        });

    });

    describe('addDocument', () => {

        var dfd;

        beforeEach(() => {
            dfd = Q.defer();
            spyOn(apiHttpWrapper, 'post').and.returnValue(dfd.promise);
        });

        it('should be function', () => {
            expect(repository.addDocument).toBeFunction();
        });

        it('should return promise', () => {
            expect(repository.addDocument(0, 'sxx', 'sd')).toBePromise();
        });

        describe('when document type is incorrect', () => {

            it('should throw error', done => (async () => {
                var type = 10;
                try {
                    await repository.addDocument(type);
                    throw 'promise should not be resolved';
                } catch (e) {
                    expect(e).toBe(`${type} is not valid document type`);
                }
            })().then(done));

        });

        describe('when document title is incorrect', () => {

            it('should throw error', done => (async () => {
                var type = 0;
                try {
                    await repository.addDocument(type, null);
                    throw 'promise should not be resolved';
                } catch (e) {
                    expect(e).toBe('Document title (string) was expected');
                }
            })().then(done));

        });

        describe('when document embedCode is incorrect', () => {

            it('should throw error',  done => (async () => {
                var type = 0;
                try {
                    await repository.addDocument(type, 'dsfsd', null);
                    throw 'promise should not be resolved';
                } catch (e) {
                    expect(e).toBe('EmbedCode (string) was expected');
                }
            })().then(done));

        });

        describe('when all arguments passed correctly', () => {

            it('should send request with correct args', () => {
                repository.addDocument(0, 'ddsc', 'dcsdcsd');
                expect(apiHttpWrapper.post).toHaveBeenCalledWith('api/document/create', { title: 'ddsc', embedCode: 'dcsdcsd', documentType: 0 });
            });

            describe('when request was successfull', () => {

                describe('and response is not an object', () => {

                    beforeEach(() => {
                        dfd.resolve(null);
                        spyOn(guard, 'throwIfNotAnObject');
                    });

                    it('should throw error', done => (async() => {
                        var promise = repository.addDocument(0, 'ddsc', 'dcsdcsd');
                        await promise.catch(() => {});
                        expect(guard.throwIfNotAnObject).toHaveBeenCalled();
                    })().then(done));

                });

                describe('and response is an object', () => {

                    var document = { id: '123' };
                    var mappedDocument = { id: '123', type: 0 };

                    beforeEach(() => {
                        dataContext.documents = [];
                        dfd.resolve(document);
                        spyOn(documentModelMapper, 'map').and.returnValue(mappedDocument);
                    });

                    it('should map response', done => (async () => {
                        await repository.addDocument(0, 'ddsc', 'dcsdcsd');
                        expect(documentModelMapper.map).toHaveBeenCalledWith(document);
                    })().then(done));

                    it('should push mapped response to dataContext', done => (async () => {
                        await repository.addDocument(0, 'ddsc', 'dcsdcsd');
                        expect(dataContext.documents[dataContext.documents.length - 1]).toBe(mappedDocument);
                    })().then(done));


                    it('should resolve promise with mapped document', done => (async () => {
                        var response = await repository.addDocument(0, 'ddsc', 'dcsdcsd');
                        expect(response).toBe(mappedDocument);
                    })().then(done));

                });

            });

        });

    });

    describe('updateDocumentTitle', () => {

        var dfd;

        beforeEach(() => {
            dfd = Q.defer();
            spyOn(apiHttpWrapper, 'post').and.returnValue(dfd.promise);
        });

        it('should be function', () => {
            expect(repository.updateDocumentTitle).toBeFunction();
        });

        it('should return promise', () => {
            expect(repository.updateDocumentTitle('123', 'dsdgg')).toBePromise();
        });

        describe('when document id is incorrect', () => {

            it('should throw error', done => (async () => {
                try {
                    await repository.updateDocumentTitle(null);
                    throw 'promise should not be resolved';
                } catch (e) {
                    expect(e).toBe('Document id is not a string');
                }
            })().then(done));

        });

        describe('when document title is incorrect', () => {

            it('should throw error', done => (async () => {
                var id = 'dsf';
                try {
                    await repository.updateDocumentTitle(id, null);
                    throw 'promise should not be resolved';
                } catch (e) {
                    expect(e).toBe('Document title is not a string');
                }
            })().then(done));

        });

        describe('when all arguments passed correctly', () => {

            it('should send request with correct args', () => {
                repository.updateDocumentTitle('ddsc', 'dcsdcsd');
                expect(apiHttpWrapper.post).toHaveBeenCalledWith('api/document/updateTitle', {
                    documentId: 'ddsc',
                    documentTitle: 'dcsdcsd'
                });
            });

            describe('when request was successfull', () => {

                describe('and response is not an object', () => {

                    beforeEach(() => {
                        dfd.resolve(null);
                        spyOn(guard, 'throwIfNotAnObject');
                    });

                    it('should throw error', done => (async() => {
                        var promise = repository.updateDocumentTitle('ddsc', 'dcsdcsd');
                        await promise.catch(() => {});
                        expect(guard.throwIfNotAnObject).toHaveBeenCalled();
                    })().then(done));

                });

                describe('and response is an object', () => {

                    describe('and response does not contain modifiedOn', () => {

                        beforeEach(() => {
                            dfd.resolve({});
                            spyOn(guard, 'throwIfNotString');
                        });

                        it('should throw error', done => (async() => {
                            var promise = repository.updateDocumentTitle('ddsc', 'dcsdcsd');
                            await promise.catch(() => {});
                            expect(guard.throwIfNotString).toHaveBeenCalled();
                        })().then(done));

                    });

                    describe('and response contains modifiedOn', () => {

                        describe('and no such document in dataContext', () => {

                            var modifiedOn = Date.now();

                            beforeEach(() => {
                                dataContext.documents = [];
                                dfd.resolve({ modifiedOn });
                                spyOn(guard, 'throwIfNotAnObject');
                            });

                            it('should trow error', done => (async() => {
                                var promise = repository.updateDocumentTitle('456', 'dcsdcsd');
                                await promise.catch(() => {});
                                expect(guard.throwIfNotAnObject).toHaveBeenCalled();
                            })().then(done));

                        });

                        describe('and document exists in dataContext', () => {

                            var modifiedOn = (new Date()).toString();
                            var document = { id: '456' };

                            beforeEach(() => {
                                dataContext.documents = [document];
                                dfd.resolve({ ModifiedOn: modifiedOn });
                            });

                            it('should update document title', done => (async() => {
                                await repository.updateDocumentTitle('456', 'dcsdcsd');
                                expect(document.title).toBe('dcsdcsd');
                            })().then(done));

                            it('should update document modifiedOn', done => (async() => {
                                await repository.updateDocumentTitle('456', 'dcsdcsd');
                                expect(document.modifiedOn.valueOf()).toBe((new Date(modifiedOn)).valueOf());
                            })().then(done));

                            it('should resolve promise with modifiedOn', done => (async () => {
                                var response = await repository.updateDocumentTitle('456', 'dcsdcsd');
                                expect(response.valueOf()).toBe((new Date(modifiedOn)).valueOf());
                            })().then(done));

                        });

                    });

                });

            });

        });

    });

    describe('updateDocumentEmbedCode', () => {

        var dfd;

        beforeEach(() => {
            dfd = Q.defer();
            spyOn(apiHttpWrapper, 'post').and.returnValue(dfd.promise);
        });

        it('should be function', () => {
            expect(repository.updateDocumentEmbedCode).toBeFunction();
        });

        it('should return promise', () => {
            expect(repository.updateDocumentEmbedCode('123', 'dsdgg')).toBePromise();
        });

        describe('when document id is incorrect', () => {

            it('should throw error', done => (async () => {
                try {
                    await repository.updateDocumentEmbedCode(null);
                    throw 'promise should not be resolved';
                } catch (e) {
                    expect(e).toBe('Document id is not a string');
                }
            })().then(done));

        });

        describe('when document embedCode is incorrect', () => {

            it('should throw error', done => (async () => {
                var id = 'dsf';
                try {
                    await repository.updateDocumentEmbedCode(id, null);
                    throw 'promise should not be resolved';
                } catch (e) {
                    expect(e).toBe('Document embedCode is not a string');
                }
            })().then(done));

        });

        describe('when all arguments passed correctly', () => {

            it('should send request with correct args', () => {
                repository.updateDocumentEmbedCode('ddsc', 'dcsdcsd');
                expect(apiHttpWrapper.post).toHaveBeenCalledWith('api/document/updateEmbedCode', {
                    documentId: 'ddsc',
                    documentEmbedCode: 'dcsdcsd'
                });
            });

            describe('when request was successfull', () => {

                describe('and response is not an object', () => {

                    beforeEach(() => {
                        dfd.resolve(null);
                        spyOn(guard, 'throwIfNotAnObject');
                    });

                    it('should throw error', done => (async() => {
                        var promise = repository.updateDocumentEmbedCode('ddsc', 'dcsdcsd');
                        await promise.catch(() => {});
                        expect(guard.throwIfNotAnObject).toHaveBeenCalled();
                    })().then(done));

                });

                describe('and response is an object', () => {

                    describe('and response does not contain modifiedOn', () => {

                        beforeEach(() => {
                            dfd.resolve({});
                            spyOn(guard, 'throwIfNotString');
                        });

                        it('should throw error', done => (async() => {
                            var promise = repository.updateDocumentEmbedCode('ddsc', 'dcsdcsd');
                            await promise.catch(() => {});
                            expect(guard.throwIfNotString).toHaveBeenCalled();
                        })().then(done));

                    });

                    describe('and response contains modifiedOn', () => {

                        describe('and no such document in dataContext', () => {

                            var modifiedOn = Date.now();

                            beforeEach(() => {
                                dataContext.documents = [];
                                dfd.resolve({ modifiedOn });
                                spyOn(guard, 'throwIfNotAnObject');
                            });

                            it('should trow error', done => (async() => {
                                var promise = repository.updateDocumentEmbedCode('456', 'dcsdcsd');
                                await promise.catch(() => {});
                                expect(guard.throwIfNotAnObject).toHaveBeenCalled();
                            })().then(done));

                        });

                        describe('and document exists in dataContext', () => {

                            var modifiedOn = (new Date()).toString();
                            var document = { id: '456' };

                            beforeEach(() => {
                                dataContext.documents = [document];
                                dfd.resolve({ ModifiedOn: modifiedOn });
                            });

                            it('should update document embedCode', done => (async() => {
                                await repository.updateDocumentEmbedCode('456', 'dcsdcsd');
                                expect(document.embedCode).toBe('dcsdcsd');
                            })().then(done));

                            it('should update document modifiedOn', done => (async() => {
                                await repository.updateDocumentEmbedCode('456', 'dcsdcsd');
                                expect(document.modifiedOn.valueOf()).toBe((new Date(modifiedOn)).valueOf());
                            })().then(done));

                            it('should resolve promise with modifiedOn', done => (async () => {
                                var response = await repository.updateDocumentEmbedCode('456', 'dcsdcsd');
                                expect(response.valueOf()).toBe((new Date(modifiedOn)).valueOf());
                            })().then(done));

                        });

                    });

                });

            });

        });

    });

    describe('removeDocument', () => {

        var dfd;

        beforeEach(() => {
            dfd = Q.defer();
            spyOn(apiHttpWrapper, 'post').and.returnValue(dfd.promise);
        });

        it('should be function', () => {
            expect(repository.removeDocument).toBeFunction();
        });

        it('should return promise', () => {
            expect(repository.removeDocument('123')).toBePromise();
        });

        describe('when document id is incorrect', () => {

            it('should throw error', done => (async () => {
                try {
                    await repository.removeDocument(null);
                    throw 'promise should not be resolved';
                } catch (e) {
                    expect(e).toBe('Document id (string) was expected');
                }
            })().then(done));

        });

        describe('when all arguments passed correctly', () => {

            it('should send request with correct args', () => {
                repository.removeDocument('123');
                expect(apiHttpWrapper.post).toHaveBeenCalledWith('api/document/delete', { documentId: '123' });
            });

            describe('when request was successfull', () => {

                describe('and response is not an object', () => {

                    var document = { id: '123' };

                    beforeEach(() => {
                        dataContext.documents = [document];
                        dfd.resolve(null);
                    });

                    it('should remove document from dataContext', done => (async() => {
                        await repository.removeDocument('123');
                        expect(dataContext.documents.length).toBe(0);
                    })().then(done));

                });

                describe('and response is an object', () => {

                    var document = { id: '123' };
                    var learningPath = { id: '124', entities: [document] };

                    beforeEach(() => {
                        dataContext.documents = [document];
                        dataContext.learningPaths = [learningPath];
                        dfd.resolve({ deletedFromLearningPathIds: ['124'] });
                    });

                    it('should remove document from dataContext', done => (async() => {
                        await repository.removeDocument('123');
                        expect(dataContext.documents.length).toBe(0);
                    })().then(done));

                    it('should remove deleted document from learningPaths', done => (async() => {
                        await repository.removeDocument('123');
                        expect(dataContext.learningPaths[0].entities.length).toBe(0);
                    })().then(done));

                });

            });

        });

    });

});