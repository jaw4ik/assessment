'use strict';

var _ = require('lodash');
var constants = require('../constants');
var CommonQuestionData = require('./questions/common/CommonQuestionData');
var mapFillInTheBlanks = require('./questions/mapFillInTheBlanks');
var mapHotspot = require('./questions/mapHotspot');
var mapContent = require('./questions/mapContent');
var mapOpenQuestion = require('./questions/mapOpenQuestion');
var mapSingleAndMultipleChoice = require('./questions/mapSingleAndMultipleChoice');
var mapSingleChoiceImage = require('./questions/mapSingleChoiceImage');
var mapStatement = require('./questions/mapStatement');
var mapTextMatching = require('./questions/mapTextMatching');
var mapInformationContent = require('./questions/mapInformationContent');

module.exports = (slideData, webControlInfoCollectionData, imagesStorage) => {
    let slideDetails = slideData.SlideDetails;

    let slideType = CommonQuestionData.getSlideType(slideDetails);
    let pageTemplate = CommonQuestionData.getPageTemplate(slideDetails);

    let entity = null;

    if (slideType === constants.slideTypes.information) {
        entity = mapInformationContent(slideDetails, webControlInfoCollectionData, imagesStorage);
    } else if (slideType === constants.slideTypes.question) {
        pageTemplate = pageTemplate.toUpperCase();
        switch (pageTemplate) {
            case constants.pageTemplates.MULTIPLECHOICEQUESTIONTEXT:
            case constants.pageTemplates.MULTIPLECHOICEQUESTIONTEXTHTML:
                entity = mapSingleAndMultipleChoice(slideDetails, webControlInfoCollectionData, imagesStorage);
                break;
            case constants.pageTemplates.HOTSPOTQUESTION:
            case constants.pageTemplates.HOTSPOTQUESTIONHTML:
                entity = mapHotspot(slideDetails, webControlInfoCollectionData, imagesStorage);
                break;
            case constants.pageTemplates.MULTIPLECHOICEQUESTIONIMAGE:
                entity = mapSingleChoiceImage(slideDetails, webControlInfoCollectionData, imagesStorage);
                break;
            case constants.pageTemplates.STATEMENTQUESTION:
			case constants.pageTemplates.STATEMENTQUESTIONHTML:
                entity = mapStatement(slideDetails, webControlInfoCollectionData, imagesStorage);
                break;
            case constants.pageTemplates.OPENQUESTION:
                entity = mapOpenQuestion(slideDetails, webControlInfoCollectionData, imagesStorage);
                break;
            case constants.pageTemplates.TEXTSMATCHINGQUESTION:
            case constants.pageTemplates.TEXTSMATCHINGQUESTIONHTML:
                entity = mapTextMatching(slideDetails, webControlInfoCollectionData, imagesStorage);
                break;
            case constants.pageTemplates.FILLINTHEBLANKSQUESTION:
                entity = mapFillInTheBlanks(slideDetails, webControlInfoCollectionData, imagesStorage);
                break;
            default:
                entity = mapInformationContent(slideDetails, webControlInfoCollectionData, imagesStorage);
                break;
        }
    }

    return entity;
};