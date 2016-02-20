import query from './getLearningPathCollectionQuery';

import dataContext from 'dataContext';

describe('query [getLearningPathCollectionQuery]', function () {

    describe('execute:', function () {
        var learningPath = {
            id: 'id',
            title: 'title'
        }
        beforeEach(function () {
            dataContext.learningPaths = [learningPath];
        });

        it('should return learning path collection', function (done) {
            query.execute().then(function (data) {
                expect(data).toBe(dataContext.learningPaths);
                done();
            });
        });

    });
});
