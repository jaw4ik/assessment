using System;
using System.Data.Entity;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
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

        public void RemoveCourseWithObjectives(Guid courseId)
        {
            var command = @"
                            DELETE FROM Objectives WHERE Id IN (SELECT Objective_Id FROM CourseObjectives WHERE Course_Id = @courseId)
                            DELETE FROM Courses WHERE ID = @courseId
                          ";

            ((DatabaseContext)_dataContext).Database.ExecuteSqlCommand(command, new SqlParameter("@courseId", courseId));
        }
    }
}
