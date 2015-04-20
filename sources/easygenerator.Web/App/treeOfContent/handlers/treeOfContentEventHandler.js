define(['./treeOfContentTraversal', '../CourseTreeNode', '../RelatedObjectiveTreeNode', '../QuestionTreeNode'], function (treeOfContentTraversal, CourseTreeNode, ObjectiveTreeNode, QuestionTreeNode) {

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

            objectiveRelated: objectiveRelated,
            objectivesUnrelated: objectivesUnrelated,
            objectivesReordered: objectivesReordered,
            objectiveTitleUpdated: objectiveTitleUpdated,
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

        function objectiveRelated(courseId, objective, index) {
            _.each(treeOfContentTraversal.getCourseTreeNodeCollection(courseId), function (courseTreeNode) {
                if (courseTreeNode.isExpanded()) {
                    if (!_.isNullOrUndefined(index)) {
                        courseTreeNode.children.splice(index, 0, new ObjectiveTreeNode(objective.id, courseId, objective.title, "#courses/" + courseId + "/objectives/" + objective.id));
                    } else {
                        courseTreeNode.children.push(new ObjectiveTreeNode(objective.id, courseId, objective.title, "#courses/" + courseId + "/objectives/" + objective.id));
                    }
                }
            });
        }

        function objectivesUnrelated(courseId, objectives) {
            _.each(treeOfContentTraversal.getCourseTreeNodeCollection(courseId), function (courseTreeNode) {
                var collection = [];
                _.each(courseTreeNode.children(), function (objectiveTreeNode) {
                    if (!_.contains(objectives, objectiveTreeNode.id)) {
                        collection.push(objectiveTreeNode);
                    }
                });
                courseTreeNode.children(collection);
            });
        }

        function objectivesReordered(course) {
            _.each(treeOfContentTraversal.getCourseTreeNodeCollection(course.id), function (courseTreeNode) {
                if (courseTreeNode.children().length) {
                    courseTreeNode.children(_.map(course.objectives, function (objective) {
                        return _.find(courseTreeNode.children(), function (objectiveTreeNode) {
                            return objectiveTreeNode.id == objective.id;
                        });
                    }));
                }
            });
        }

        function objectiveTitleUpdated(objective) {
            _.each(treeOfContentTraversal.getObjectiveTreeNodeCollection(objective.id), function (objectiveTreeNode) {
                objectiveTreeNode.title(objective.title);
            });
        }

        function questionCreated(objectiveId, question) {
            _.each(treeOfContentTraversal.getObjectiveTreeNodeCollection(objectiveId), function (objectiveTreeNode) {
                if (objectiveTreeNode.isExpanded()) {
                    objectiveTreeNode.children.push(new QuestionTreeNode(question.id, question.title, "#courses/" + objectiveTreeNode.courseId + "/objectives/" + objectiveTreeNode.id + "/questions/" + question.id));
                }
            });
        }

        function questionsDeleted(objectiveId, questions) {
            _.each(treeOfContentTraversal.getObjectiveTreeNodeCollection(objectiveId), function (objectiveTreeNode) {
                var collection = [];
                _.each(objectiveTreeNode.children(), function (questionTreeNode) {
                    if (!_.contains(questions, questionTreeNode.id)) {
                        collection.push(questionTreeNode);
                    }
                });
                objectiveTreeNode.children(collection);
            });

        }

        function questionsReordered(objective) {
            _.each(treeOfContentTraversal.getObjectiveTreeNodeCollection(objective.id), function (objectiveTreeNode) {
                if (objectiveTreeNode.children().length) {
                    objectiveTreeNode.children(_.map(objective.questions, function (item) {
                        return _.find(objectiveTreeNode.children(), function (question) {
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