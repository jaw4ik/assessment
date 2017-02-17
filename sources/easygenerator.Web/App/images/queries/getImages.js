import http from 'http/apiHttpWrapper.js';
import constants from 'constants';

const getImagesUrl = `${constants.imageService.host}/images`;

async function execute() {
    try {
        let response = await http.get(getImagesUrl);
        return response;
    } catch (e) {
        throw 'Failed to load Image library';
    }
}

export { execute };