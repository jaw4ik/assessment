define(function (require) {
    "use strict";

    var
        ctor = require('viewmodels/questions/multipleChoice/multipleChoiceAnswers'),
        eventTracker = require('eventTracker'),
        notify = require('notify')
    ;

    describe('viewModel [multipleChoiceAnswers]', function () {

        var viewModel;
        var questionId = 'questionId';

        beforeEach(function () {
            spyOn(notify, 'saved');
            spyOn(eventTracker, 'publish');
        });

        describe('toggleCorrectness:', function () {

            var answer;
            beforeEach(function () {
                viewModel = ctor(questionId, []);
                answer = { id: ko.observable('answerId'), isCorrect: ko.observable(false) };
            });

            it('should be function', function () {
                expect(viewModel.toggleCorrectness).toBeFunction();
            });

            it('should send event \'Change answer option correctness\'', function () {
                viewModel.toggleCorrectness(answer);
                expect(eventTracker.publish).toHaveBeenCalledWith('Change answer option correctness');
            });

            it('should update answer correctness in the viewModel', function () {
                viewModel.toggleCorrectness(answer);

                expect(answer.isCorrect()).toBeTruthy();
            });
        });

    });
})