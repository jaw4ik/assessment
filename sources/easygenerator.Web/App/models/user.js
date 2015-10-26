define(['constants', 'guard', 'mappers/companyMapper'], function (constants, guard, companyMapper) {

    function User(spec) {
        guard.throwIfNotAnObject(spec, 'You should provide specification to create user');
        guard.throwIfNotString(spec.email, 'You should provide email to create user');

        this.email = spec.email;
        this.role = spec.role;

        this.firstname = spec.firstname;
        this.lastname = spec.lastname;
        this.fullname = spec.firstname + ' ' + spec.lastname;
        this.showReleaseNote = spec.showReleaseNote;

        this.company = spec.company ? companyMapper.map(spec.company) : null;

        guard.throwIfNotAnObject(spec.subscription, 'You should provide subscription to create user');
        switch (spec.subscription.accessType) {
            case 0:
                this.subscription = {
                    accessType: constants.accessType.free
                };
                break;
            case 1:
                this.subscription = {
                    accessType: constants.accessType.starter,
                    expirationDate: new Date(spec.subscription.expirationDate)
                };
                break;
            case 2:
                this.subscription = {
                    accessType: constants.accessType.plus,
                    expirationDate: new Date(spec.subscription.expirationDate)
                };
                break;
            case 3:
                this.subscription = {
                    accessType: constants.accessType.academy,
                    expirationDate: new Date(spec.subscription.expirationDate)
                };
                break;
            case 100:
                this.subscription = {
                    accessType: constants.accessType.trial,
                    expirationDate: new Date(spec.subscription.expirationDate)
                };
                break;
            default:
                throw 'Provided subscription is not supported';
        }
    };

    User.prototype.downgrade = function () {
        this.subscription = {
            accessType: constants.accessType.free
        };
    };

    User.prototype.upgradeToStarter = function (expirationDate) {
        guard.throwIfNotString(expirationDate, 'Expiration date is not specified');
        this.subscription = {
            accessType: constants.accessType.starter,
            expirationDate: new Date(expirationDate)
        };
    };

    User.prototype.upgradeToPlus = function (expirationDate) {
        guard.throwIfNotString(expirationDate, 'Expiration date is not specified');
        this.subscription = {
            accessType: constants.accessType.plus,
            expirationDate: new Date(expirationDate)
        };
    };

    return User;

})