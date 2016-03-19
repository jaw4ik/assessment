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
        ICollection<Course> GetCoursesRelatedToQuestion(Guid questionId);
        IEnumerable<Course> GetCoursesRelatedToLearningContent(Guid contentId);
        IEnumerable<Course> GetCoursesRelatedToAnswer(Guid answerId);
        IEnumerable<Course> GetCoursesRelatedToDropspot(Guid dropspotId);
        IEnumerable<Course> GetCoursesRelatedToHotSpotPolygon(Guid hotspotPolygonId);
        IEnumerable<Course> GetCoursesRelatedToTextMatchingAnswer(Guid answerId);
        IEnumerable<Course> GetCoursesRelatedToSingleSelectImageAnswer(Guid answerId);
        IEnumerable<Course> GetCoursesRelatedToRankingTextAnswer(Guid answerId);
    }
}
