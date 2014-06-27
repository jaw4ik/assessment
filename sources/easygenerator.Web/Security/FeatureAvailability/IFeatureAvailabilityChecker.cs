using easygenerator.DomainModel.Entities;

namespace easygenerator.Web.Security.FeatureAvailability
{
    public interface IFeatureAvailabilityChecker
    {
        bool IsCourseCollaborationEnabled(Course course);
        int GetCourseMaxAllowedCollaboratorsAmount(Course course);
    }
}
