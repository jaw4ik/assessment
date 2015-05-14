using System;

namespace easygenerator.Infrastructure.DomainModel.Mappings
{
    public class CollaborationInvite
    {
        public Guid Id { get; set; }
        public Guid CourseId { get; set; }
        public string CourseTitle { get; set; }
        public string CourseAuthorFirstName { get; set; }
        public string CourseAuthorLastName { get; set; }
    }
}
