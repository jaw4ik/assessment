define(['guard', 'durandal/app', 'constants', 'dataContext', 'mappers/sectionModelMapper'],
    function (guard, app, constants, dataContext, sectionModelMapper) {
        "use strict";

        return function sectionsReplaced(courseId, replacedSectionsInfo, modifiedOn) {
            guard.throwIfNotString(courseId, 'CourseId is not a string');
            guard.throwIfNotAnObject(replacedSectionsInfo, 'ReplacedSectionsInfo is not an object');
            guard.throwIfNotString(modifiedOn, 'ModifiedOn is not a string');

            var course = _.find(dataContext.courses, function (item) {
                return item.id == courseId;
            });

            guard.throwIfNotAnObject(course, 'Course has not been found');
            
            var replacedSections = [];
            var clonedSection;
            var i;
            if (course.sections) {
                for (i = 0; i < course.sections.length; i++) {
                    var sectionId = course.sections[i].id;
                    if (replacedSectionsInfo[sectionId]) {
                        clonedSection = sectionModelMapper.map(replacedSectionsInfo[sectionId]);
                        course.sections[i] = clonedSection;
                        replacedSections.push({ oldId: sectionId, newSection: clonedSection });
                        app.trigger(constants.messages.course.sectionRelatedByCollaborator, courseId, clonedSection, i);
                    }
                }

                for (i = 0; i < dataContext.sections.length; i++) {
                    clonedSection = _.find(replacedSections, function (replacedSection) {
                        return replacedSection.oldId == dataContext.sections[i].id;
                    });
                    if (clonedSection) {
                        dataContext.sections[i] = clonedSection.newSection;
                    }
                }
            }
            
            course.modifiedOn = new Date(modifiedOn);
            app.trigger(constants.messages.course.sectionsUnrelatedByCollaborator, courseId, _.map(replacedSections, function (relatedSection) { return relatedSection.oldId; }));
        }
    });