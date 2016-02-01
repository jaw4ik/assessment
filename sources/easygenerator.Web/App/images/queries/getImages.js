import http from 'http/apiHttpWrapper.js';

export function execute() {
    return new Promise((resolve, reject) => {
        http.get('api/images')
            .then(response => {
                if (response && response.success) {
                    resolve(response.data);
                } else {
                    reject("Failed to load Image library");
                }
            }).fail(reject);
    });
}