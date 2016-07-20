define(['constants', 'guard', 'mappers/companyMapper', 'mappers/organizationMapper', 'mappers/organizationInviteMapper'], function (constants, guard, companyMapper, organizationMapper,
    organizationInviteMapper) {

    function User(spec) {
        guard.throwIfNotAnObject(spec, 'You should provide specification to create user');
        guard.throwIfNotString(spec.email, 'You should provide email to create user');

        this.email = spec.email;
        this.role = spec.role;
        this.phone = spec.phone;

        this.firstname = spec.firstname;
        this.lastname = spec.lastname;
        this.fullname = spec.firstname + ' ' + spec.lastname;
        this.showReleaseNote = spec.showReleaseNote;
        this.newEditor = spec.newEditor;
        this.isCreatedThroughLti = spec.isCreatedThroughLti;
        this.isCreatedThroughSamlIdP = spec.isCreatedThroughSamlIdP;
        this.isCoggnoSamlServiceProviderAllowed = spec.isCoggnoSamlServiceProviderAllowed;
        this.isNewEditorByDefault = spec.isNewEditorByDefault;
        this.includeMediaToPackage = spec.includeMediaToPackage;
        this.companies = spec.companies && spec.companies.length ? spec.companies.map(companyMapper.map) : [];
        this.organizations = spec.organizations && spec.organizations.length ? spec.organizations.map(organizationMapper.map) : [];
        this.organizationInvites = spec.organizationInvites && spec.organizationInvites.length ? spec.organizationInvites.map(organizationInviteMapper.map) : [];

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
            case 4:
                this.subscription = {
                    accessType: constants.accessType.academyBT,
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

    User.prototype.upgradeToAcademy = function (expirationDate) {
        guard.throwIfNotString(expirationDate, 'Expiration date is not specified');
        this.subscription = {
            accessType: constants.accessType.academy,
            expirationDate: new Date(expirationDate)
        };
    };

    User.prototype.upgradeToAcademyBT = function (expirationDate) {
        guard.throwIfNotString(expirationDate, 'Expiration date is not specified');
        this.subscription = {
            accessType: constants.accessType.academyBT,
            expirationDate: new Date(expirationDate)
        };
    };

    User.prototype.isOrganizationAdmin = function () {
        return _.some(this.organizations, function (organization) {
            return organization.grantsAdminAccess;
        });
    };

    User.prototype.isOrganizationMember = function () {
        return this.organizations.length > 0;
    };

    User.prototype.hasOrganizationInvites = function () {
        return this.organizationInvites.length > 0;
    };

    User.prototype.getFirstAdminAccessOrganization = function () {
        return _.find(this.organizations, function (organization) {
            return organization.grantsAdminAccess;
        });
    }

    return User;

})