define(['models/objective', 'modules/courseSettings'], function (ObjectiveModel, courseSettings) {

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
            it('should be computed', function () {
                expect(objective.score).toBeComputed();
            });

            beforeEach(function () {
                objective.questions.removeAll();
            });

            describe('when objective has questions', function () {

                beforeEach(function () {
                    objective.questions.removeAll();
                });

                it('should have value', function () {
                    objective.questions.push({ score: ko.observable(0) });
                    objective.questions.push({ score: ko.observable(100) });

                    expect(objective.score()).toBe(50);
                });
            });

            describe('when objective has no questions', function () {

                beforeEach(function () {
                    objective.questions.removeAll();
                });

                it('should be 0', function () {
                    expect(objective.score()).toBe(0);
                });
            });
        });

        describe('isCompleted:', function () {
            it('should be computed', function () {
                expect(objective.isCompleted).toBeComputed();
            });

            beforeEach(function () {
                courseSettings.masteryScore.score = 80;
            });

            describe('when score is less than course settings mastery score', function () {
                beforeEach(function () {
                    objective.questions.removeAll();
                    objective.questions.push({ score: ko.observable(20) });
                });

                it('should be false', function () {
                    expect(objective.isCompleted()).toBeFalsy();
                });
            });

            describe('when score equals course settings mastery score', function () {
                beforeEach(function () {
                    objective.questions.removeAll();
                    objective.questions.push({ score: ko.observable(80) });
                });

                it('should be true', function () {
                    expect(objective.isCompleted()).toBeTruthy();
                });
            });

            describe('when score is more than course settings mastery score', function () {
                beforeEach(function () {
                    objective.questions.removeAll();
                    objective.questions.push({ score: ko.observable(100) });
                });

                it('should be true', function () {
                    expect(objective.isCompleted()).toBeTruthy();
                });
            });
        });

        describe('questions:', function () {
            it('should be defined', function () {
                expect(objective.questions).toBeDefined();
            });

            it('should be equal to spec questions', function () {
                expect(objective.questions()).toBe(spec.questions);
            });
        });

    });
});