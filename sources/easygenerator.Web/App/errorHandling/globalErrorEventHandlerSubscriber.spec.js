define(['errorHandling/globalErrorEventHandlerSubscriber', 'errorHandling/serviceUnavailabeErrorHandler'],
	function (subscriber, internalServerErrorHandler, serviceUnavailabeErrorHandler) {

	    describe('[globalErrorEventSubscriber]', function () {

	        describe('subscribe:', function () {

	            beforeEach(function () {
	                spyOn(internalServerErrorHandler, 'subscribeOnGlobalErrorEvents');
	                spyOn(serviceUnavailabeErrorHandler, 'subscribeOnGlobalErrorEvents');
	            });

	            it('should be function', function () {
	                expect(subscriber.subscribe).toBeFunction();
	            });

	            it('should call serviceUnavailabeErrorHandler subscribeOnGlobalErrorEvents()', function () {
	                subscriber.subscribe();
	                expect(serviceUnavailabeErrorHandler.subscribeOnGlobalErrorEvents).toHaveBeenCalled();
	            });

	        });

	    });

	}
);