using easygenerator.DomainModel.Entities;
using System.Collections.Generic;

namespace easygenerator.DomainModel.Repositories
{
    public interface ICourseRepository : IRepository<Course>
    {
        ICollection<Course> GetOwnedCourses(string email);
        ICollection<Course> GetAvailableCoursesCollection(string username);
    }
}
