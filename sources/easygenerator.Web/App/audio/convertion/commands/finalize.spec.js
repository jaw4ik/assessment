import command from './finalize';

import http from 'plugins/http';
import getTicket from 'audio/convertion/commands/getTicket';

describe('[convertion finalize]', function () {

    it('should be object', function () {
        expect(command).toBeObject();
    });

    describe('execute:', function () {

        var removeDfd, getTicketDfd;

        beforeEach(function () {
            removeDfd = $.Deferred();
            spyOn(http, 'remove').and.returnValue(removeDfd.promise());

            getTicketDfd = Q.defer();
            spyOn(getTicket, 'execute').and.returnValue(getTicketDfd.promise);
        });


        it('should be function', function () {
            expect(command.execute).toBeFunction();
        });

        it('should return promise', function () {
            expect(command.execute({})).toBePromise();
        });

        it('should get ticket to the convertion server', function (done) {
            getTicketDfd.resolve('ticket');
            removeDfd.resolve();
            command.execute({}).then(function () {
                expect(getTicket.execute).toHaveBeenCalled();
                done();
            }).done();
        });

        describe('when request to get ticked failed', function () {

            beforeEach(function () {
                getTicketDfd.reject();
            });

            it('should reject promise', function (done) {
                command.execute({}).catch(function () {
                    expect(getTicket.execute).toHaveBeenCalled();
                    done();
                });
            });

        });

        describe('when ticket received', function () {

            beforeEach(function () {
                getTicketDfd.resolve('ticket');
            });

            it('should send DELETE request to convertion server', function (done) {
                removeDfd.resolve();
                command.execute({ source: 'url' }).then(function () {
                    expect(http.remove).toHaveBeenCalled();
                    done();
                }).done();
            });

            describe('when request finished successfully', function () {

                beforeEach(function () {
                    removeDfd.resolve();
                });

                it('should resolve promise', function (done) {
                    command.execute({ source: 'url' }).then(function () {
                        done();
                    }).done();
                });

            });

            describe('when request failed', function () {

                beforeEach(function () {
                    removeDfd.reject();
                });

                it('should reject promise', function (done) {
                    command.execute({ url: 'url' }).catch(function () {
                        done();
                    }).done();
                });

            });

        });

    });

});
