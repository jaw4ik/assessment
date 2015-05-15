using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure.DomainModel.Mappings;
using System.Collections.Generic;

namespace easygenerator.DomainModel.Repositories
{
    public interface ICourseCollaboratorRepository
    {
        ICollection<Course> GetSharedCourses(string email);
        IEnumerable<CollaborationInvite> GetCollaborationInvites(string userEmail);
        CollaborationInvite GetCollaborationInvite(CourseCollaborator collaborator);
        void LockCollaboration(string email);
        void UnlockCollaboration(string email);
        void UnlockCollaboration(string email, int allowedCollaborationsCount);
    }
}
