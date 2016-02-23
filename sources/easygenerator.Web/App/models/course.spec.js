import courseModel from './course';

var course = new courseModel({});

describe('model [course]', function () {

    describe('publishForReview:', function () {

        it('should be function', function () {
            expect(course.publishForReview).toBeFunction();
        });

    });
});
