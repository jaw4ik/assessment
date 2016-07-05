using easygenerator.DomainModel.Entities;

namespace easygenerator.Web.Storage
{
    public interface ICourseStateStorage
    {
        bool IsDirty(Course course);
        bool IsDirtyForSale(Course course);
        void MarkAsDirty(Course course);
        void MarkAsClean(Course course);
        void MarkAsCleanForSale(Course course);
        void RemoveState(Course course);
    }
} 