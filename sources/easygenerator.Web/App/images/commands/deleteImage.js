import http from 'http/apiHttpWrapper.js';

export function execute(id) {
    return new Promise((resolve, reject) => {
        http.post('storage/image/delete', { imageFileId: id })
            .then(resolve)
            .fail(reject);
    });
}

