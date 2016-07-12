import app from 'durandal/app';
import events from 'durandal/events';

let trackerEvents = {
    requestsFinalized: 'httpRequestTracker:requestsFinalized'
};

class HttpRequestTracker{
    constructor() {
        this.requestCount = 0;
        events.includeIn(this);
    }

    startTracking() {
        let incrementCounter = () => {
            this.requestCount++;
        };

        let decrementCounter = () => {
            this.requestCount--;
            if (this.requestCount === 0) {
                this.trigger(trackerEvents.requestsFinalized);
            }
        };

        app.on('apiHttpWrapper:post-begin').then(incrementCounter);
        app.on('authHttpWrapper:post-begin').then(incrementCounter);
        app.on('storageHttpWrapper:post-begin').then(incrementCounter);
        app.on('storageHttpWrapper:get-begin').then(incrementCounter);

        app.on('apiHttpWrapper:post-end').then(decrementCounter);
        app.on('authHttpWrapper:post-end').then(decrementCounter);
        app.on('storageHttpWrapper:post-end').then(decrementCounter);
        app.on('storageHttpWrapper:get-end').then(decrementCounter);
    }

    isRequestPending() {
        return this.requestCount > 0;
    }

    waitForRequestFinalization() {
        return new Promise((resolve) => {
            if (!this.isRequestPending()) {
                resolve();
                return;
            }

            let subscription = this.on(trackerEvents.requestsFinalized).then(function() {
                subscription.off();
                resolve();
            });
        });
    }
}

export default new HttpRequestTracker();