import query from 'review/comments/context/queries/getQuestionData';

import dataContext from 'dataContext';

describe('review context queries [getQuestionData]', () => {
    let course = { id: 'id' },
        section = { id: 'objId' },
        question = { id: 'questionId' };
    
    describe('when course is not found', () => {
        beforeEach(() => {
            dataContext.courses = [];
        });

        it('should throw exception', function () {
            var f = function () {
                query.execute(course.id, question.id);
            };

            expect(f).toThrow('Course id is not valid');
        });

    });

    describe('when course is found', () => {
        beforeEach(() => {
            dataContext.courses = [course];
        });

        describe('and when question is found', () => {
            beforeEach(() => {
                course.sections = [section];
                section.questions = [question];
            });

            it('should return question data', () => {
                expect(query.execute(course.id, question.id)).toEqual(
                    { 
                        sectionId: section.id,
                        question: question
                    });
            });
        });

        describe('and when question is not found', () => {
            beforeEach(() => {
                course.sections = [];
            });

            it('should return null', () => {
                expect(query.execute(course.id, question.id)).toBeNull();
            });
        });
    });
});