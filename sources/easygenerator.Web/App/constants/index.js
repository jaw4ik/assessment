module.exports = {
    accessType:         require('./accessType'),
    clientContextKeys:  require('./clientContextKeys'),
    comment:            require('./comment'),
    contentsTypes:      require('./contentsTypes'),
    dialogs:            require('./dialogs'),
    documentType:       require('./documentType'),
    messages:           require('./messages'),
    notification:       require('./notification'),
    questionType:       require('./questionType'),
    reporting:          require('./reporting'),
    storage:            require('./storage'),
    upgradeCategory:    require('./upgradeCategory'),
    validation:         require('./validation'),

    appVersion: window.egVersion,
    organizationUserStatus: {
        waitingForAcceptance: 0,
        accepted: 1,
        declined: 2,
        waitingForEmailConfirmation: 3
    },
    courseOwnership: {
        owned: 0,
        shared: 1,
        organization: 2
    },
    questionFeedback: {
        correct: 'correct',
        incorrect: 'incorrect'
    },
    sortingOptions: {
        byTitleAsc: 'byTitleAsc',
        byTitleDesc: 'byTitleDesc'
    },
    publishingStates: {
        building: 'building',
        publishing: 'publishing',
        succeed: 'succeed',
        failed: 'failed'
    },
    collaboratorStates: {
        deleting: 'deleting'
    },
    autosaveTimersInterval: {
        answerOption: 60000,
        learningContent: 60000,
        entityContent: 60000,
        questionTitle: 5000,
        feedbackText: 60000
    },
    patterns: {
        email: /^[^@\s]+@[^@\s]+$/,
        coursePage: /courses\/[\d\w]+/
    },
    upgradeEvent: 'Upgrade now',
    upgradeUrl: '/account/upgrade',
    signinUrl: '/signin',
    maxStarterPlanCollaborators: 3,
    eventCategories: {
        header: 'Header',
        informationContent: 'Information'
    },
    frameSize: {
        width: {
            name: 'frameWidth',
            value: 930
        },
        height: {
            name: 'frameHeight',
            value: 700
        }
    },
    embedCode: '<iframe width="{W}" height="{H}" src="{src}" frameborder="0" allowfullscreen></iframe>',
    copyToClipboardWait: 5000,
    results: {
        pageSize: 10
    },
    player: {
        host: window.playerUrl ? `//${window.playerUrl}`: '//localhost:555',
        sourcesPath: '/sources'
    },
    templates: {
        newEditorDefaultText: '<h1>Heading 1 text goes here</h1><p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>'
    },
    newCourseEditor: {
        switchToNewEditorMessageClosed: ':switchToNewEditorMessageClosed',
        switchToOldEditorMessageClosed: ':switchToOldEditorMessageClosed'
    },
    winToWeb: {
        host: window.winToWebConvertionServiceUrl ? `//${window.winToWebConvertionServiceUrl}`: '//localhost:444'
    },
    coggno: {
        serviceUrl: window.coggnoServiceUrl || 'https://coggno.com/',
        serviceProviderUrl: window.coggnoServiceProviderUrl || 'https://coggno.com/easygenerator/sp/saml_login'
    },
    surveyPopup: {
        originUrl: window.surveyPopupOriginUrl,
        pageUrl: window.surveyPopupPageUrl
    },
    fonts: {
        customFontUrl: window.customFontUrl || '/Content/common.css'
    }
};