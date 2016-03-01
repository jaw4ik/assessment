import _ from 'underscore';
import app from 'durandal/app';
import constants from 'constants';
import notify from 'notify';
import localizationManager from 'localization/localizationManager';
import apiHttpWrapper from 'http/apiHttpWrapper';
import storageHttpWrapper from 'http/storageHttpWrapper';
import courseModelMapper from 'mappers/courseModelMapper';
import sectionModelMapper from 'mappers/sectionModelMapper';
import templateModelMapper from 'mappers/templateModelMapper';
import videoModelMapper from 'mappers/videoModelMapper';
import audioModelMapper from 'mappers/audioModelMapper';
import documentModelMapper from 'mappers/documentModelMapper';
import learningPathModelMapper from 'mappers/learningPathModelMapper';

var
    _sections = [],
    _courses = [],
    _documents = [],
    _templates = [],
    _learningPaths = [],
    _videos = [],
    _audios = [],

    revoked = null;

export default class {
    static async initialize() {
        if (revoked)
            throw 'dataContext has been already initialized';

        try {
            await* [
                (async () => {
                    await* [
                        (async () => {
                            [ _templates, _sections ] = await* [getTemplates(), getSections()];
                            _courses = await getCourses(_templates, _sections);
                        })(),
                        (async () => {
                            _documents = await getDocuments();
                        })()
                    ];
                    _learningPaths = await getLearningPaths(_courses, _documents);
                })(),
                (async () => {
                    try {
                        [ _videos, _audios ] = await getMedia();
                    } catch (e) {
                        notify.error(localizationManager.localize('storageFailed'));
                    }
                })()
            ];
            revoked = true;
        } catch (e) {
            app.showMessage("Failed to initialize datacontext.");
        }
    }
    static get sections() {
        return _sections;
    }
    static set sections(sections) {
        _sections = sections || [];
    }
    static get templates() {
        return _templates;
    }
    static set templates(templates) {
        _templates = templates || [];
    }
    static get courses() {
        return _courses;
    }
    static set courses(courses) {
        _courses = courses || [];
    }
    static get documents() {
        return _documents;
    }
    static set documents(documents) {
        _documents = documents || [];
    }
    static get learningPaths() {
        return _learningPaths;
    }
    static set learningPaths(learningPaths) {
        _learningPaths = learningPaths || [];
    }
    static get videos() {
        return _videos;
    }
    static set videos(videos) {
        _videos = videos || [];
    }
    static get audios() {
        return _audios;
    }
    static set audios(audios) {
        _audios = audios || [];
    }
    static getQuestions() {
        var questions = [];
        for(let section of _sections) {
            questions.push.apply(questions, section.questions);
        };
        return questions;
    }
}

async function getTemplates() {
    return _.map(await apiHttpWrapper.post('api/templates'), template => templateModelMapper.map(template));
}
async function getSections() {
    return _.map(await apiHttpWrapper.post('api/sections'), section => sectionModelMapper.map(section));
}
async function getDocuments() {
    return _.map(await apiHttpWrapper.post('api/documents'), document => documentModelMapper.map(document));
}
async function getCourses(templates, sections) {
    var courses = [];
    var data = await apiHttpWrapper.post('api/courses');
    for (let course of data) {
        // Temporary - do not display courses if user does not have template
        if (_.find(templates, template => course.Template.Id === template.id)) {
            courses.push(courseModelMapper.map(course, sections, templates));
        }
    }
    return courses;
}
async function getLearningPaths(courses, documents) {
    return _.map(await apiHttpWrapper.post('api/learningpaths'), learningPath => learningPathModelMapper.map(learningPath, courses, documents));
}
async function getMedia() {
    let data = await storageHttpWrapper.get(constants.storage.host + constants.storage.mediaUrl);
    return [ _.map(data.Videos, video => videoModelMapper.map(video)), _.map(data.Audios, audio => audioModelMapper.map(audio)) ];
}