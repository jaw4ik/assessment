import viewModel from './sectionBrief';

describe('viewModel [sectionBrief]', function () {

    it('should be a constructor function', function () {
        expect(viewModel).toBeFunction();
    });

    describe('when create an instance', function () {

        it('should return an object', function () {
            expect(viewModel({})).toBeObject();
        });

        it('should expose id', function () {
            var id = 1;
            var sectionBrief = viewModel({ id: id });
            expect(sectionBrief.id).toEqual(id);
        });

        it('should expose title', function () {
            var title = 'title';
            var sectionBrief = viewModel({ title: title });
            expect(sectionBrief.title()).toEqual(title);
        });

        it('should expose imageUrl', function () {
            var imageUrl = 'cat.png';
            var sectionBrief = viewModel({ image: imageUrl });
            expect(sectionBrief.imageUrl).toBeObservable();
            expect(sectionBrief.imageUrl()).toEqual(imageUrl);
        });

        it('should expose isImageLoading', function () {
            var sectionBrief = viewModel({});
            expect(sectionBrief.isImageLoading).toBeObservable();
            expect(sectionBrief.isImageLoading()).toBeFalsy();
        });

        describe('when spec has questionsCount', function () {

            it('should expose questionsCount', function () {
                var questionsCount = 1;
                var sectionBrief = viewModel({ questionsCount: questionsCount });
                expect(sectionBrief.questionsCount).toEqual(questionsCount);
            });

        });

        describe('when spec has questions array', function () {

            it('should expose questionsCount', function () {
                var sectionBrief = viewModel({ questions: [{}, {}, {}] });
                expect(sectionBrief.questionsCount).toEqual(3);
            });

        });

        it('should expose isSelected observable', function () {
            var sectionBrief = viewModel({});
            expect(ko.isObservable(sectionBrief.isSelected)).toBeTruthy();
        });

        it('should expose title observable', function () {
            var sectionBrief = viewModel({});
            expect(ko.isObservable(sectionBrief.title)).toBeTruthy();
        });

        it('should expose modifiedOn observable', function () {
            var sectionBrief = viewModel({});
            expect(ko.isObservable(sectionBrief.modifiedOn)).toBeTruthy();
        });

        it('should expose createdBy', function () {
            var sectionBrief = viewModel({ createdBy: 'author@mail.com' });
            expect(sectionBrief.createdBy).toBeDefined();
        });
    });

});
