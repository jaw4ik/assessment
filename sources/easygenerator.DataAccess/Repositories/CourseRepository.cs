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
                   course.CollaboratorsCollection.Any(collaboration => collaboration.Email == username && collaboration.IsAccepted)
                   ).AsNoTracking().ToList();
        }

        public void RemoveCourseWithSections(Guid courseId)
        {
            var command = @"
                            DELETE FROM Sections WHERE Id IN (SELECT Section_Id FROM CourseSections WHERE Course_Id = @courseId)
                            DELETE FROM Courses WHERE ID = @courseId
                          ";

            ((DatabaseContext)_dataContext).Database.ExecuteSqlCommand(command, new SqlParameter("@courseId", courseId));
        }

        public ICollection<Course> GetCoursesRelatedToSection(Guid sectionId)
        {
            const string query = @"
                SELECT course.* FROM Courses course INNER JOIN CourseSections section ON section.Course_Id = course.Id 
                WHERE section.Section_Id = @sectionId
            ";

            return ((DbSet<Course>)_dataContext.GetSet<Course>()).SqlQuery(query,
                new SqlParameter("@sectionId", sectionId)).ToList();
        }        

        public IEnumerable<Course> GetCoursesWithTheme(Guid themeId)
        {
            var query = @"SELECT courses.* FROM Courses courses INNER JOIN CourseTemplateSettings settings
                          ON courses.Id = settings.Course_Id AND courses.Template_Id = settings.Template_Id
                          WHERE settings.Theme_Id = @themeId";

            return ((DbSet<Course>)_dataContext.GetSet<Course>()).SqlQuery(query,
                new SqlParameter("@themeId", themeId)).ToList();
        }
    }
}