
namespace easygenerator.Web.DomainEvents.ChangeTracking
{
    public class CourseStateInfo
    {
        public bool HasUnpublishedChanges { get; set; }

        public CourseStateInfo(bool hasUnpublishedChanges = false)
        {
            HasUnpublishedChanges = hasUnpublishedChanges;
        }
    }
}