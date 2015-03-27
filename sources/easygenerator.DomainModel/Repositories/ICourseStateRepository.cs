using easygenerator.DomainModel.Entities;
using System;

namespace easygenerator.DomainModel.Repositories
{
    public interface ICourseStateRepository : IRepository<CourseState>
    {
        CourseState GetByCourseId(Guid courseId);
    }
}
