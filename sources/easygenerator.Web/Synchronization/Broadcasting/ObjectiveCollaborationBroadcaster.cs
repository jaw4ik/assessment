using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;
using Microsoft.AspNet.SignalR;

namespace easygenerator.Web.Synchronization.Broadcasting
{
    public class ObjectiveCollaborationBroadcaster : Broadcaster, IObjectiveCollaborationBroadcaster
    {
        public ObjectiveCollaborationBroadcaster(IHubContext hubContext)
            : base(hubContext)
        {
            
        }

        public ObjectiveCollaborationBroadcaster()
        {

        }
        public dynamic AllCollaborators(Objective objective)
        {
            ThrowIfObjectiveNotValid(objective);
            return Users(GetObjectiveCollaborators(objective));
        }

        public dynamic AllCollaboratorsExcept(Objective objective, params string[] excludeUsers)
        {
            ThrowIfObjectiveNotValid(objective);
            return Users(GetCollaboratorsExcept(objective, new List<string>(excludeUsers)));
        }

        public dynamic AllCollaboratorsExcept(Objective objective, List<string> excludeUsers)
        {
            ThrowIfObjectiveNotValid(objective);
            return Users(GetCollaboratorsExcept(objective, excludeUsers));
        }

        public dynamic OtherCollaborators(Objective objective)
        {
            ThrowIfObjectiveNotValid(objective);

            return Users(GetCollaboratorsExcept(objective, new List<string>() { CurrentUsername }));
        }

        private List<string> GetCollaboratorsExcept(Objective objective, List<string> excludeUsers)
        {
            var users = GetObjectiveCollaborators(objective);
            users.RemoveAll(u => excludeUsers.Exists(e => u == e));

            return users;
        }

        private List<string> GetObjectiveCollaborators(Objective objective)
        {
            var collaborators = new List<string>();
            
            foreach (var course in objective.Courses)
            {
                collaborators.AddRange(course.Collaborators.Select(c => c.Email).ToList());
                collaborators.Add(course.CreatedBy);
            }

            return collaborators.Distinct().ToList();
        }

        private void ThrowIfObjectiveNotValid(Objective objective)
        {
            ArgumentValidation.ThrowIfNull(objective, "objective");
        }
    }
}