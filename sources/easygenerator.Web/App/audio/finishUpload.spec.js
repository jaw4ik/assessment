import command from './finishUpload';

import markAvailable from 'audio/commands/markAvailable';
import deleteSource from 'audio/convertion/commands/finalize';

describe('[finishUpload command]', function() {

    it('should be object', function() {
        expect(command).toBeObject();
    });

    describe('execute:', function() {

        var deleteSourceDfd, markAvailableDfd;

        beforeEach(function() {
            deleteSourceDfd = Q.defer();
            markAvailableDfd = Q.defer();

            spyOn(markAvailable, 'execute').and.returnValue(markAvailableDfd.promise);
            spyOn(deleteSource, 'execute').and.returnValue(deleteSourceDfd.promise);
        });

        it('should be function', function() {
            expect(command.execute).toBeFunction();
        });

        it('should return promise', function() {
            expect(command.execute({})).toBePromise();
        });

        it('should execute command to delete source', function(done) {
            deleteSourceDfd.resolve();
            markAvailableDfd.resolve();

            command.execute({}).then(function() {
                expect(deleteSource.execute).toHaveBeenCalled();
                done();
            }).done();
        });

        describe('and command do delete audio source finished successfully', function() {

            beforeEach(function() {
                deleteSourceDfd.resolve();
            });

            it('should execute command to mark audio as available', function(done) {
                markAvailableDfd.resolve();
                command.execute({}).then(function() {
                    expect(markAvailable.execute).toHaveBeenCalled();
                    done();
                }).done();
            });

            describe('and command to mark audio as available failed', function() {
                beforeEach(function() {
                    markAvailableDfd.reject('reason');
                });

                it('should reject promise', function(done) {
                    command.execute({}).catch(function(reason) {
                        expect(reason).toBeDefined();
                        done();
                    }).done();
                });
            });

            describe('and command to mark audio as avaiable finished successfuly', function() {
                beforeEach(function() {
                    markAvailableDfd.resolve({});
                });

                it('should resolve promise', function(done) {
                    command.execute({}).then(function(result) {
                        expect(result).toEqual({});
                        done();
                    }).done();
                });
            });
        });

        describe('and request do delete audio source failed', function() {

            beforeEach(function() {
                deleteSourceDfd.reject('reason');
            });

            it('should reject promise', function(done) {
                command.execute({}).catch(function(reason) {
                    expect(reason).toBeDefined();
                    done();
                }).done();
            });

        });

    });

});
