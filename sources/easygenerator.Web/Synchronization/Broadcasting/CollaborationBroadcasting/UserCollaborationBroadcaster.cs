using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.Web.Synchronization.Broadcasting.CollaborationBroadcasting.CollaboratorProviders;
using System.Collections.Generic;
using System.Linq;
using WebGrease.Css.Extensions;

namespace easygenerator.Web.Synchronization.Broadcasting.CollaborationBroadcasting
{
    public class UserCollaborationBroadcaster : Broadcaster, IUserCollaborationBroadcaster
    {
        private readonly ICourseCollaboratorRepository _collaborationRepository;
        private readonly ICourseRepository _courseRepository;
        private readonly IEntityCollaboratorProvider<Course> _courseCollaboratorProvider;

        public UserCollaborationBroadcaster(ICourseCollaboratorRepository collaborationRepository, ICourseRepository courseRepository,
            IEntityCollaboratorProvider<Course> courseCollaboratorProvider)
        {
            _collaborationRepository = collaborationRepository;
            _courseRepository = courseRepository;
            _courseCollaboratorProvider = courseCollaboratorProvider;
        }

        public dynamic OtherCollaborators(string userEmail)
        {
            var collaborators = GetCollaborators(_collaborationRepository.GetSharedCourses(userEmail));

            return UsersExcept(collaborators, userEmail);
        }

        public dynamic OtherCollaboratorsOnOwnedCourses(string userEmail)
        {
            var collaborators = GetCollaborators(_courseRepository.GetOwnedCourses(userEmail));

            return UsersExcept(collaborators, userEmail);
        }

        private IEnumerable<string> GetCollaborators(IEnumerable<Course> courses)
        {
            var collaborators = new List<string>();

            courses.ForEach(c => collaborators.AddRange(_courseCollaboratorProvider.GetCollaborators(c)));

            return collaborators.Distinct();
        }

    }
}