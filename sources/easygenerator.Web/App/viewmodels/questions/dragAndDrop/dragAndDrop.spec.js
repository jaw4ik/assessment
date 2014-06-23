define(['viewmodels/questions/dragAndDrop/dragAndDrop'], function (viewModel) {

    var
        notify = require('notify'),
        eventTracker = require('eventTracker'),
        designer = require('viewmodels/questions/dragAndDrop/designer');

    describe('dragAndDrop:', function () {

        describe('backgroundChanged:', function () {
            var question = { id: '1', background: 'some image' };

            it('should be function', function() {
                expect(viewModel.backgroundChanged).toBeFunction();
            });

            describe('when current question background is changed', function() {
                beforeEach(function () {
                    viewModel.questionId = question.id;
                });

                it('should update background', function() {
                    designer.background('');
                    viewModel.backgroundChanged(question);
                    expect(designer.background()).toBe(question.background);
                });
            });

            describe('when it is not current question background changed', function() {
                beforeEach(function () {
                    viewModel.questionId = 'otherId';
                });

                it('should not update background', function () {
                    designer.background('');
                    viewModel.backgroundChanged(question);
                    expect(designer.background()).toBe('');
                });
            });
        });

        describe('dropspotCreated:', function () {
            var questionId = 'questionId',
                dropspotId = 'dropspotId';

            it('should be function', function () {
                expect(viewModel.dropspotCreated).toBeFunction();
            });

            describe('when dropspot is created in current question', function () {
                beforeEach(function () {
                    viewModel.questionId = questionId;
                });

                it('should add new dropspot', function () {
                    designer.dropspots([]);
                    viewModel.dropspotCreated(questionId, dropspotId, 'some text');
                    expect(designer.dropspots().length).toBe(1);
                    expect(designer.dropspots()[0].id).toBe(dropspotId);
                });
            });

            describe('when dropspot is created not in current question', function () {
                beforeEach(function () {
                    viewModel.questionId = 'otherId';
                });

                it('should not add new dropspot', function () {
                    designer.dropspots([]);
                    viewModel.dropspotCreated(questionId, dropspotId, 'some text');
                    expect(designer.dropspots().length).toBe(0);
                });
            });
        });
    });

})