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

            return MultipleClients(objective.Courses.Select(c => _courseBroadcaster.AllCollaborators(c)));
        }

        public dynamic AllCollaboratorsExcept(Objective objective, params string[] excludeUsers)
        {
            ThrowIfObjectiveNotValid(objective);

            return MultipleClients(objective.Courses.Select(c => _courseBroadcaster.AllCollaboratorsExcept(c, excludeUsers)));
        }

        public dynamic OtherCollaborators(Objective objective)
        {
            ThrowIfObjectiveNotValid(objective);

            return MultipleClients(objective.Courses.Select(c => _courseBroadcaster.OtherCollaborators(c)));
        }

        private void ThrowIfObjectiveNotValid(Objective objective)
        {
            ArgumentValidation.ThrowIfNull(objective, "objective");
        }
    }
}