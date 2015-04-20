using easygenerator.DomainModel.Entities;

namespace easygenerator.Web.Storage
{
    public interface ICourseStateStorage
    {
        bool IsDirty(Course course);
        void MarkAsDirty(Course course);
        void MarkAsClean(Course course);
        void RemoveState(Course course);
    }
} 