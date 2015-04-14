using easygenerator.DomainModel.Entities;

namespace easygenerator.Web.DomainEvents.ChangeTracking
{
    public interface ICourseStateStorage
    {
        bool HasUnpublishedChanges(Course course);
        void SaveHasUnpublishedChanges(Course course, bool hasUnpublishedChanges);
        void RemoveCourseState(Course course);
    }
} 