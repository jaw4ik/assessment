using easygenerator.DomainModel.Entities;

namespace easygenerator.Web.Security.FeatureAvailability
{
    public interface IFeatureAvailabilityChecker
    {
        bool IsCourseCollaborationEnabled(Course course);
        bool CanAddCollaborator(Course course);
        int GetMaxAllowedCollaboratorsAmount(Course course);
    }
}
