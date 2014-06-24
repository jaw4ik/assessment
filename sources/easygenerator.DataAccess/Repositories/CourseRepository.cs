using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
using System.Collections.Generic;

namespace easygenerator.DataAccess.Repositories
{
    public class CourseRepository : Repository<Course>, ICourseRepository
    {
        public CourseRepository(IDataContext dataContext)
            : base(dataContext)
        {
        }

        public ICollection<Course> GetOwnedCourses(string email)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(email, "email");
            return GetCollection(course => course.CreatedBy == email);
        }
    }
}
