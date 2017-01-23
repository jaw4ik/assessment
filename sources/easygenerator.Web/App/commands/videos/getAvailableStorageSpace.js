import userContext from 'userContext';
import localizationManager from 'localization/localizationManager';

export default function() {
    let result = {};
    if (!userContext.hasStarterAccess() || userContext.hasTrialAccess()) {
        return false;
    }
    
    var free = userContext.storageIdentity.availableStorageSpace,
        max = userContext.storageIdentity.totalStorageSpace,
        value = free / 1073741824;

    result.availableStorageSpacePersentages = Math.round((max - free) / max * 100);

    if (value >= 1) {
        result.availableStorageSpace = value.toFixed(2) + localizationManager.localize('gb');
        return result;
    }
    value = value * 1024;
    result.availableStorageSpace = value.toFixed(2) + localizationManager.localize('mb');
    return result;
}