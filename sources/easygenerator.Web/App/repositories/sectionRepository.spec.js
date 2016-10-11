import repository from './sectionRepository';

import constants from 'constants';
import apiHttpWrapper from 'http/apiHttpWrapper';
import dataContext from 'dataContext';
import app from 'durandal/app';

describe('repository [sectionRepository]', function () {

    var post;

    beforeEach(function () {
        post = Q.defer();
        spyOn(apiHttpWrapper, 'post').and.returnValue(post.promise);
        spyOn(app, 'trigger');
    });

    it('should be object', function () {
        expect(repository).toBeObject();
    });

    describe('getCollection:', function () {

        it('should be function', function () {
            expect(repository.getCollection).toBeFunction();
        });

        it('should return promise', function () {
            expect(repository.getCollection()).toBePromise();
        });

        describe('when sections received from server', function () {

            it('should resolve promise with sections from dataContext', function (done) {
                var promise = repository.getCollection();

                dataContext.sections = [{ id: 'obj1' }, { id: 'obj2' }];

                promise.fin(function () {
                    expect(promise).toBeResolvedWith(dataContext.sections);
                    done();
                });
            });

        });

    });

    describe('getById:', function () {

        it('should be function', function () {
            expect(repository.getById).toBeFunction();
        });

        it('should return promise', function () {
            expect(repository.getById()).toBePromise();
        });

        describe('when section id is undefined', function () {

            it('should reject promise', function (done) {
                var promise = repository.getById(undefined);

                promise.fin(function () {
                    expect(promise).toBeRejectedWith('Section id (string) was expected');
                    done();
                });
            });
        });

        describe('when section id is null', function () {

            it('should reject promise', function (done) {
                var promise = repository.getById(null);

                promise.fin(function () {
                    expect(promise).toBeRejectedWith('Section id (string) was expected');
                    done();
                });
            });

        });

        describe('when section id is not a string', function () {

            it('should reject promise', function (done) {
                var promise = repository.getById({});

                promise.fin(function () {
                    expect(promise).toBeRejectedWith('Section id (string) was expected');
                    done();
                });
            });

        });

        describe('when section exists on server', function () {

            describe('and section not found in repository', function () {

                it('should reject promise', function (done) {
                    var sectionId = 'sadasda';
                    dataContext.sections = [];

                    var promise = repository.getById(sectionId);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Section with this id is not found');
                        done();
                    });
                });

            });

            it('should resolve promise with section from dataContext', function (done) {
                var sectionId = 'sadasda';
                dataContext.sections = [{ id: sectionId, test: 'test' }];

                var promise = repository.getById(sectionId);

                promise.fin(function () {
                    expect(promise).toBeResolvedWith(dataContext.sections[0]);
                    done();
                });
            });

        });

    });

    describe('addSection:', function () {

        it('should be function', function () {
            expect(repository.addSection).toBeFunction();
        });

        it('should return promise', function () {
            expect(repository.addSection()).toBePromise();
        });

        describe('when section is undefined', function () {

            it('should reject promise', function (done) {
                var promise = repository.addSection(undefined);

                promise.fin(function () {
                    expect(promise).toBeRejectedWith('Section data is not an object');
                    done();
                });
            });

        });

        describe('when section is null', function () {

            it('should reject promise', function (done) {
                var promise = repository.addSection(null);

                promise.fin(function () {
                    expect(promise).toBeRejectedWith('Section data is not an object');
                    done();
                });
            });

        });

        describe('when section is not an object', function () {

            it('should reject promise', function (done) {
                var promise = repository.addSection('asdasdasd');

                promise.fin(function () {
                    expect(promise).toBeRejectedWith('Section data is not an object');
                    done();
                });
            });

        });

        it('should send request to \'api/section/create\'', function (done) {
            var section = { test: 'test' };
            var promise = repository.addSection(section);

            promise.fin(function () {
                expect(apiHttpWrapper.post).toHaveBeenCalledWith('api/section/create', section);
                done();
            });

            post.reject('lomai menya polnostju');
        });

        describe('when section successfully added on server', function () {

            describe('and response is not an object', function () {

                it('should reject promise', function (done) {
                    var section = { test: 'test' };
                    var promise = repository.addSection(section);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Response is not an object');
                        done();
                    });

                    post.resolve('lomai menya polnostju');
                });

            });

            describe('and response.Id is not a string', function () {

                it('should reject promise', function (done) {
                    var section = { test: 'test' };
                    var promise = repository.addSection(section);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Section Id is not a string');
                        done();
                    });

                    post.resolve({ ImageUrl: 'sadf', CreatedOn: 'dasdasd', CreatedBy: 'asdasd' });
                });

            });

            describe('and response.ImageUrl is not a string', function () {

                it('should reject promise', function (done) {
                    var section = { test: 'test' };
                    var promise = repository.addSection(section);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Section ImageUrl is not a string');
                        done();
                    });

                    post.resolve({ Id: 'sadf', CreatedOn: 'dasdasd', CreatedBy: 'asdasd' });
                });

            });

            describe('and response.CreatedOn is not a string', function () {

                it('should reject promise', function (done) {
                    var section = { test: 'test' };
                    var promise = repository.addSection(section);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Section creation date is not a string');
                        done();
                    });

                    post.resolve({ Id: 'assd', ImageUrl: 'sadf', CreatedBy: 'asdasd' });
                });

            });

            describe('and response.CreatedBy is not a string', function () {

                it('should reject promise', function (done) {
                    var section = { test: 'test' };
                    var promise = repository.addSection(section);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Section createdBy is not a string');
                        done();
                    });

                    post.resolve({ Id: 'assd', ImageUrl: 'sadf', CreatedOn: 'asdasd' });
                });

            });

            it('should add section to dataContext', function (done) {
                var section = { test: 'test', title: 'asdasdasdhfghfgh' },
                    sectionId = 'dasdasd',
                    imageUrl = 'url/to/image',
                    createdOn = new Date();

                dataContext.sections = [];

                var promise = repository.addSection(section);

                promise.fin(function () {
                    expect(dataContext.sections.length).toEqual(1);
                    expect(dataContext.sections[0].id).toEqual(sectionId);
                    expect(dataContext.sections[0].title).toEqual(section.title);
                    expect(dataContext.sections[0].image).toEqual(imageUrl);
                    expect(dataContext.sections[0].createdOn).toEqual(createdOn);
                    expect(dataContext.sections[0].modifiedOn).toEqual(createdOn);
                    done();
                });

                post.resolve({ Id: sectionId, ImageUrl: imageUrl, CreatedOn: createdOn.toISOString(), CreatedBy: 'asdasd@ukr.net' });
            });

            it('should resolve promise with received data', function (done) {
                var section = { test: 'test', title: 'asdasdasdhfghfgh', imageUrl: 'image/url' },
                    sectionId = 'dasdasd',
                    createdOn = new Date();

                dataContext.sections = [];

                var promise = repository.addSection(section);

                promise.fin(function () {
                    expect(promise).toBeResolvedWith({
                        id: sectionId,
                        createdOn: createdOn.toISOString(),
                        modifiedOn: createdOn.toISOString(),
                        title: section.title,
                        image: section.imageUrl,
                        questions: [],
                        createdBy: 'asdasd@ukr.net'
                    });
                    done();
                });

                post.resolve({ Id: sectionId, ImageUrl: section.imageUrl, CreatedOn: createdOn.toISOString(), CreatedBy: 'asdasd@ukr.net' });
            });

        });

    });

    describe('updateTitle:', function () {

        it('should be function', function () {
            expect(repository.updateTitle).toBeFunction();
        });

        it('should return promise', function () {
            expect(repository.updateTitle()).toBePromise();
        });

        describe('when sectionid is undefined', function () {

            it('should reject promise', function (done) {
                var promise = repository.updateTitle(undefined, 'title');

                promise.fin(function () {
                    expect(promise).toBeRejectedWith('Section data has invalid format');
                    done();
                });
            });

        });

        describe('when sectionId is null', function () {

            it('should reject promise', function (done) {
                var promise = repository.updateTitle(null, 'title');

                promise.fin(function () {
                    expect(promise).toBeRejectedWith('Section data has invalid format');
                    done();
                });
            });

        });

        describe('when title is undefined', function () {

            it('should reject promise', function (done) {
                var promise = repository.updateTitle('id', undefined);

                promise.fin(function () {
                    expect(promise).toBeRejectedWith('Section data has invalid format');
                    done();
                });
            });

        });

        describe('when title is null', function () {

            it('should reject promise', function (done) {
                var promise = repository.updateTitle('id', null);

                promise.fin(function () {
                    expect(promise).toBeRejectedWith('Section data has invalid format');
                    done();
                });
            });

        });

        it('should send request to \'api/section/updatetitle\'', function (done) {
            var obj = { id: 'asdadasd', title: 'asdasdadsasdas' };

            var promise = repository.updateTitle(obj.id, obj.title);

            promise.fin(function () {
                expect(apiHttpWrapper.post).toHaveBeenCalledWith('api/section/updatetitle', { sectionId: obj.id, title: obj.title });
                done();
            });

            post.reject('lomai menya polnostju');
        });

        describe('when section successfully updated on server', function () {

            describe('and response is not an object', function () {

                it('should reject promise', function (done) {
                    var obj = { id: 'asdadasd', title: 'asdasdadsasdas' };
                    var promise = repository.updateTitle(obj.id, obj.title);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Response is not an object');
                        done();
                    });

                    post.resolve('lomai menya polnostju');
                });

            });

            describe('and section not found in dataContext', function () {

                it('should reject promise', function (done) {
                    var obj = { id: 'asdadasd', title: 'asdasdadsasdas' };

                    dataContext.sections = [];

                    var promise = repository.updateTitle(obj.id, obj.title);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Section does not exist in dataContext');
                        done();
                    });

                    post.resolve({});
                });

            });

            it('should update section in dataContext', function (done) {
                var obj = { id: 'asdadasd', title: 'asdasdadsasdas' },
                    modifiedOn = new Date();

                dataContext.sections = [{ id: obj.id, title: '', modifiedOn: modifiedOn }];

                var promise = repository.updateTitle(obj.id, obj.title);

                promise.fin(function () {
                    expect(dataContext.sections[0].title).toEqual(obj.title);
                    expect(dataContext.sections[0].modifiedOn).toEqual(modifiedOn);
                    done();
                });

                post.resolve({});
            });

            it('should send section:titleUpdated event', function (done) {
                var obj = { id: 'asdadasd', title: 'asdasdadsasdas' };

                dataContext.sections = [{ id: obj.id, title: '', modifiedOn: '' }];

                var promise = repository.updateTitle(obj.id, obj.title);

                promise.fin(function () {
                    expect(app.trigger).toHaveBeenCalledWith(constants.messages.section.titleUpdated, dataContext.sections[0]);
                    done();
                });

                post.resolve({});
            });

        });

    });

    describe('updateLearningObjective:', function () {

        it('should be function', function () {
            expect(repository.updateLearningObjective).toBeFunction();
        });

        it('should return promise', function () {
            expect(repository.updateLearningObjective()).toBePromise();
        });

        describe('when sectionid is undefined', function () {

            it('should reject promise', function (done) {
                var promise = repository.updateLearningObjective(undefined, 'title');

                promise.fin(function () {
                    expect(promise).toBeRejectedWith('Section data has invalid format');
                    done();
                });
            });

        });

        describe('when sectionId is null', function () {

            it('should reject promise', function (done) {
                var promise = repository.updateLearningObjective(null, 'title');

                promise.fin(function () {
                    expect(promise).toBeRejectedWith('Section data has invalid format');
                    done();
                });
            });

        });

        describe('when title is undefined', function () {

            it('should reject promise', function (done) {
                var promise = repository.updateLearningObjective('id', undefined);

                promise.fin(function () {
                    expect(promise).toBeRejectedWith('Section data has invalid format');
                    done();
                });
            });

        });

        describe('when learningObjective is null', function () {

            it('should reject promise', function (done) {
                var promise = repository.updateLearningObjective('id', null);

                promise.fin(function () {
                    expect(promise).toBeRejectedWith('Section data has invalid format');
                    done();
                });
            });

        });

        it('should send request to \'api/section/updatelearningobjective\'', function (done) {
            var obj = { id: 'asdadasd', learningObjective: 'asdasdadsasdas' };

            var promise = repository.updateLearningObjective(obj.id, obj.learningObjective);

            promise.fin(function () {
                expect(apiHttpWrapper.post).toHaveBeenCalledWith('api/section/updatelearningobjective', { sectionId: obj.id, learningObjective: obj.learningObjective });
                done();
            });

            post.reject('lomai menya polnostju');
        });

        describe('when section successfully updated on server', function () {

            describe('and response is not an object', function () {

                it('should reject promise', function (done) {
                    var obj = { id: 'asdadasd', learningObjective: 'asdasdadsasdas' };
                    var promise = repository.updateLearningObjective(obj.id, obj.learningObjective);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Response is not an object');
                        done();
                    });

                    post.resolve('lomai menya polnostju');
                });

            });

            describe('and section not found in dataContext', function () {

                it('should reject promise', function (done) {
                    var obj = { id: 'asdadasd', learningObjective: 'asdasdadsasdas' };

                    dataContext.sections = [];

                    var promise = repository.updateLearningObjective(obj.id, obj.learningObjective);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Section does not exist in dataContext');
                        done();
                    });

                    post.resolve({});
                });

            });

            it('should update section in dataContext', function (done) {
                var obj = { id: 'asdadasd', learningObjective: 'asdasdadsasdas' },
                    modifiedOn = new Date();

                dataContext.sections = [{ id: obj.id, learningObjective: '', modifiedOn: modifiedOn }];

                var promise = repository.updateLearningObjective(obj.id, obj.learningObjective);

                promise.fin(function () {
                    expect(dataContext.sections[0].learningObjective).toEqual(obj.learningObjective);
                    expect(dataContext.sections[0].modifiedOn).toEqual(modifiedOn);
                    done();
                });

                post.resolve({});
            });

            it('should send section:titleUpdated event', function (done) {
                var obj = { id: 'asdadasd', learningObjective: 'asdasdadsasdas' };

                dataContext.sections = [{ id: obj.id, learningObjective: '', modifiedOn: '' }];

                var promise = repository.updateLearningObjective(obj.id, obj.learningObjective);

                promise.fin(function () {
                    expect(app.trigger).toHaveBeenCalledWith(constants.messages.section.learningObjectiveUpdated, dataContext.sections[0]);
                    done();
                });

                post.resolve({});
            });

        });

    });

    describe('updateImage:', function () {

        it('should be function', function () {
            expect(repository.updateImage).toBeFunction();
        });

        it('should return promise', function () {
            expect(repository.updateImage()).toBePromise();
        });

        describe('when sectionid is undefined', function () {

            it('should reject promise', function (done) {
                var promise = repository.updateImage(undefined, 'image/url');

                promise.fin(function () {
                    expect(promise).toBeRejectedWith('Section data has invalid format');
                    done();
                });
            });

        });

        describe('when sectionId is null', function () {

            it('should reject promise', function (done) {
                var promise = repository.updateImage(null, 'image/url');

                promise.fin(function () {
                    expect(promise).toBeRejectedWith('Section data has invalid format');
                    done();
                });
            });

        });

        describe('when imageUrl is undefined', function () {

            it('should reject promise', function (done) {
                var promise = repository.updateImage('id', undefined);

                promise.fin(function () {
                    expect(promise).toBeRejectedWith('Section data has invalid format');
                    done();
                });
            });

        });

        describe('when imageUrl is null', function () {

            it('should reject promise', function (done) {
                var promise = repository.updateImage('id', null);

                promise.fin(function () {
                    expect(promise).toBeRejectedWith('Section data has invalid format');
                    done();
                });
            });

        });

        it('should send request to \'api/section/updateimage\'', function (done) {
            var obj = { id: 'section_id', imageUrl: 'image/url' };
            var promise = repository.updateImage(obj.id, obj.imageUrl);

            promise.fin(function () {
                expect(apiHttpWrapper.post).toHaveBeenCalledWith('api/section/updateimage', { sectionId: obj.id, imageUrl: obj.imageUrl + '?width=120&height=120&scaleBySmallerSide=true' });
                done();
            });

            post.reject('lomai menya polnostju');
        });

        describe('when section imageUrl successfully updated on server', function () {

            describe('and response is not an object', function () {

                it('should reject promise', function (done) {
                    var obj = { id: 'section_id', imageUrl: 'image/url' };
                    var promise = repository.updateImage(obj.id, obj.imageUrl);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Response is not an object');
                        done();
                    });

                    post.resolve('lomai menya polnostju');
                });

            });

            describe('and section not found in dataContext', function () {

                it('should reject promise', function (done) {
                    var obj = { id: 'section_id', imageUrl: 'image/url' };

                    dataContext.sections = [];

                    var promise = repository.updateImage(obj.id, obj.imageUrl);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Section does not exist in dataContext');
                        done();
                    });

                    post.resolve({});
                });

            });

            it('should update section in dataContext', function (done) {
                var obj = { id: 'section_id', imageUrl: 'image/url' },
                    modifiedOn = new Date();

                dataContext.sections = [{ id: obj.id, imageUrl: '', modifiedOn: modifiedOn }];

                var promise = repository.updateImage(obj.id, obj.imageUrl);

                promise.fin(function () {
                    expect(dataContext.sections[0].image).toEqual(obj.imageUrl + '?width=120&height=120&scaleBySmallerSide=true');
                    expect(dataContext.sections[0].modifiedOn).toEqual(modifiedOn);
                    done();
                });

                post.resolve({});
            });

            it('should send section:imageUrlUpdated event', function (done) {
                var obj = { id: 'section_id', imageUrl: 'image/url' };

                dataContext.sections = [{ id: obj.id, imageUrl: '', modifiedOn: '' }];

                var promise = repository.updateImage(obj.id, obj.imageUrl);

                promise.fin(function () {
                    expect(app.trigger).toHaveBeenCalledWith(constants.messages.section.imageUrlUpdated, dataContext.sections[0]);
                    done();
                });

                post.resolve({});
            });

            it('should resolve promise with image url', function (done) {
                var obj = { id: 'section_id', imageUrl: 'image/url' };

                dataContext.sections = [{ id: obj.id, imageUrl: '', modifiedOn: '' }];

                var promise = repository.updateImage(obj.id, obj.imageUrl);

                promise.fin(function () {
                    expect(promise).toBeResolvedWith({
                        imageUrl: obj.imageUrl + '?width=120&height=120&scaleBySmallerSide=true'
                    });
                    done();
                });

                post.resolve({});
            });

        });

    });

    describe('removeSection:', function () {

        it('should be function', function () {
            expect(repository.removeSection).toBeFunction();
        });

        it('should return promise', function () {
            expect(repository.removeSection()).toBePromise();
        });

        describe('when section is undefined', function () {

            it('should reject promise', function (done) {
                var promise = repository.removeSection(undefined);

                promise.fin(function () {
                    expect(promise).toBeRejectedWith('Section id was expected');
                    done();
                });
            });

        });

        describe('when section is null', function () {

            it('should reject promise', function (done) {
                var promise = repository.removeSection(null);

                promise.fin(function () {
                    expect(promise).toBeRejectedWith('Section id was expected');
                    done();
                });
            });

        });

        describe('when section is not a string', function () {

            it('should reject promise', function (done) {
                var promise = repository.removeSection({});

                promise.fin(function () {
                    expect(promise).toBeRejectedWith('Section id was expected');
                    done();
                });
            });

        });

        it('should send request to \'api/section/delete\'', function (done) {
            var sectionId = 'asdadsasdasd';
            var promise = repository.removeSection(sectionId);

            promise.fin(function () {
                expect(apiHttpWrapper.post).toHaveBeenCalledWith('api/section/delete', { sectionId: sectionId });
                done();
            });

            post.reject('lomai menya polnostju');
        });

        describe('when section successfully deleted from server', function () {

            it('should remove section from dataContext', function (done) {
                var sectionId = 'asdadsasdasd';
                dataContext.sections = [{ id: sectionId }];

                var promise = repository.removeSection(sectionId);

                promise.fin(function () {
                    expect(dataContext.sections.length).toEqual(0);
                    done();
                });

                post.resolve();
            });

        });

    });

    describe('updateQuestionsOrder:', function () {

        it('should be function', function () {
            expect(repository.updateQuestionsOrder).toBeFunction();
        });

        it('should return promise', function () {
            expect(repository.updateQuestionsOrder()).toBePromise();
        });


        describe('when section is undefined', function () {

            it('should reject promise', function (done) {
                var promise = repository.updateQuestionsOrder(undefined, []);

                promise.fin(function () {
                    expect(promise).toBeRejectedWith('Section id (string) was expected');
                    done();
                });
            });

        });

        describe('when section is null', function () {

            it('should reject promise', function (done) {
                var promise = repository.updateQuestionsOrder(null, []);

                promise.fin(function () {
                    expect(promise).toBeRejectedWith('Section id (string) was expected');
                    done();
                });
            });

        });

        describe('when section is not a string', function () {

            it('should reject promise', function (done) {
                var promise = repository.updateQuestionsOrder({}, []);

                promise.fin(function () {
                    expect(promise).toBeRejectedWith('Section id (string) was expected');
                    done();
                });
            });

        });

        describe('when questions undefined', function () {

            it('should reject promise', function (done) {
                var promise = repository.updateQuestionsOrder('asdadads', undefined);

                promise.fin(function () {
                    expect(promise).toBeRejectedWith('Questions is not array');
                    done();
                });
            });

        });

        describe('when questions null', function () {

            it('should reject promise', function (done) {
                var promise = repository.updateQuestionsOrder('asdadads', null);

                promise.fin(function () {
                    expect(promise).toBeRejectedWith('Questions is not array');
                    done();
                });
            });

        });

        describe('when questions is not an array', function () {

            it('should reject promise', function (done) {
                var promise = repository.updateQuestionsOrder('asdadads', {});

                promise.fin(function () {
                    expect(promise).toBeRejectedWith('Questions is not array');
                    done();
                });
            });

        });

        it('should send request to \'api/section/updatequestionsorder\'', function (done) {
            var sectionId = 'dfhsfgsfgh',
                questionId = 'asdasdasd';

            var promise = repository.updateQuestionsOrder(sectionId, [{ id: questionId }]);

            promise.fin(function () {
                expect(apiHttpWrapper.post).toHaveBeenCalledWith('api/section/updatequestionsorder', { sectionId: sectionId, questions: [questionId] });
                done();
            });

            post.reject('lomai menya polnostju');
        });

        describe('when questions order successfully updated on server', function () {

            describe('and response is not an object', function () {

                it('should reject promise', function (done) {
                    var sectionId = 'dfhsfgsfgh',
                        questionId = 'asdasdasd';

                    var promise = repository.updateQuestionsOrder(sectionId, [{ id: questionId }]);
                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Response is not an object');
                        done();
                    });

                    post.resolve('lomai menya polnostju');
                });

            });
                       
            describe('and section not found in dataContext', function () {

                it('should reject promise', function (done) {
                    var sectionId = 'dfhsfgsfgh',
                        questionId = 'asdasdasd';

                    dataContext.sections = [];

                    var promise = repository.updateQuestionsOrder(sectionId, [{ id: questionId }]);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Section does not exist in dataContext');
                        done();
                    });

                    post.resolve({});
                });

            });

            it('should update section in dataContext', function (done) {
                var sectionId = 'dfhsfgsfgh',
                    questionId1 = 'asdasdasd',
                    questionId2 = 'asdasdasd2';

                dataContext.sections = [{ id: sectionId, questions: [{ id: questionId2 }, { id: questionId1 }] }];

                var promise = repository.updateQuestionsOrder(sectionId, [{ id: questionId1 }, { id: questionId2 }]);

                promise.fin(function () {
                    expect(dataContext.sections[0].questions[0].id).toEqual(questionId1);
                    expect(dataContext.sections[0].questions[1].id).toEqual(questionId2);
                    done();
                });

                post.resolve({});
            });

            it('should trigger section:questionsReordered event', function (done) {
                var sectionId = 'dfhsfgsfgh',
                    questionId1 = 'asdasdasd',
                    questionId2 = 'asdasdasd2';

                dataContext.sections = [{ id: sectionId, questions: [{ id: questionId2 }, { id: questionId1 }] }];

                var promise = repository.updateQuestionsOrder(sectionId, [{ id: questionId1 }, { id: questionId2 }]);

                promise.fin(function () {
                    expect(app.trigger).toHaveBeenCalledWith(constants.messages.section.questionsReordered, dataContext.sections[0]);
                    done();
                });

                post.resolve({});
            });
        
        });

    });

});
