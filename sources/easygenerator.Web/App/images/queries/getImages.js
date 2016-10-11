import http from 'http/apiHttpWrapper.js';

async function execute() {
    let response = await http.get('api/images');
    if (!response || !response.success) {
        throw 'Failed to load Image library';
    }

    return response.data;
}

export { execute };