import query from 'review/comments/context/queries/getObjective';

import dataContext from 'dataContext';

describe('review context queries [getObjective]', () => {
    let course = {
            id: 'id'
        },
        objective = {
            id: 'objId'
        };
    
    describe('when course is not found', () => {
        beforeEach(() => {
            dataContext.courses = [];
        });

        it('should throw exception', function () {
            var f = function () {
                query.execute(course.id, objective.id);
            };

            expect(f).toThrow('Course id is not valid');
        });

    });

    describe('when course is found', () => {
        beforeEach(() => {
            dataContext.courses = [course];
        });

        describe('and when objective is found', () => {
            beforeEach(() => {
                course.objectives = [objective];
            });

            it('should return objective', () => {
                expect(query.execute(course.id, objective.id)).toBe(objective);
            });
        });

        describe('and when objective is not found', () => {
            beforeEach(() => {
                course.objectives = [];
            });

            it('should return null', () => {
                expect(query.execute(course.id, objective.id)).toBeNull();
            });
        });
    });
});