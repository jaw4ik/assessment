define(function(require) {
    var viewModel = require('xAPI/requestManager'),
        app = require('durandal/app'),
        events = require('events');

    describe('requestManger:', function() {

        it('should be defined', function() {
            expect(viewModel).toBeDefined();
        });

        describe('init:', function () {
            
            it('should be defined', function() {
                expect(viewModel.init).toBeDefined();
            });

            it('should be function', function() {
                expect(viewModel.init).toBeFunction();
            });

            var defer;

            beforeEach(function () {
                defer = Q.defer();
                spyOn(app, 'on').andReturn(defer.promise);
                viewModel.init("Anonymous user", "anonymous@easygenerator.com", 'Some title of experience', '#someurl');

            });
            
            it('should register \'events.courseStarted\' event', function () {
                expect(app.on).toHaveBeenCalledWith(events.courseStarted);
            });
            
            it('should register \'events.courseFinished\' event', function () {
                expect(app.on).toHaveBeenCalledWith(events.courseFinished);
            });

        });

        describe('trackAction:', function() {

            it('should be defined', function() {
                expect(viewModel.trackAction).toBeDefined();
            });

            it('should be function', function() {
                expect(viewModel.trackAction).toBeFunction();
            });

            it('should be a promise', function () {
                var verb = {
                    id: "http://adlnet.gov/expapi/verbs/launched",
                    display: { "en-US": "started" }
                };
                var result = viewModel.trackAction(verb);
                expect(result).toBeObject();
                expect(result).not.toEqual(undefined);
                expect(result.then).toBeFunction();
            });

        });

    });
});