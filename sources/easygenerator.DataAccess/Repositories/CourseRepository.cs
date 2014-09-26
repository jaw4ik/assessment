using System.Data.Entity;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Data.SqlClient;

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

        public ICollection<Course> GetAvailableCoursesCollection(string username)
        {
            return _dataContext.GetSet<Course>().Where(course => course.CreatedBy == username ||
                   course.CollaboratorsCollection.Any(collaboration => collaboration.Email == username && !collaboration.Locked)
                   ).AsNoTracking().ToList();
        }
    }
}
