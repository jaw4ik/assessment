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
            return _dataContext.GetSet<Course>().Where(
                        course => course.CreatedBy == username ||
                            (
                                course.CollaboratorsCollection.Any(collaborator => collaborator.Email == username) &&
                                course.CollaboratorsCollection.Count <=
                                    (
                                        users.Where(user => user.Email == course.CreatedBy)
                                        .Select
                                        (
                                            user => (user.AccessType >= AccessType.Plus && !(!user.ExpirationDate.HasValue || user.ExpirationDate.Value < currenTime)) ? Int32.MaxValue :
                                                    ((user.AccessType >= AccessType.Starter && !(!user.ExpirationDate.HasValue || user.ExpirationDate.Value < currenTime)) ? Constants.Collaboration.MaxCollaboratorsCountForStarterPlan : 0)

                                        ).FirstOrDefault()
                                    )
                            )
                ).ToList();
        }
    }
}
