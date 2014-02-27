define(['models/objective'], function (ObjectiveModel) {

    describe('model [objective]', function () {

        it('should be defined', function () {
            expect(ObjectiveModel).toBeDefined();
        });

        it('should return function', function () {
            expect(ObjectiveModel).toBeFunction();
        });

        var spec = {
            id: 'id',
            title: 'title',
            image: 'image',
            score: 0,
            questions: []
        };
        var objective;

        beforeEach(function () {
            objective = new ObjectiveModel(spec);
        });

        describe('id:', function () {
            it('should be defined', function () {
                expect(objective.id).toBeDefined();
            });

            it('should be equal to spec id', function () {
                expect(objective.id).toBe(spec.id);
            });
        });

        describe('title:', function () {
            it('should be defined', function () {
                expect(objective.title).toBeDefined();
            });

            it('should be equal to spec title', function () {
                expect(objective.title).toBe(spec.title);
            });
        });

        describe('image:', function () {
            it('should be defined', function () {
                expect(objective.image).toBeDefined();
            });

            it('should be equal to spec image', function () {
                expect(objective.image).toBe(spec.image);
            });
        });

        describe('score:', function () {
            it('should be defined', function () {
                expect(objective.score).toBeDefined();
            });

            it('should be equal to spec score', function () {
                expect(objective.score).toBe(spec.score);
            });
        });

        describe('questions:', function () {
            it('should be defined', function () {
                expect(objective.questions).toBeDefined();
            });

            it('should be equal to spec questions', function () {
                expect(objective.questions).toBe(spec.questions);
            });
        });

        describe('calculateScore:', function () {

            it('should be function', function () {
                expect(objective.calculateScore).toBeFunction();
            });

            it('should set score', function() {
                objective.score = 0;
                objective.questions = [{ score: 0 }, { score: 100 }];

                objective.calculateScore();
                expect(objective.score).toBe(50);
            });

            describe('when objective has no questions', function() {

                it('should set score to zero', function() {
                    objective.questions = [];
                    objective.calculateScore();
                    expect(objective.score).toBe(0);
                });

            });

        });
    });
});