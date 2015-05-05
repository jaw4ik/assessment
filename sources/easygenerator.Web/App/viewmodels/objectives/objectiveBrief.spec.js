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
                    expect(objectiveBrief.title()).toEqual(title);
                });

                it('should expose imageUrl', function () {
                    var imageUrl = 'cat.png';
                    var objectiveBrief = viewModel({ image: imageUrl });
                    expect(objectiveBrief.imageUrl).toBeObservable();
                    expect(objectiveBrief.imageUrl()).toEqual(imageUrl);
                });

                it('should expose isImageLoading', function () {
                    var objectiveBrief = viewModel({});
                    expect(objectiveBrief.isImageLoading).toBeObservable();
                    expect(objectiveBrief.isImageLoading()).toBeFalsy();
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

                it('should expose title observable', function () {
                    var objectiveBrief = viewModel({});
                    expect(ko.isObservable(objectiveBrief.title)).toBeTruthy();
                });

                it('should expose modifiedOn observable', function () {
                    var objectiveBrief = viewModel({});
                    expect(ko.isObservable(objectiveBrief.modifiedOn)).toBeTruthy();
                });

                it('should expose createdBy', function () {
                    var objectiveBrief = viewModel({ createdBy: 'author@mail.com' });
                    expect(objectiveBrief.createdBy).toBeDefined();
                });
            });

        });

    });