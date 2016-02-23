import command from './updateMasteryScore';

import apiHttpWrapper from 'http/apiHttpWrapper';

describe('command [updateMasteryScore]', function () {

    describe('execute:', function () {

        var dfd = Q.defer();

        beforeEach(function () {
            spyOn(apiHttpWrapper, 'post').and.returnValue(dfd.promise);
        });

        it('should be function', function () {
            expect(command.execute).toBeFunction();
        });

        it('should return promise', function () {
            expect(command.execute()).toBePromise();
        });

        it('should send request to the server to update scenario mastery score', function (done) {
            dfd.resolve();

            var questionId = 'questionId',
                masteryScore = 50;

            command.execute(questionId, masteryScore).then(function () {
                expect(apiHttpWrapper.post).toHaveBeenCalledWith('api/question/scenario/updatemasteryscore', {
                    questionId: questionId,
                    masteryScore: masteryScore
                });
                done();
            });
        });

    });
});
