define(['viewmodels/objectives/objectiveBrief'],
    function (viewModel) {
        "use strict";

        describe('viewModel [objectiveBrief]', function () {

            it('should be a constructor function', function () {
                expect(viewModel).toBeFunction();
            });

            describe('when create an instance', function () {

                it('should return an object', function () {
                    expect(viewModel({})).toBeObject();
                });

                it('should expose id', function () {
                    var id = 1;
                    var objectiveBrief = viewModel({ id: id });
                    expect(objectiveBrief.id).toEqual(id);
                });

                it('should expose title', function () {
                    var title = 'title';
                    var objectiveBrief = viewModel({ title: title });
                    expect(objectiveBrief.title).toEqual(title);
                });

                it('should expose image', function () {
                    var image = 'cat.png';
                    var objectiveBrief = viewModel({ image: image });
                    expect(objectiveBrief.image).toEqual(image);
                });

                describe('when spec has questionsCount', function () {

                    it('should expose questionsCount', function () {
                        var questionsCount = 1;
                        var objectiveBrief = viewModel({ questionsCount: questionsCount });
                        expect(objectiveBrief.questionsCount).toEqual(questionsCount);
                    });

                });

                describe('when spec has questions array', function () {

                    it('should expose questionsCount', function () {
                        var objectiveBrief = viewModel({ questions: [{}, {}, {}] });
                        expect(objectiveBrief.questionsCount).toEqual(3);
                    });

                });

                it('should expose isSelected observable', function () {
                    var objectiveBrief = viewModel({});
                    expect(ko.isObservable(objectiveBrief.isSelected)).toBeTruthy();
                });
            });

        });

    });