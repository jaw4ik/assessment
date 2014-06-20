using System.Collections.Generic;
using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Repositories
{
    public interface ICourseCollaboratorRepository
    {
        ICollection<Course> GetSharedCourses(string email);
    }
}
