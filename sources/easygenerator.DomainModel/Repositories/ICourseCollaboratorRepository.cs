using System.Collections.Generic;
using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Repositories
{
    public interface ICourseCollaboratorRepository
    {
        ICollection<Course> GetSharedCourses(string email);
        void LockCollaboration(string email);
        void UnlockCollaboration(string email);
        void UnlockCollaboration(string email, int allowedCollaborationsCount);
    }
}
