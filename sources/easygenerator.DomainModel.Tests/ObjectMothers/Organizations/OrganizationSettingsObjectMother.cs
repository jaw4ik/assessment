using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Organizations;
using System;

namespace easygenerator.DomainModel.Tests.ObjectMothers.Organizations
{
    public class OrganizationSettingsObjectMother
    {
        public static OrganizationSettings Create()
        {
            return Create(OrganizationObjectMother.Create());
        }

        public static OrganizationSettings CreateWithOrganization(Organization organization)
        {
            return Create(organization);
        }

        public static OrganizationSettings CreateWithAccessType(AccessType? accessType)
        {
            return Create(OrganizationObjectMother.Create(), accessType: accessType, expirationDate: DateTime.MaxValue);
        }

        public static OrganizationSettings CreateWithExpirationDate(DateTime? expirationDate)
        {
            return Create(OrganizationObjectMother.Create(), accessType: AccessType.Academy, expirationDate: expirationDate);
        }

        public static OrganizationSettings CreateWithSubscription(AccessType accessType, DateTime expirationDate)
        {
            return Create(OrganizationObjectMother.Create(), accessType, expirationDate);
        }

        public static OrganizationSettings Create(Organization organization, AccessType? accessType = null, DateTime? expirationDate = null)
        {
            return new OrganizationSettings(organization, accessType, expirationDate);
        }
    }
}
