using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
using System;
using System.Collections.Generic;
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
            IQueryable<User> users = _dataContext.GetSet<User>();
            DateTime currenTime = DateTimeWrapper.Now();

            return _dataContext.GetSet<Course>().Join(users, course => course.CreatedBy, user => user.Email, (course, user) => new { course, user }).Where(
                     courseUsers => courseUsers.course.CreatedBy == username ||
                         (
                             courseUsers.course.CollaboratorsCollection.Any(collaborator => collaborator.Email == username) &&
                             courseUsers.course.CollaboratorsCollection.Count <=
                                (

                                     (courseUsers.user.AccessType >= AccessType.Plus && !(!courseUsers.user.ExpirationDate.HasValue || courseUsers.user.ExpirationDate.Value < currenTime)) ? Int32.MaxValue :
                                         ((courseUsers.user.AccessType >= AccessType.Starter && !(!courseUsers.user.ExpirationDate.HasValue || courseUsers.user.ExpirationDate.Value < currenTime)) ? Constants.Collaboration.MaxCollaboratorsCountForStarterPlan : 0)

                                )
                         )
             ).Select(courseUsers => courseUsers.course).ToList();
        }
    }
}
