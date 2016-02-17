'use strict';

var Image = require('./Image');
var CourseStructure = require('./CourseStructure');
var Course = require('./Course');
var Objective = require('./Objective');
var LearningContent = require('./LearningContent');
var Answer = require('./answers/Answer');
var BlankAnswer = require('./answers/BlankAnswer');
var SingleChoiceImageAnswer = require('./answers/SingleChoiceImageAnswer');
var TextMatchingAnswer = require('./answers/TextMatchingAnswer');
var HotspotPolygons = require('./answers/HotspotPolygons');
var SingleChoice = require('./questions/SingleChoice');
var FillInTheBlaks = require('./questions/FillInTheBlaks');
var Hotspot = require('./questions/Hotspot');
var InformationContent = require('./questions/InformationContent');
var MultipleChoice = require('./questions/MultipleChoice');
var OpenQuestion = require('./questions/OpenQuestion');
var SingleChoiceImage = require('./questions/SingleChoiceImage');
var Statement = require('./questions/Statement');
var TextMatching = require('./questions/TextMatching');
var Point = require('./Point');
var QuestionsPool = require('./QuestionsPool');

class EntityFactory {
	static QuestionsPool(id, parentId) {
	    return new QuestionsPool(id, parentId);
	}
	static Image(id, pathToImage, fileType) {
		return new Image(id, pathToImage, fileType);
	}
	static Point(x, y) {
	    return new Point(x, y);
	}
    static CourseStructure(nodes, files) {
        return new CourseStructure(nodes, files);
    }
	static Course(id, title, introduction) {
        return new Course(id, title, introduction);
    }
	static Objective(id, title, order) {
        return new Objective(id, title, order);
    }
	static Answer(text, isCorrect) {
        return new Answer(text, isCorrect);
    }
	static BlankAnswer(text, isCorrect, groupId, matchCase) {
        return new BlankAnswer(text, isCorrect, groupId, matchCase);
    }
	static SingleChoiceImageAnswer(image, isCorrect) {
        return new SingleChoiceImageAnswer(image, isCorrect);
    }
	static TextMatchingAnswer(key, value) {
        return new TextMatchingAnswer(key, value);
    }
	static HotspotPolygons(points) {
        return new HotspotPolygons(points);
    }
	static LearningContent(text) {
        return new LearningContent(text);
    }
	static SingleChoice(id, title, objectiveId, order) {
        return new SingleChoice(id, title, objectiveId, order);
    }
	static FillInTheBlaks(id, title, objectiveId, order) {
        return new FillInTheBlaks(id, title, objectiveId, order);
    }
	static Hotspot(id, title, objectiveId, order) {
        return new Hotspot(id, title, objectiveId, order);
    }
	static InformationContent(id, title, objectiveId, order) {
        return new InformationContent(id, title, objectiveId, order);
    }
	static MultipleChoice(id, title, objectiveId, order) {
        return new MultipleChoice(id, title, objectiveId, order);
    }
	static OpenQuestion(id, title, objectiveId, order) {
        return new OpenQuestion(id, title, objectiveId, order);
    }
	static SingleChoiceImage(id, title, objectiveId, order) {
        return new SingleChoiceImage(id, title, objectiveId, order);
    }
	static Statement(id, title, objectiveId, order) {
        return new Statement(id, title, objectiveId, order);
    }
	static TextMatching(id, title, objectiveId, order) {
        return new TextMatching(id, title, objectiveId, order);
    }
}

module.exports = EntityFactory;