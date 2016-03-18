import handler from './sectionsReplaced';

import dataContext from 'dataContext';
import app from 'durandal/app';
import constants from 'constants';
import sectionModelMapper from 'mappers/sectionModelMapper';

describe('synchronization course [sectionsReplaced]', function () {

    var courseId = 'courseId';
    var clonedSections;
    var modifiedOn = new Date();
    var course = {
        id: courseId,
        modifiedOn: ''
    };


    beforeEach(function () {
        spyOn(app, 'trigger');
        clonedSections = {
            'sectionId1': {},
            'sectionId2': {},
            'sectionId3': {}
        };
        courseId = 'courseId';
    });

    it('should be function', function () {
        expect(handler).toBeFunction();
    });

    describe('when course id is undefined', function () {
        it('should throw an exception', function () {
            var f = function () {
                handler(undefined, clonedSections, modifiedOn.toISOString());
            };

            expect(f).toThrow('CourseId is not a string');
        });
    });

    describe('when course id is null', function () {
        it('should throw an exception', function () {
            var f = function () {
                handler(null, clonedSections, modifiedOn.toISOString());
            };

            expect(f).toThrow('CourseId is not a string');
        });
    });

    describe('when course id is not a string', function () {
        it('should throw an exception', function () {
            var f = function () {
                handler({}, clonedSections, modifiedOn.toISOString());
            };

            expect(f).toThrow('CourseId is not a string');
        });
    });

    describe('when replacedSectionsInfo is undefined', function () {
        it('should throw an exception', function () {
            var f = function () {
                handler(courseId, undefined, modifiedOn.toISOString());
            };

            expect(f).toThrow('ReplacedSectionsInfo is not an object');
        });
    });

    describe('when replacedSectionsInfo is null', function () {
        it('should throw an exception', function () {
            var f = function () {
                handler(courseId, null, modifiedOn.toISOString());
            };

            expect(f).toThrow('ReplacedSectionsInfo is not an object');
        });
    });

    describe('when replacedSectionsInfo is not an object', function () {
        it('should throw an exception', function () {
            var f = function () {
                handler(courseId, '', modifiedOn.toISOString());
            };

            expect(f).toThrow('ReplacedSectionsInfo is not an object');
        });
    });

    describe('when modifiedOn is undefined', function () {
        it('should throw an exception', function () {
            var f = function () {
                handler(courseId, clonedSections, undefined);
            };

            expect(f).toThrow('ModifiedOn is not a string');
        });
    });

    describe('when modifiedOn is null', function () {
        it('should throw an exception', function () {
            var f = function () {
                handler(courseId, clonedSections, null);
            };

            expect(f).toThrow('ModifiedOn is not a string');
        });
    });

    describe('when modifiedOn is not a string', function () {
        it('should throw an exception', function () {
            var f = function () {
                handler(courseId, clonedSections, {});
            };

            expect(f).toThrow('ModifiedOn is not a string');
        });
    });

    describe('when course with specified id does not found', function() {
        beforeEach(function() {
            dataContext.courses = [];
        });

        it('should throw an exception', function () {
            var f = function () {
                handler(courseId, clonedSections, modifiedOn.toISOString());
            };

            expect(f).toThrow('Course has not been found');
        });
    });

    describe('when course with specified id exists', function() {
        beforeEach(function () {
                
            dataContext.courses = [course];
            course.sections = [
                {
                    id: 'sectionId10'
                },
                {
                    id: 'sectionId1'
                }
            ];
        });

        it('should update course modified on date', function () {
            handler(courseId, clonedSections, modifiedOn.toISOString());
            expect(dataContext.courses[0].modifiedOn.toISOString()).toBe(modifiedOn.toISOString());
        });

        it('should trigger app event about new cloned sections', function () {
            spyOn(sectionModelMapper, "map").and.returnValue('mapedSection');
            handler(courseId, clonedSections, modifiedOn.toISOString());

            expect(app.trigger).toHaveBeenCalledWith(constants.messages.course.sectionRelatedByCollaborator, courseId, 'mapedSection', 1);
        });

        it('should trigger app event about old sections that were removed', function () {
            spyOn(sectionModelMapper, "map").and.returnValue('mapedSection');
            handler(courseId, clonedSections, modifiedOn.toISOString());

            expect(app.trigger).toHaveBeenCalledWith(constants.messages.course.sectionRelatedByCollaborator, courseId, 'mapedSection', 1);

            app.trigger(constants.messages.course.sectionsUnrelatedByCollaborator, courseId, ['sectionId1', 'sectionId2', 'sectionId3']);
        });
    });
});
