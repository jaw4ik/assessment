using easygenerator.DomainModel.Entities;
using System.Collections.Generic;
using System.Linq;

namespace easygenerator.Web.Synchronization.Broadcasting.CollaborationBroadcasting.CollaboratorProviders
{
    public class ObjectiveCollaboratorProvider : IEntityCollaboratorProvider<Objective>
    {
        private readonly IEntityCollaboratorProvider<Course> _courseCollaboratorProvider;

        public ObjectiveCollaboratorProvider(IEntityCollaboratorProvider<Course> courseCollaboratorProvider)
        {
            _courseCollaboratorProvider = courseCollaboratorProvider;
        }

        public IEnumerable<string> GetCollaborators(Objective objective)
        {
            return objective.Courses.SelectMany(c => _courseCollaboratorProvider.GetCollaborators(c)).Distinct();
        }
    }
}