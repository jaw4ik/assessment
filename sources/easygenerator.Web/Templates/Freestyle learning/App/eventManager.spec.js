define(['eventManager'],
    function (viewModel) {

        var
            app = require('durandal/app');

        describe('viewModel [eventManager]', function () {

            it('should be defined', function () {
                expect(viewModel).toBeDefined();
            });

            describe('events:', function () {

                it('should be defined', function() {
                    expect(viewModel.events).toBeDefined();
                });

            });

            describe('turnAllEventsOff:', function () {

                it('should call app.off for all events', function() {
                    spyOn(app, 'off');

                    viewModel.turnAllEventsOff();

                    var eventList = [];
                    _.each(viewModel.events, function (event) {
                        eventList.push(event);
                    });
                    
                    expect(app.off.calls.length).toEqual(eventList.length);
                });

            });

            describe('subscribeForEvent:', function () {

                it('should return promise', function() {
                    var result = viewModel.subscribeForEvent(viewModel.events.courseStarted);
                    expect(result).toBePromise();
                });

                describe('when event is unsupported', function() {

                    it('should throw exception', function () {
                        var action = function() {
                            viewModel.subscribeForEvent('asdasdasd');
                        };

                        expect(action).toThrow('Unsupported event');
                    });

                });

                describe('when event is supported', function() {

                    it('should subscribe function for event', function() {
                        spyOn(app, 'on');
                        viewModel.subscribeForEvent(viewModel.events.courseStarted);
                        expect(app.on).toHaveBeenCalledWith(viewModel.events.courseStarted);
                    });

                });

            });

        });

    }
);