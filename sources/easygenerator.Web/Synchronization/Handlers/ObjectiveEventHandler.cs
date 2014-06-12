using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.ObjectiveEvents;
using easygenerator.Web.Components.Mappers;
using easygenerator.Web.Extensions;
using easygenerator.Web.Synchronization.Broadcasting.CollaborationBroadcasting;
using System.Linq;

namespace easygenerator.Web.Synchronization.Handlers
{
    public class ObjectiveEventHandler :
        IDomainEventHandler<ObjectiveTitleUpdatedEvent>,
        IDomainEventHandler<QuestionsReorderedEvent>,
        IDomainEventHandler<QuestionsDeletedEvent>
    {
        private readonly ICollaborationBroadcaster<Objective> _broadcaster;

        public ObjectiveEventHandler(ICollaborationBroadcaster<Objective> broadcaster)
        {
            _broadcaster = broadcaster;
        }
        
        public void Handle(ObjectiveTitleUpdatedEvent args)
        {
            _broadcaster.OtherCollaborators(args.Objective).objectiveTitleUpdated(args.Objective.Id.ToNString(), args.Objective.Title, args.Objective.ModifiedOn);
        }

        public void Handle(QuestionsReorderedEvent args)
        {
            _broadcaster.OtherCollaborators(args.Objective)
                    .objectiveQuestionsReordered(args.Objective.Id.ToNString(), args.Objective.Questions.Select(e => e.Id.ToNString()), args.Objective.ModifiedOn);
        }

        public void Handle(QuestionsDeletedEvent args)
        {
            _broadcaster.OtherCollaborators(args.Objective)
                    .questionsDeleted(args.Objective.Id.ToNString(), args.Questions.Select(e => e.Id.ToNString()), args.Objective.ModifiedOn);
        }
    }
}