using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
using System;
using System.Linq;

namespace easygenerator.Web.Security.FeatureAvailability
{
    public class FeatureAvailabilityChecker : IFeatureAvailabilityChecker
    {
        private readonly IUserRepository _userRepository;

        public FeatureAvailabilityChecker(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public bool IsCourseCollaborationEnabled(Course course)
        {
            return course.Collaborators.Count() <= GetMaxAllowedCollaboratorsAmount(course);
        }

        public int GetMaxAllowedCollaboratorsAmount(Course course)
        {
            var owner = _userRepository.GetUserByEmail(course.CreatedBy);
            if (owner.HasPlusAccess())
                return Int32.MaxValue;

            if (owner.HasStarterAccess())
                return Constants.Collaboration.MaxCollaboratorsCountForStarterPlan;

            return 0;
        }

        public bool CanAddCollaborator(Course course)
        {
            return IsCourseCollaborationEnabled(course) &&
                   course.Collaborators.Count(e => e.IsAccepted) < GetMaxAllowedCollaboratorsAmount(course);
        }
    }
}