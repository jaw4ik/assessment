import query from 'review/comments/context/queries/getSection';

import dataContext from 'dataContext';

describe('review context queries [getSection]', () => {
    let course = {
            id: 'id'
        },
        section = {
            id: 'objId'
        };
    
    describe('when course is not found', () => {
        beforeEach(() => {
            dataContext.courses = [];
        });

        it('should throw exception', function () {
            var f = function () {
                query.execute(course.id, section.id);
            };

            expect(f).toThrow('Course id is not valid');
        });

    });

    describe('when course is found', () => {
        beforeEach(() => {
            dataContext.courses = [course];
        });

        describe('and when section is found', () => {
            beforeEach(() => {
                course.sections = [section];
            });

            it('should return section', () => {
                expect(query.execute(course.id, section.id)).toBe(section);
            });
        });

        describe('and when section is not found', () => {
            beforeEach(() => {
                course.sections = [];
            });

            it('should return null', () => {
                expect(query.execute(course.id, section.id)).toBeNull();
            });
        });
    });
});