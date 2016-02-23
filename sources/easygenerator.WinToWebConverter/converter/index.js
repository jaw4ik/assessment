'use strict';

var path = require('path');
var co = require('co');
var _ = require('lodash');
var config = require('../config');
var constants = require('./constants');
var unzip = require('./components/unzip');
var parseXml = require('./components/parseXml');
var EntityFactory = require('./models/EntityFactory');
var mapCourseStructure = require('./mappers/mapCourseStructure');
var mapCourse = require('./mappers/mapCourse');
var mapObjective = require('./mappers/mapObjective');
var mapQuestion = require('./mappers/mapQuestion');
var mapQuestionsPool = require('./mappers/mapQuestionsPool');
var mapImages = require('./mappers/mapImages');
var httpWrapper = require('./components/httpWrapper');

function uploadImages(imagesStorage, authToken) {
    let promises = [];
    _.forEach(imagesStorage.images, image => {
        let url = config.EG_DOMEN + config.UPLOAD_IMAGE_API;
        promises.push(httpWrapper.postFile(url, image.pathToImage, `image/${image.fileType}`, authToken)
			.then((response) => {
                let resp = JSON.parse(response);
                if (resp.success && _.isObject(resp.data)) {
                    image.updateWebUrl(resp.data.url);
                }
            }));
    });

    return Promise.all(promises);
}

function run(buffer, directoryPath, authToken) {
    return co(function* () {
        let pathToObjectsDir = path.join(directoryPath, 'Objects');
		let pathToFilesDir = path.join(directoryPath, 'Files');

        if (!unzip(buffer, directoryPath)) {
			throw 'Unsupported file type';
        }

        let modelXmlData = yield parseXml(path.join(directoryPath, constants.packageFilesName.model));
        let courseStructure = mapCourseStructure(modelXmlData);

        let imagesStorage = yield mapImages(courseStructure.files, pathToFilesDir);

        yield uploadImages(imagesStorage, authToken);

        let courseNode = _.find(courseStructure.nodes, node => node.$.typeId === constants.nodeTypes.course);
        let objectivesNodes = _.filter(courseStructure.nodes, node => node.$.typeId === constants.nodeTypes.chapter);
        let questionsNodes = _.filter(courseStructure.nodes, node => node.$.typeId === constants.nodeTypes.page);
        let questionsPoolNodes = _.filter(courseStructure.nodes, node => node.$.typeId === constants.nodeTypes.questionsPool);

        if (_.isUndefined(courseNode)) {
            throw 'Course is no defined';
        }

        let courseData = yield parseXml(path.join(pathToObjectsDir, courseNode.$.id, constants.packageFilesName.nodeDetails));
		let courseWebControlData = yield parseXml(path.join(pathToObjectsDir, courseNode.$.id, constants.packageFilesName.webControlInfoCollection), 'utf8');

        let course = mapCourse(courseData, courseWebControlData, imagesStorage);

        let untitledObjective = EntityFactory.Objective('', 'Untitled objective', objectivesNodes.length);
        let questionsPools = [];

        for(let node of objectivesNodes){
            let chapterData = yield parseXml(path.join(pathToObjectsDir, node.$.id, constants.packageFilesName.nodeDetails));
            course.objectives.push(mapObjective(chapterData));
        }

		for (let node of questionsPoolNodes) {
			let questionsPoolData = yield parseXml(path.join(pathToObjectsDir, node.$.id, constants.packageFilesName.nodeDetails));
			questionsPools.push(mapQuestionsPool(questionsPoolData));
		}
        
        for(let node of questionsNodes){
            let slideData = yield parseXml(path.join(pathToObjectsDir, node.$.id, constants.packageFilesName.nodeDetails));
            let webControlInfoCollectionData = yield parseXml(path.join(pathToObjectsDir, node.$.id, constants.packageFilesName.webControlInfoCollection), 'utf8');
            let question = mapQuestion(slideData, webControlInfoCollectionData, imagesStorage);

            if (!question) {
                continue;
            }

            let objective;
            let questionPool = _.find(questionsPools, questionPool => questionPool.id === question.objectiveId);
            if (questionPool) {
                objective = _.find(course.objectives, objective => objective.id === questionPool.parentId);
            }

            if (_.isUndefined(objective)) {
                objective = _.find(course.objectives, objective => objective.id === question.objectiveId);
            }

            if (_.isUndefined(objective)) {
                untitledObjective.questions.push(question);
            } else {
                objective.questions.push(question);
            }
        }

        if (untitledObjective.questions.length > 0) {
			course.objectives.unshift(untitledObjective);
        }

        let response = httpWrapper.postJson(config.EG_DOMEN + config.IMPORT_COURSE_API, course, authToken);

        return response;
    });
}

module.exports = {
    run: run
};