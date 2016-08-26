using easygenerator.DomainModel.Entities;
using System;
using System.Collections.Generic;

namespace easygenerator.DomainModel.Repositories
{
    public interface ICourseRepository : IRepository<Course>
    {
        ICollection<Course> GetOwnedCourses(string email);
        ICollection<Course> GetAvailableCoursesCollection(string username);
        void RemoveCourseWithSections(Guid courseId);

        ICollection<Course> GetCoursesRelatedToSection(Guid sectionId);
        IEnumerable<Course> GetCoursesWithTheme(Guid themeId);
    }
}
