using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.SqlClient;
using System.Linq;

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

        public ICollection<Course> GetCoursesRelatedToObjective(Guid objectiveId)
        {
            const string query = @"
               SELECT * FROM Courses WHERE Id IN
                (
                    SELECT obj.Course_Id FROM CourseObjectives obj WHERE Objective_Id = @objectiveId
                )
            ";

            return ((DbSet<Course>)_dataContext.GetSet<Course>()).SqlQuery(query,
                new SqlParameter("@objectiveId", objectiveId)).ToList();
        }

        public ICollection<Course> GetCoursesRelatedToQuestion(Guid questionId)
        {
            const string query = @"
               SELECT *  FROM Courses WHERE Id IN
	            (
	                SELECT obj.Course_Id FROM CourseObjectives obj WHERE Objective_Id = 
		            (
			            SELECT question.Objective_Id FROM Questions question WHERE Id = @questionId
		            )
	            )
            ";

            return ((DbSet<Course>)_dataContext.GetSet<Course>()).SqlQuery(query,
                new SqlParameter("@questionId", questionId)).ToList();
        }
    }
}
