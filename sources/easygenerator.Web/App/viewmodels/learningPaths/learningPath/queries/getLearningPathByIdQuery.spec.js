import query from './getLearningPathByIdQuery';

import dataContext from 'dataContext';

describe('query [getLearningPathById]', function () {

    describe('execute:', function () {
        var learningPath = {
            id: 'id',
            title: 'title'
        }

        describe('when learning path with specified id exists in data content', function() {
            beforeEach(function() {
                dataContext.learningPaths = [learningPath];
            });

            it('should return learning path', function (done) {
                query.execute(learningPath.id).then(function (data) {
                    expect(data).toBe(learningPath);
                    done();
                });
            });
        });

        describe('when learning path with specified id does not exist in data content', function () {
            beforeEach(function () {
                dataContext.learningPaths = [];
            });

            it('should return undefined', function (done) {
                query.execute(learningPath.id).then(function (data) {
                    expect(data).toBeUndefined();
                    done();
                });
            });
        });
    });
});
