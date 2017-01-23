import userContext from 'userContext';
import storageFileUploader from 'storageFileUploader';
import eventTracker from 'eventTracker';

export default function(event, eventCategory, uploadSettings, associatedLearningContentId, callback) {
    if (!userContext.hasStarterAccess() || userContext.hasTrialAccess()) {
        return false;
    }

    storageFileUploader.upload(uploadSettings, associatedLearningContentId, callback);
    eventTracker.publish(event, eventCategory);
    return true;
};