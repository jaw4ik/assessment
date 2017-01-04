export default {
    stepSubmitted: 'dialog:step-submitted',
    dialogClosed: 'dialog:dialogClosed',
    deleteItem: {
        settings: {
            containerCss: 'delete-item'
        }
    },
    deleteSection: {
        settings: {
            containerCss: 'delete-section'
        }
    },
    deleteCourse: {
        settings: {
            containerCss: 'delete-course'
        }
    },
    createCourse: {
        settings: {
            containerCss: 'create-course'
        }
    },
    changeCourseTemplate: {
        settings: {
            containerCss: 'change-course-template'
        }
    },
    releaseNote: {
        settings: {
            containerCss: 'release-note'
        }
    },
    moveCopyQuestion: {
        settings: {
            containerCss: 'move-copy-question'
        }
    },
    chooseVoiceOver: {
        settings: {
            containerCss: 'choose-voice-over'
        }
    },
    branchtrack: {
        settings: {
            containerCss: 'branchtrack-dialog'
        }
    },
    survey: {
        settings: {
            containerCss: 'survey'
        }
    },
    editorFeedback: {
        settings: {
            containerCss: 'editor-feedback',
            boundless: true
        }
    },
    watchTutorial: {
        settings: {
            containerCss: 'watch-tutorial'
        }
    },
    addCourseByExamples: {
        settings: {
            containerCss: 'add-course-by-examples'
        }
    },
    upgrade: {
        settings: {
            default: {
                titleKey: 'upgradeDialogBoldTitle',
                subtitleKey: '',
                descriptionKey: '',
                upgradeBtnTextKey: 'upgradeDialogUpgradeNow',
                skipBtnTextKey: 'upgradeDialogMaybeLater',
                containerCss: 'upgrade-dialog-empty',
                eventCategory: ''
            },
            downloadResults: {
                containerCss: 'upgrade-dialog-download-results',
                eventCategory: 'Download results CSV',
                subtitleKey: 'resultsUpgradeForDownloadCSVDialogTitle2',
                descriptionKey: 'resultsUpgradeForDownloadCSVDialogHtml'
            },
            loadMoreResults: {
                containerCss: 'upgrade-dialog-all-results',
                eventCategory: 'Load more results',
                subtitleKey: 'resultsUpgradeDialogTitle2',
                descriptionKey: 'resultsUpgradeDialogText'
            },
            extendedResults: {
                containerCss: 'upgrade-dialog-extended-results',
                eventCategory: 'Load extended results',
                subtitleKey: 'resultsUpgradeForExtendedResultsTitle2',
                descriptionKey: 'resultsUpgradeForExtendedResultsHtml'
            },
            videoUpload: {
                containerCss: 'upgrade-dialog-video-upload',
                eventCategory: 'Video library',
                subtitleKey: 'videoUpgradeToUpload',
                descriptionKey: 'videoUpgradeToUploadHtml'
            },
            duplicateCourse: {
                containerCss: 'upgrade-dialog-duplicate-course',
                eventCategory: 'Duplicate course',
                subtitleKey: 'coursesUpgradeToHaveMore',
                descriptionKey: 'coursesUpgradeToHaveMoreHtml'
            },
            audioUpload: {
                containerCss: 'upgrade-dialog-audio-upload',
                eventCategory: 'Audio library',
                subtitleKey: 'audioUploadUpgradeSubtitle',
                descriptionKey: 'audioUploadUpgradeText'
            },
            manageOrganization: {
                containerCss: 'upgrade-dialog-manage-organization',
                eventCategory: 'Manage organization',
                subtitleKey: 'manageOrganizationUpgradeSubtitle',
                descriptionKey: 'manageOrganizationUpgradeText'
            },
            publishToCoggno: {
                containerCss: 'upgrade-dialog-publish-coggno',
                eventCategory: 'Publish to Coggno',
                subtitleKey: 'publishToCoggnoUpgradeSubtitle',
                descriptionKey: 'publishToCoggnoUpgradeText'
            },
            saveThemes: {
                containerCss: 'upgrade-dialog-save-themes',
                eventCategory: 'Save themes',
                subtitleKey: 'saveThemesUpgradeSubtitle',
                descriptionKey: 'saveThemesUpgradeText'
            }
        }
    },
    mediaLibraryDialog: {
        settings: {
            containerCss: 'media-library-dialog'
        }
    }
};