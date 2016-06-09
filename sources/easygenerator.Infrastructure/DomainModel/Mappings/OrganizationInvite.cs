using System;

namespace easygenerator.Infrastructure.DomainModel.Mappings
{
    public class OrganizationInvite
    {
        public Guid Id { get; set; }
        public Guid OrganizationId { get; set; }
        public string OrganizationTitle { get; set; }
        public string OrganizationAdminFirstName { get; set; }
        public string OrganizationAdminLastName { get; set; }
    }
}
