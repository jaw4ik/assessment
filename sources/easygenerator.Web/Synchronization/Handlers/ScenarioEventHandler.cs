using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.QuestionEvents.ScenarioEvents;
using easygenerator.Web.Extensions;
using easygenerator.Web.Synchronization.Broadcasting.CollaborationBroadcasting;

namespace easygenerator.Web.Synchronization.Handlers
{
    public class ScenarioEventHandler :
        IDomainEventHandler<ScenarioDataUpdatedEvent>,
        IDomainEventHandler<ScenarioMasteryScoreUpdatedEvent>
    {
        private readonly ICollaborationBroadcaster<Question> _broadcaster;

        public ScenarioEventHandler(ICollaborationBroadcaster<Question> broadcaster)
        {
            _broadcaster = broadcaster;
        }

        public void Handle(ScenarioDataUpdatedEvent args)
        {
            _broadcaster.OtherCollaborators(args.Question)
                .scenarioDataUpdated(args.Question.Id.ToNString(), args.ProjectId, args.EmbedUrl, args.Question.ModifiedOn);
        }

        public void Handle(ScenarioMasteryScoreUpdatedEvent args)
        {
            _broadcaster.OtherCollaborators(args.Question)
                .scenarioMasteryScoreUpdated(args.Question.Id.ToNString(), args.MasteryScore, args.Question.ModifiedOn);
        }
    }
}