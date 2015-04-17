using easygenerator.DomainModel.Entities;

namespace easygenerator.Web.Storage
{
    public interface ICourseStateStorage
    {
        bool HasUnpublishedChanges(Course course);
        void SaveHasUnpublishedChanges(Course course, bool hasUnpublishedChanges);
        void RemoveCourseState(Course course);
    }
} 