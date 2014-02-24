define(['treeOfContent/handlers/treeOfContentTraversal', 'treeOfContent/CourseTreeNode', 'treeOfContent/RelatedObjectiveTreeNode', 'treeOfContent/QuestionTreeNode'], function (treeOfContentTraversal, CourseTreeNode, ObjectiveTreeNode, QuestionTreeNode) {

    var eventHandler = function () {

        return {
            questionCreated: questionCreated,
            questionsDeleted: questionsDeleted,
            questionTitleUpdated: questionTitleUpdated,
            questionsReordered: questionsReordered,

            courseCreated: courseCreated,
            courseDeleted: courseDeleted,
            courseTitleUpdated: courseTitleUpdated,

            objectivesRelated: objectivesRelated,
            objectivesUnrelated: objectivesUnrelated,
            objectivesReordered: objectivesReordered,
            objectiveTitleUpdated: objectiveTitleUpdated
        };

        function courseCreated(course) {
            treeOfContentTraversal.getTreeOfContent().children.unshift(new CourseTreeNode(course.id, course.title, "#course/" + course.id));
        }

        function courseDeleted(courseId) {
            var courses = treeOfContentTraversal.getTreeOfContent().children;
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

        function objectivesRelated(courseId, objectives) {
            _.each(treeOfContentTraversal.getCourseTreeNodeCollection(courseId), function (courseTreeNode) {
                if (courseTreeNode.isExpanded()) {
                    _.each(objectives, function (objective) {
                        courseTreeNode.children.push(new ObjectiveTreeNode(objective.id, courseId, objective.title, "#objective/" + objective.id + "?courseId=" + courseId));
                    });
                }
            });
        }

        function objectivesUnrelated(courseId, objectives) {
            _.each(treeOfContentTraversal.getCourseTreeNodeCollection(courseId), function (courseTreeNode) {
                _.each(courseTreeNode.children(), function (objectiveTreeNode) {
                    if (_.contains(objectives, objectiveTreeNode.id)) {
                        courseTreeNode.children.remove(objectiveTreeNode);
                    }
                });
            });
        }

        function objectivesReordered(course) {
            _.each(treeOfContentTraversal.getCourseTreeNodeCollection(course.id), function (courseTreeNode) {
                courseTreeNode.children(_.map(course.objectives, function (objective) {
                    return _.find(courseTreeNode.children(), function (objectiveTreeNode) {
                        return objectiveTreeNode.id == objective.id;
                    });
                }));
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
                    objectiveTreeNode.children.push(new QuestionTreeNode(question.id, question.title, "#objective/" + objectiveTreeNode.id + "/question/" + question.id + '?courseId=' + objectiveTreeNode.courseId));
                }
            });
        }

        function questionsDeleted(objectiveId, questions) {
            _.each(treeOfContentTraversal.getObjectiveTreeNodeCollection(objectiveId), function (objectiveTreeNode) {
                _.each(objectiveTreeNode.children(), function (questionTreeNode) {
                    if (_.contains(questions, questionTreeNode.id)) {
                        objectiveTreeNode.children.remove(questionTreeNode);
                    }
                });
            });

        }

        function questionsReordered(objective) {
            _.each(treeOfContentTraversal.getObjectiveTreeNodeCollection(objective.id), function (objectiveTreeNode) {
                objectiveTreeNode.children(_.map(objective.questions, function (item) {
                    return _.find(objectiveTreeNode.children(), function (question) {
                        return question.id == item.id;
                    });
                }));
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