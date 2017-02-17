import http from 'http/apiHttpWrapper.js';
import constants from 'constants';

async function execute(id) {
    return await http.remove(`${constants.imageService.host}/image`, { id });
}

export { execute };