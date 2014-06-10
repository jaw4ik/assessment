using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.ObjectiveEvents;
using easygenerator.Web.Extensions;
using easygenerator.Web.Synchronization.Broadcasting;

namespace easygenerator.Web.Synchronization.Handlers
{
    public class ObjectiveEventHandler :
        IDomainEventHandler<ObjectiveTitleUpdatedEvent>
    {
        private readonly IObjectiveCollaborationBroadcaster _broadcaster;

        public ObjectiveEventHandler(IObjectiveCollaborationBroadcaster broadcaster)
        {
            _broadcaster = broadcaster;
        }
        
        public void Handle(ObjectiveTitleUpdatedEvent args)
        {
            _broadcaster.OtherCollaborators(args.Objective).objectiveTitleUpdated(args.Objective.Id.ToNString(), args.Objective.Title, args.Objective.ModifiedOn);
        }
    }
}