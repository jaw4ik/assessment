define(['./treeOfContentTraversal', '../CourseTreeNode', '../RelatedSectionTreeNode', '../QuestionTreeNode'], function (treeOfContentTraversal, CourseTreeNode, SectionTreeNode, QuestionTreeNode) {

    var eventHandler = function () {

        return {
            questionCreated: questionCreated,
            questionsDeleted: questionsDeleted,
            questionTitleUpdated: questionTitleUpdated,
            questionsReordered: questionsReordered,

            courseCreated: courseCreated,
            courseDeleted: courseDeleted,
            courseTitleUpdated: courseTitleUpdated,

            collaborationStarted: collaborationStarted,
            collaborationFinished: collaborationFinished,

            sectionRelated: sectionRelated,
            sectionsUnrelated: sectionsUnrelated,
            sectionsReordered: sectionsReordered,
            sectionTitleUpdated: sectionTitleUpdated,
            courseDeletedByCollaborator: courseDeletedByCollaborator
        };

        function courseCreated(course) {
            var treeOfContent = treeOfContentTraversal.getTreeOfContent();
            if (_.isNullOrUndefined(treeOfContent))
                return;

            treeOfContent.children.unshift(new CourseTreeNode(course.id, course.title, "#courses/" + course.id, course.createdOn));
        }

        function collaborationStarted(course) {
            var treeOfContent = treeOfContentTraversal.getTreeOfContent();
            if (_.isNullOrUndefined(treeOfContent))
                return;

            var sharedCourses = treeOfContent.sharedChildren();
            sharedCourses.push(new CourseTreeNode(course.id, course.title, "#courses/" + course.id, course.createdOn));
            sharedCourses = _.sortBy(sharedCourses, function (item) {
                return -item.createdOn;
            });
            treeOfContent.sharedChildren(sharedCourses);
        }

        function collaborationFinished(courseId) {
            var treeOfContent = treeOfContentTraversal.getTreeOfContent();
            if (_.isNullOrUndefined(treeOfContent))
                return;

            deleteCourse(treeOfContent.sharedChildren, courseId);
        }

        function courseDeleted(courseId) {
            var treeOfContent = treeOfContentTraversal.getTreeOfContent();
            if (_.isNullOrUndefined(treeOfContent))
                return;

            deleteCourse(treeOfContent.children, courseId);
        }

        function courseDeletedByCollaborator(courseId) {
            var treeOfContent = treeOfContentTraversal.getTreeOfContent();
            if (_.isNullOrUndefined(treeOfContent))
                return;

            deleteCourse(treeOfContent.sharedChildren, courseId);
        }

        function deleteCourse(courses, courseId) {
            _.each(courses(), function (course) {
                if (course.id == courseId) {
                    courses.remove(course);
                }
            });
        }

        function courseTitleUpdated(course) {
            _.each(treeOfContentTraversal.getCourseTreeNodeCollection(course.id), function (courseTreeNode) {
                courseTreeNode.title(course.title);
            });
        }

        function sectionRelated(courseId, section, index) {
            _.each(treeOfContentTraversal.getCourseTreeNodeCollection(courseId), function (courseTreeNode) {
                if (courseTreeNode.isExpanded()) {
                    if (!_.isNullOrUndefined(index)) {
                        courseTreeNode.children.splice(index, 0, new SectionTreeNode(section.id, courseId, section.title, "#courses/" + courseId + "/sections/" + section.id));
                    } else {
                        courseTreeNode.children.push(new SectionTreeNode(section.id, courseId, section.title, "#courses/" + courseId + "/sections/" + section.id));
                    }
                }
            });
        }

        function sectionsUnrelated(courseId, sections) {
            _.each(treeOfContentTraversal.getCourseTreeNodeCollection(courseId), function (courseTreeNode) {
                var collection = [];
                _.each(courseTreeNode.children(), function (sectionTreeNode) {
                    if (!_.contains(sections, sectionTreeNode.id)) {
                        collection.push(sectionTreeNode);
                    }
                });
                courseTreeNode.children(collection);
            });
        }

        function sectionsReordered(course) {
            _.each(treeOfContentTraversal.getCourseTreeNodeCollection(course.id), function (courseTreeNode) {
                if (courseTreeNode.children().length) {
                    courseTreeNode.children(_.map(course.sections, function (section) {
                        return _.find(courseTreeNode.children(), function (sectionTreeNode) {
                            return sectionTreeNode.id == section.id;
                        });
                    }));
                }
            });
        }

        function sectionTitleUpdated(section) {
            _.each(treeOfContentTraversal.getSectionTreeNodeCollection(section.id), function (sectionTreeNode) {
                sectionTreeNode.title(section.title);
            });
        }

        function questionCreated(sectionId, question, index) {
            _.each(treeOfContentTraversal.getSectionTreeNodeCollection(sectionId), function (sectionTreeNode) {
                if (sectionTreeNode.isExpanded()) {
                    var questionNode = new QuestionTreeNode(question.id, question.title, "#courses/" + sectionTreeNode.courseId + "/sections/" + sectionTreeNode.id + "/questions/" + question.id);
                    if (index) {
                        sectionTreeNode.children.splice(index, 0, questionNode);
                    } else {
                        sectionTreeNode.children.push(questionNode);
                    }
                }
            });
        }

        function questionsDeleted(sectionId, questions) {
            _.each(treeOfContentTraversal.getSectionTreeNodeCollection(sectionId), function (sectionTreeNode) {
                var collection = [];
                _.each(sectionTreeNode.children(), function (questionTreeNode) {
                    if (!_.contains(questions, questionTreeNode.id)) {
                        collection.push(questionTreeNode);
                    }
                });
                sectionTreeNode.children(collection);
            });

        }

        function questionsReordered(section) {
            _.each(treeOfContentTraversal.getSectionTreeNodeCollection(section.id), function (sectionTreeNode) {
                if (sectionTreeNode.children().length) {
                    sectionTreeNode.children(_.map(section.questions, function (item) {
                        return _.find(sectionTreeNode.children(), function (question) {
                            return question.id == item.id;
                        });
                    }));
                }
            });
        }

        function questionTitleUpdated(question) {
            _.each(treeOfContentTraversal.getQuestionTreeNodeCollection(question.id), function (questionTreeNode) {
                questionTreeNode.title(question.title);
            });
        }
    };

    return eventHandler;

})