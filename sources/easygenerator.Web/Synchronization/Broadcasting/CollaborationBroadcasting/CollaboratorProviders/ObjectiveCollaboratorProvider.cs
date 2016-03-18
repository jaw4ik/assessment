using easygenerator.DomainModel.Entities;
using System.Collections.Generic;
using System.Linq;

namespace easygenerator.Web.Synchronization.Broadcasting.CollaborationBroadcasting.CollaboratorProviders
{
    public class SectionCollaboratorProvider : IEntityCollaboratorProvider<Section>
    {
        private readonly IEntityCollaboratorProvider<Course> _courseCollaboratorProvider;

        public SectionCollaboratorProvider(IEntityCollaboratorProvider<Course> courseCollaboratorProvider)
        {
            _courseCollaboratorProvider = courseCollaboratorProvider;
        }

        public IEnumerable<string> GetCollaborators(Section section)
        {
            return section.Courses.SelectMany(c => _courseCollaboratorProvider.GetCollaborators(c)).Distinct();
        }

        public IEnumerable<string> GetUsersInvitedToCollaboration(Section section)
        {
            return section.Courses.SelectMany(c => _courseCollaboratorProvider.GetUsersInvitedToCollaboration(c)).Distinct();
        }
    }
}