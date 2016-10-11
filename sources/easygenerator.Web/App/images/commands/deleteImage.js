import http from 'http/apiHttpWrapper.js';

async function execute(id) {
    return await http.post('storage/image/delete', { imageFileId: id });
}

export { execute };