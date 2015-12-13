import repository from 'repositories/commentRepository';
import apiHttpWrapper from 'http/apiHttpWrapper';

describe('repository [commentRepository]', () => {

    let post;

    beforeEach(() => {
        post = Q.defer();
        spyOn(apiHttpWrapper, 'post').and.returnValue(post.promise);
    });

    it('should be defined', () => {
        expect(repository).toBeDefined();
    });

    describe('getCollection:', () => {

        it('should return promise', () => {
            expect(repository.getCollection()).toBePromise();
        });

        describe('when course id is undefined', () => {

            it('should reject promise', (done) => {
                let promise = repository.getCollection(undefined);

                promise.fin(() => {
                    expect(promise).toBeRejectedWith('Course id is not a string');
                    done();
                });
            });

        });

        describe('when course id is null', () => {

            it('should reject promise', (done) => {
                let promise = repository.getCollection(null);

                promise.fin(() => {
                    expect(promise).toBeRejectedWith('Course id is not a string');
                    done();
                });
            });

        });

        describe('when course id is not a string', () => {

            it('should reject promise', (done) => {
                let promise = repository.getCollection({});

                promise.fin(() => {
                    expect(promise).toBeRejectedWith('Course id is not a string');
                    done();
                });
            });

        });

        it('should send request to \'api/comments\'', (done) => {
            let courseId = 'SomeId';
            let promise = repository.getCollection(courseId);

            promise.fin(() => {
                expect(apiHttpWrapper.post).toHaveBeenCalledWith('api/comments', { courseId: courseId });
                done();
            });

            post.reject('Boetz eto zalet');
        });

        describe('when comments received from server', () => {

            describe('and response is not an object', () => {

                it('should reject promise', (done) => {
                    let promise = repository.getCollection('123123132123');

                    promise.fin(() => {
                        expect(promise).toBeRejectedWith('Response is not an object');
                        done();
                    });

                    post.resolve('Boetz eto zalet');
                });

            });

            describe('and response.Comments is undefined', () => {

                it('should reject promise', (done) => {
                    let promise = repository.getCollection('123123132123');

                    promise.fin(() => {
                        expect(promise).toBeRejectedWith('Comments is not an array');
                        done();
                    });

                    post.resolve({});
                });

            });

            describe('and response.Comments is not an Array', () => {

                it('should reject promise', (done) => {
                    let promise = repository.getCollection('123123132123');

                    promise.fin(() => {
                        expect(promise).toBeRejectedWith('Comments is not an array');
                        done();
                    });

                    post.resolve({ Comments: 'trololo' });
                });

            });

            it('should resolve promise with mapped comments array', (done) => {
                let comments = [
                {
                    Id: 'qwe',
                    Text: 'fghsdhdfgh',
                    CreatedOn: new Date().toISOString()
                }];

                let promise = repository.getCollection('123123132123');

                promise.fin(() => {
                    expect(promise.inspect().value.length).toEqual(1);
                    expect(promise.inspect().value[0].id).toEqual(comments[0].Id);
                    expect(promise.inspect().value[0].text).toEqual(comments[0].Text);
                    expect(promise.inspect().value[0].createdOn).toEqual(comments[0].CreatedOn);
                    done();
                });

                post.resolve({ Comments: comments });
            });

        });

    });

    describe('removeComment', () => {

        xit('should return promise', () => {
            expect(repository.removeComment()).toBePromise();
        });

        describe('when course id is null', () => {

            it('should reject promise', (done) => {
                let promise = repository.removeComment(null, null);

                promise.fin(() => {
                    expect(promise).toBeRejectedWith('Course id is not a string');
                    done();
                });
            });

        });

        describe('when comment id is null', () => {

            it('should reject promise', (done) => {
                let promise = repository.removeComment('courseId', null);

                promise.fin(() => {
                    expect(promise).toBeRejectedWith('Comment id is not a string');
                    done();
                });
            });

        });

        describe('when courseId and commentId are strings', () => {
            let courseId = 'SomeId',
                commentId = 'commentId';

            it('should send request to \'api/comment/delete\'', (done) => {
                let promise = repository.removeComment(courseId, commentId);

                promise.fin(() => {
                    expect(apiHttpWrapper.post).toHaveBeenCalledWith('api/comment/delete', { courseId: courseId, commentId: commentId });
                    done();
                });

                post.reject('error');
            });

            describe('and response is not a boolean', () => {
                it('should reject promise', (done) => {
                    let promise = repository.removeComment(courseId, commentId);

                    promise.fin(() => {
                        expect(promise).toBeRejectedWith('Response is not a boolean');
                        done();
                    });

                    post.resolve("");
                });

            });

            describe('and response is boolean', () => {
                it('should return response', (done) => {
                    let promise = repository.removeComment(courseId, commentId);

                    promise.fin(() => {
                        expect(promise.inspect()).toBeTruthy();
                        done();
                    });

                    post.resolve(true);
                });
            });
        });
    });

    describe('restoreComment', () => {
            
        it('should return promise', () => {
            expect(repository.restoreComment()).toBePromise();
        });

        describe('when course id is null', () => {

            it('should reject promise', (done) => {
                let promise = repository.restoreComment(null, null);

                promise.fin(() => {
                    expect(promise).toBeRejectedWith('Course id is not a string');
                    done();
                });
            });

        });

        describe('when comment data is null', () => {

            it('should reject promise', (done) => {
                let promise = repository.restoreComment('courseId', null);

                promise.fin(() => {
                    expect(promise).toBeRejectedWith('Comment data is not an object');
                    done();
                });
            });

        });

        describe('when comment text is undefined', () => {

            it('should reject promise', (done) => {
                let promise = repository.restoreComment('courseId', {
                    name: 'name',
                    email: 'email',
                    createdOn: '2015-12-10'
                });

                promise.fin(() => {
                    expect(promise).toBeRejectedWith('Comment text is not a string');
                    done();
                });
            });
        });

        describe('when comment name is undefined', () => {

            it('should reject promise', (done) => {
                let promise = repository.restoreComment('courseId', {
                    text: 'text',
                    email: 'email',
                    createdOn: '2015-12-10'
                });

                promise.fin(() => {
                    expect(promise).toBeRejectedWith('Comment name is not a string');
                    done();
                });
            });
        });

        describe('when comment email is undefined', () => {

            it('should reject promise', (done) => {
                let promise = repository.restoreComment('courseId', {
                    text: 'text',
                    name: 'name',
                    createdOn: '2015-12-10'
                });

                promise.fin(() => {
                    expect(promise).toBeRejectedWith('Comment email is not a string');
                    done();
                });
            });
        });

        describe('when comment createdOn is undefined', () => {

            it('should reject promise', (done) => {
                let promise = repository.restoreComment('courseId', {
                    text: 'text',
                    name: 'name',
                    email: 'email'
                });

                promise.fin(() => {
                    expect(promise).toBeRejectedWith('Comment createdOn is not a date');
                    done();
                });
            });
        });

        describe('when comment createdOn is not a date', () => {

            it('should reject promise', (done) => {
                let promise = repository.restoreComment('courseId', {
                    text: 'text',
                    name: 'name',
                    email: 'email',
                    createdOn: ''
                });

                promise.fin(() => {
                    expect(promise).toBeRejectedWith('Comment createdOn is not a date');
                    done();
                });
            });
        });

        describe('when courseId and comment are defined', () => {
            let courseId = 'SomeId',
                comment = {
                    text: 'text',
                    name: 'name',
                    email: 'email',
                    createdOn: '2015-12-10'
                };;

            it('should send request to \'api/comment/restore\'', (done) => {
                let promise = repository.restoreComment(courseId, comment);

                promise.fin(() => {
                    expect(apiHttpWrapper.post).toHaveBeenCalledWith('api/comment/restore', {
                        courseId: courseId,
                        text: comment.text,
                        createdByName: comment.name,
                        createdBy: comment.email,
                        createdOn: comment.createdOn
                    });
                    done();
                });

                post.reject('error');
            });

            describe('and response is not a string', () => {
                it('should reject promise', (done) => {
                    let promise = repository.restoreComment(courseId, comment);

                    promise.fin(() => {
                        expect(promise).toBeRejectedWith('Response is not a string');
                        done();
                    });

                    post.resolve();
                });

            });

            describe('and response is string', () => {
                it('should return response', (done) => {
                    let promise = repository.restoreComment(courseId, comment);

                    promise.fin(() => {
                        expect(promise.inspect().value).toBe('id');
                        done();
                    });

                    post.resolve('id');
                });
            });
        });
    });
});