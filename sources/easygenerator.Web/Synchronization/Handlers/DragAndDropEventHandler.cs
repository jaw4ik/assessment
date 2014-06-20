using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.QuestionEvents;
using easygenerator.DomainModel.Events.QuestionEvents.DragAnsDropEvents;
using easygenerator.Web.Components.Mappers;
using easygenerator.Web.Extensions;
using easygenerator.Web.Synchronization.Broadcasting.CollaborationBroadcasting;

namespace easygenerator.Web.Synchronization.Handlers
{
    public class DragAndDropEventHandler :
        IDomainEventHandler<BackgroundChangedEvent>
    {
        private readonly ICollaborationBroadcaster<Question> _broadcaster;

        public DragAndDropEventHandler(ICollaborationBroadcaster<Question> broadcaster)
        {
            _broadcaster = broadcaster;
        }

        public void Handle(BackgroundChangedEvent args)
        {
            _broadcaster.OtherCollaborators(args.Question)
                .dragAndDropBackgroundChanged(args.Question.Id.ToNString(), args.Background, args.Question.ModifiedOn);
        }
    }
}