import treeOfContentTraversal from './treeOfContentTraversal';
import CourseTreeNode from '../CourseTreeNode';
import SectionTreeNode from '../RelatedSectionTreeNode';
import QuestionTreeNode from '../QuestionTreeNode';
import constants from 'constants';

export default function() {

    return {
        questionCreated: questionCreated,
        questionsDeleted: questionsDeleted,
        questionTitleUpdated: questionTitleUpdated,
        questionsReordered: questionsReordered,

        courseCreated: addCourse,
        courseDeleted: deleteCourse,
        courseTitleUpdated: courseTitleUpdated,
        courseOwnershipUpdated: courseOwnershipUpdated,

        sectionRelated: sectionRelated,
        sectionsUnrelated: sectionsUnrelated,
        sectionsReordered: sectionsReordered,
        sectionTitleUpdated: sectionTitleUpdated
    };

    function addCourse(course) {
        var treeOfContent = treeOfContentTraversal.getTreeOfContent();
        if (_.isNullOrUndefined(treeOfContent))
            return;

        var courseNode = _.find(treeOfContent.courses(), c => c.id === course.id);
        if (courseNode) {
            courseNode.ownership(course.ownership);
        } else {
            treeOfContent.courses.push(new CourseTreeNode(course.id, course.title, "#courses/" + course.id, course.createdOn, course.ownership));
        }
    }

    function deleteCourse(courseId) {
        var treeOfContent = treeOfContentTraversal.getTreeOfContent();
        if (_.isNullOrUndefined(treeOfContent))
            return;

        treeOfContent.courses(_.reject(treeOfContent.courses(), course => course.id === courseId));
    }

    function courseOwnershipUpdated(courseId, ownership) {
        var treeOfContent = treeOfContentTraversal.getTreeOfContent();
        if (_.isNullOrUndefined(treeOfContent))
            return;

        var courseNode = _.find(treeOfContent.courses(), c => c.id === courseId);
        if (courseNode) {
            courseNode.ownership(ownership);
        }
    }

    function courseTitleUpdated(course) {
        _.each(treeOfContentTraversal.getCourseTreeNodeCollection(course.id), function(courseTreeNode) {
            courseTreeNode.title(course.title);
        });
    }

    function sectionRelated(courseId, section, index) {
        _.each(treeOfContentTraversal.getCourseTreeNodeCollection(courseId), function(courseTreeNode) {
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
        _.each(treeOfContentTraversal.getCourseTreeNodeCollection(courseId), function(courseTreeNode) {
            var collection = [];
            _.each(courseTreeNode.children(), function(sectionTreeNode) {
                if (!_.contains(sections, sectionTreeNode.id)) {
                    collection.push(sectionTreeNode);
                }
            });
            courseTreeNode.children(collection);
        });
    }

    function sectionsReordered(course) {
        _.each(treeOfContentTraversal.getCourseTreeNodeCollection(course.id), function(courseTreeNode) {
            if (courseTreeNode.children().length) {
                courseTreeNode.children(_.map(course.sections, function(section) {
                    return _.find(courseTreeNode.children(), function(sectionTreeNode) {
                        return sectionTreeNode.id === section.id;
                    });
                }));
            }
        });
    }

    function sectionTitleUpdated(section) {
        _.each(treeOfContentTraversal.getSectionTreeNodeCollection(section.id), function(sectionTreeNode) {
            sectionTreeNode.title(section.title);
        });
    }

    function questionCreated(sectionId, question, index) {
        _.each(treeOfContentTraversal.getSectionTreeNodeCollection(sectionId), function(sectionTreeNode) {
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
        _.each(treeOfContentTraversal.getSectionTreeNodeCollection(sectionId), function(sectionTreeNode) {
            var collection = [];
            _.each(sectionTreeNode.children(), function(questionTreeNode) {
                if (!_.contains(questions, questionTreeNode.id)) {
                    collection.push(questionTreeNode);
                }
            });
            sectionTreeNode.children(collection);
        });

    }

    function questionsReordered(section) {
        _.each(treeOfContentTraversal.getSectionTreeNodeCollection(section.id), function(sectionTreeNode) {
            if (sectionTreeNode.children().length) {
                sectionTreeNode.children(_.map(section.questions, function(item) {
                    return _.find(sectionTreeNode.children(), function(question) {
                        return question.id == item.id;
                    });
                }));
            }
        });
    }

    function questionTitleUpdated(question) {
        _.each(treeOfContentTraversal.getQuestionTreeNodeCollection(question.id), function(questionTreeNode) {
            questionTreeNode.title(question.title);
        });
    }
}