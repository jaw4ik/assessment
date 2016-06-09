using easygenerator.DomainModel.Entities.Organizations;

namespace easygenerator.DomainModel.Tests.ObjectMothers.Organizations
{
    public static class OrganizationUserObjectMother
    {
        private const string CreatedBy = "easygenerator@easygenerator.com";
        private const string UserEmail = "user@easygenerator.com";

        public static OrganizationUser Create(Organization organization, string userEmail = UserEmail, bool isAdmin = false, 
            OrganizationUserStatus status = OrganizationUserStatus.WaitingForAcceptance, string createdBy = CreatedBy)
        {
            return new OrganizationUser(organization, userEmail, isAdmin, status, createdBy);
        }

        public static OrganizationUser Create()
        {
            return Create(OrganizationObjectMother.Create());
        }

        public static OrganizationUser CreateWithOrganization(Organization organization)
        {
            return Create(organization);
        }

        public static OrganizationUser CreateWithStatus(OrganizationUserStatus status)
        {
            return Create(organization: OrganizationObjectMother.Create(), status: status);
        }

        public static OrganizationUser CreateWithCreatedBy(string createdBy)
        {
            return Create(organization: OrganizationObjectMother.Create(), createdBy: createdBy);
        }

        public static OrganizationUser CreateWithUserEmail(string userEmail)
        {
            return Create(organization: OrganizationObjectMother.Create(), userEmail: userEmail);
        }
    }
}
