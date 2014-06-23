using System.Collections.Generic;
using System.Linq;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;

namespace easygenerator.DataAccess.Repositories
{
    public class CourseCollaboratorRepository : Repository<CourseCollaborator>, ICourseCollaboratorRepository
    {
        public CourseCollaboratorRepository(IDataContext dataContext)
            : base(dataContext)
        {
        }

        public ICollection<Course> GetSharedCourses(string email)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(email, "email");
            return GetCollection(collaborator => collaborator.Email == email || collaborator.CreatedBy == email).Select(item => item.Course).ToList();
        }
    }
}
