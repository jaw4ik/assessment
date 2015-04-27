define(['guard'],
    function (quard) {

        function waitFor(predicate, delay, limit) {
            quard.throwIfNotFunction(predicate, 'predicate is not a function');
            quard.throwIfNotPositiveNumber(delay, 'delay is not a positive number');
            quard.throwIfNotPositiveNumber(limit, 'limit is not a positive number');

            var defer = Q.defer();
            wait(0);

            return defer.promise;

            function wait(timeoutCounter) {
                if (predicate()) {
                    defer.resolve();
                    return;
                }

                timeoutCounter++;
                if (timeoutCounter > limit) {
                    defer.reject();
                    return;
                }

                setTimeout(function () { wait(timeoutCounter); }, delay);
            }
        }

        return {
            waitFor: waitFor
        };
    }
);