define(['models/learningContent'], function (LearningContentModel) {

    describe('model [learningContent]', function () {

        it('should be defined', function () {
            expect(LearningContentModel).toBeDefined();
        });

        var learningContent;
        var spec = {
            id: 'id'
        };

        beforeEach(function () {
            learningContent = new LearningContentModel(spec);
        });

        describe('id:', function () {
            it('should be defined', function () {
                expect(learningContent.id).toBeDefined();
            });

            it('should be equal to spec id', function () {
                expect(learningContent.id).toBe(spec.id);
            });
        });
    });
});