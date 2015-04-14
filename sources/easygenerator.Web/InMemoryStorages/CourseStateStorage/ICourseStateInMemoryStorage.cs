using easygenerator.DomainModel.Entities;

namespace easygenerator.Web.InMemoryStorages.CourseStateStorage
{
    public interface ICourseStateInMemoryStorage
    {
        bool TryGetHasUnpublishedChanges(Course course, out bool value);
        void SaveHasUnpublishedChanges(Course course, bool hasUnpublishedChanges);
        void RemoveCourseState(Course course);
    }
}