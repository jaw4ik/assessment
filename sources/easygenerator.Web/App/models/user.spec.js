import User from './user';

import constants from 'constants';

describe('model [user]', function () {

    it('should be constructor function', function () {
        expect(User).toBeFunction();
    });

    describe('when specification is not an object', function () {

        it('should throw exception', function () {
            var f = function () {
                new User();
            };
            expect(f).toThrow();
        });

    });

    describe('when email is not specified', function () {

        it('should throw exception', function () {
            var f = function () {
                new User({});
            };
            expect(f).toThrow();
        });

    });

    describe('when subscription is not specified', function () {
        it('should throw exception', function () {
            var f = function () {
                new User({
                    email: 'a.drebot@gmail.com'
                });
            };
            expect(f).toThrow();
        });
    });

    it('should create user', function () {

        var spec = {
            firstname: 'firstname',
            lastname: 'lastname',
            email: 'a.drebot@gmail.com',
            role: 'Teacher',
            phone: '0123',
            newEditor: null,
            isCreatedThroughLti: false,
            isNewEditorByDefault: true,
            companies: [{}],
            subscription: {
                accessType: constants.accessType.starter
            }
        };

        var user = new User(spec);

        expect(user.firstname).toEqual(spec.firstname);
        expect(user.lastname).toEqual(spec.lastname);
        expect(user.fullname).toEqual(spec.firstname + ' ' + spec.lastname);
        expect(user.email).toEqual(spec.email);
        expect(user.role).toEqual(spec.role);
        expect(user.phone).toEqual(spec.phone);
        expect(user.newEditor).toEqual(spec.newEditor);
        expect(user.isCreatedThroughLti).toEqual(spec.isCreatedThroughLti);
        expect(user.isNewEditorByDefault).toEqual(spec.isNewEditorByDefault);
        expect(user.companies.length).toBe(1);

    });

    describe('when starter subscription is specified', function () {

        it('should create user with starter subscription', function () {
            var spec = {
                firstname: 'firstname',
                lastname: 'lastname',
                email: 'a.drebot@gmail.com',
                subscription: {
                    accessType: constants.accessType.starter,
                    expirationDate: "2014-03-19T12:49:34.7396182Z"
                }
            };

            var user = new User(spec);

            expect(user.subscription).toEqual({
                accessType: constants.accessType.starter,
                expirationDate: new Date("2014-03-19T12:49:34.7396182Z")
            });

        });

    });

    describe('when plus subscription is specified', function () {

        it('should create user with plus subscription', function () {
            var spec = {
                firstname: 'firstname',
                lastname: 'lastname',
                email: 'a.drebot@gmail.com',
                subscription: {
                    accessType: constants.accessType.plus,
                    expirationDate: "2014-03-19T12:49:34.7396182Z"
                }
            };

            var user = new User(spec);

            expect(user.subscription).toEqual({
                accessType: constants.accessType.plus,
                expirationDate: new Date("2014-03-19T12:49:34.7396182Z")
            });

        });

    });

    describe('when academy subscription is specified', function () {

        it('should create user with academy subscription', function () {
            var spec = {
                firstname: 'firstname',
                lastname: 'lastname',
                email: 'a.drebot@gmail.com',
                subscription: {
                    accessType: constants.accessType.academy,
                    expirationDate: "2014-03-19T12:49:34.7396182Z"
                }
            };

            var user = new User(spec);

            expect(user.subscription).toEqual({
                accessType: constants.accessType.academy,
                expirationDate: new Date("2014-03-19T12:49:34.7396182Z")
            });

        });

    });

    describe('when trial subscription is specified', function () {

        it('should create user with starter subscription', function () {
            var spec = {
                firstname: 'firstname',
                lastname: 'lastname',
                email: 'a.drebot@gmail.com',
                subscription: {
                    accessType: constants.accessType.trial,
                    expirationDate: "2014-03-19T12:49:34.7396182Z"
                }
            };

            var user = new User(spec);

            expect(user.subscription).toEqual({
                accessType: constants.accessType.trial,
                expirationDate: new Date("2014-03-19T12:49:34.7396182Z")
            });

        });

    });

    describe('when free subscription is specified', function () {

        it('should create user with starter subscription', function () {
            var spec = {
                firstname: 'firstname',
                lastname: 'lastname',
                email: 'a.drebot@gmail.com',
                subscription: {
                    accessType: constants.accessType.free,
                }
            };

            var user = new User(spec);

            expect(user.subscription).toEqual({
                accessType: constants.accessType.free
            });

        });

    });

    describe('when subscription type is unknown', function () {

        it('should throw exception', function () {
            var spec = {
                firstname: 'firstname',
                lastname: 'lastname',
                email: 'a.drebot@gmail.com',
                subscription: {
                    accessType: 543,
                }
            };

            var f = function () {
                new User(spec);
            };

            expect(f).toThrow();
        });

    });

    describe('downgrade:', function () {

        var user;

        beforeEach(function () {
            user = new User({
                firstname: 'firstname',
                lastname: 'lastname',
                email: 'a.drebot@gmail.com',
                subscription: {
                    accessType: constants.accessType.starter,
                    expirationDate: "2014-03-19T12:49:34.7396182Z"
                }
            });
        });

        it('should be function', function () {
            expect(user.downgrade).toBeFunction();
        });

        it('should downgrade user to free subscription', function () {
            user.downgrade();

            expect(user.subscription.accessType).toEqual(constants.accessType.free);
            expect(user.subscription.expirationDate).toBeUndefined();
        });

    });

    describe('upgradeToStarter:', function () {
        var user;

        beforeEach(function () {
            user = new User({
                firstname: 'firstname',
                lastname: 'lastname',
                email: 'a.drebot@gmail.com',
                subscription: {
                    accessType: constants.accessType.free
                }
            });
        });

        it('should be function', function () {
            expect(user.upgradeToStarter).toBeFunction();
        });

        it('should upgrade user to starter', function () {
            user.upgradeToStarter("2014-03-19T12:49:34.7396182Z");

            expect(user.subscription.accessType).toEqual(constants.accessType.starter);
            expect(user.subscription.expirationDate).toEqual(new Date("2014-03-19T12:49:34.7396182Z"));
        });


        describe('when expiration date is not specified', function () {

            it('should throw exception', function () {
                var f = function () {
                    user.upgradeToStarter();
                };

                expect(f).toThrow();
            });

        });
    });

    describe('upgradeToPlus:', function () {
        var user;

        beforeEach(function () {
            user = new User({
                firstname: 'firstname',
                lastname: 'lastname',
                email: 'a.drebot@gmail.com',
                subscription: {
                    accessType: constants.accessType.free
                }
            });
        });

        it('should be function', function () {
            expect(user.upgradeToPlus).toBeFunction();
        });

        it('should upgrade user to plus', function () {
            user.upgradeToPlus("2014-03-19T12:49:34.7396182Z");

            expect(user.subscription.accessType).toEqual(constants.accessType.plus);
            expect(user.subscription.expirationDate).toEqual(new Date("2014-03-19T12:49:34.7396182Z"));
        });


        describe('when expiration date is not specified', function () {

            it('should throw exception', function () {
                var f = function () {
                    user.upgradeToPlus();
                };

                expect(f).toThrow();
            });

        });
    });

    describe('upgradeToAcademy:', function () {
        var user;

        beforeEach(function () {
            user = new User({
                firstname: 'firstname',
                lastname: 'lastname',
                email: 'a.drebot@gmail.com',
                subscription: {
                    accessType: constants.accessType.free
                }
            });
        });

        it('should be function', function () {
            expect(user.upgradeToAcademy).toBeFunction();
        });

        it('should upgrade user to plus', function () {
            user.upgradeToAcademy("2014-03-19T12:49:34.7396182Z");

            expect(user.subscription.accessType).toEqual(constants.accessType.academy);
            expect(user.subscription.expirationDate).toEqual(new Date("2014-03-19T12:49:34.7396182Z"));
        });


        describe('when expiration date is not specified', function () {

            it('should throw exception', function () {
                var f = function () {
                    user.upgradeToAcademy();
                };

                expect(f).toThrow();
            });

        });
    });

    describe('upgradeToAcademyBT:', function () {
        var user;

        beforeEach(function () {
            user = new User({
                firstname: 'firstname',
                lastname: 'lastname',
                email: 'a.drebot@gmail.com',
                subscription: {
                    accessType: constants.accessType.free
                }
            });
        });

        it('should be function', function () {
            expect(user.upgradeToAcademyBT).toBeFunction();
        });

        it('should upgrade user to plus', function () {
            user.upgradeToAcademyBT("2014-03-19T12:49:34.7396182Z");

            expect(user.subscription.accessType).toEqual(constants.accessType.academy);
            expect(user.subscription.expirationDate).toEqual(new Date("2014-03-19T12:49:34.7396182Z"));
        });


        describe('when expiration date is not specified', function () {

            it('should throw exception', function () {
                var f = function () {
                    user.upgradeToAcademyBT();
                };

                expect(f).toThrow();
            });

        });
    });

});