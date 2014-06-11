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
        IDomainEventHandler<ObjectiveTitleUpdatedEvent>,
        IDomainEventHandler<ObjectiveQuestionsReorderedEvent>
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

        public void Handle(ObjectiveQuestionsReorderedEvent args)
        {
            _broadcaster.OtherCollaborators(args.Objective)
                    .objectiveQuestionsReordered(args.Objective.Id.ToNString(), args.Objective.Questions.Select(e => e.Id.ToNString()), args.Objective.ModifiedOn);
        }
    }
}