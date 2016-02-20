import ko from 'knockout';
import convert from './commands/convert';
import notify from 'notify';

class WinToWebViewModel{
    constructor () {
        this.isUploading = ko.observable(false);
    }
    activate() { }
    async uploadPackage(file) {
        if (this.isUploading()) {
            return;
        }
        try {
            this.isUploading(true);
            await convert.execute(file);
            this.isUploading(false);
            notify.saved();
        } catch (e) {
            this.isUploading(false);
            notify.error('An error occurred while uploading the package. Please try again.');
        } 
    }
}

export default WinToWebViewModel;