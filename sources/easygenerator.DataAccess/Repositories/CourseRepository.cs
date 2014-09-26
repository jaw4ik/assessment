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
            const string query = @"
                SELECT * FROM Courses WHERE CreatedBy = @createdBy OR Id IN
                (
		            SELECT cc.Course_Id FROM CourseCollaborators cc	WHERE cc.Email = @createdBy AND cc.Locked = 0
                )
            ";

            return ((DbSet<Course>)_dataContext.GetSet<Course>()).SqlQuery(query,
               new SqlParameter("@createdBy", username)).AsNoTracking().ToList();
        }
    }
}
