export default {
    xApiVerbIds: {
        started: 'http://adlnet.gov/expapi/verbs/launched',
        progressed: 'http://adlnet.gov/expapi/verbs/progressed',
        passed: 'http://adlnet.gov/expapi/verbs/passed',
        failed: 'http://adlnet.gov/expapi/verbs/failed',
        answered: 'http://adlnet.gov/expapi/verbs/answered',
        mastered: 'http://adlnet.gov/expapi/verbs/mastered',
        experienced: 'http://adlnet.gov/expapi/verbs/experienced'
    },
    xApiActivityTypes: {
        course: 'http://adlnet.gov/expapi/activities/course',
        objective: 'http://adlnet.gov/expapi/activities/objective'
    },
    filterKeys: {
        courseId: 'context.extensions.http://easygenerator/expapi/course/id',
        learningPathId: 'context.extensions.http://easygenerator/expapi/learningpath/id',
        verb: 'verb',
        type: 'type',
        limit: 'limit',
        skip: 'skip',
        agent: 'agent',
        attemptId: 'registration',
        parentId: 'parent',
        embeded: 'embeded'
    }
};