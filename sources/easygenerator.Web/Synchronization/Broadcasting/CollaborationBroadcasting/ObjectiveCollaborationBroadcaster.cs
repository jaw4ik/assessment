using System.Collections.Generic;
using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;
using Microsoft.AspNet.SignalR;
using System.Linq;

namespace easygenerator.Web.Synchronization.Broadcasting.CollaborationBroadcasting
{
    public class ObjectiveCollaborationBroadcaster : Broadcaster, ICollaborationBroadcaster<Objective>
    {
        private readonly ICollaborationBroadcaster<Course> _courseBroadcaster;

        public ObjectiveCollaborationBroadcaster(IHubContext hubContext, ICollaborationBroadcaster<Course> courseBroadcaster)
            : base(hubContext)
        {
            _courseBroadcaster = courseBroadcaster;
        }

        public ObjectiveCollaborationBroadcaster(ICollaborationBroadcaster<Course> courseBroadcaster)
        {
            _courseBroadcaster = courseBroadcaster;
        }

        public dynamic AllCollaborators(Objective objective)
        {
            ThrowIfObjectiveNotValid(objective);

            return Users(GetCollaborators(objective));
        }

        public dynamic AllCollaboratorsExcept(Objective objective, params string[] excludeUsers)
        {
            ThrowIfObjectiveNotValid(objective);

            return Users(GetCollaboratorsExcept(objective, new List<string>(excludeUsers)));
        }

        public dynamic OtherCollaborators(Objective objective)
        {
            ThrowIfObjectiveNotValid(objective);

            return Users(GetCollaboratorsExcept(objective, new List<string>() { CurrentUsername }));
        }

        private void ThrowIfObjectiveNotValid(Objective objective)
        {
            ArgumentValidation.ThrowIfNull(objective, "objective");
        }


        public IEnumerable<string> GetCollaborators(Objective objective)
        {
            return objective.Courses.SelectMany(c => _courseBroadcaster.GetCollaborators(c)).Distinct();
        }

        public IEnumerable<string> GetCollaboratorsExcept(Objective objective, List<string> excludeUsers)
        {
            return objective.Courses.SelectMany(c => _courseBroadcaster.GetCollaboratorsExcept(c, excludeUsers)).Distinct();
        }
    }
}