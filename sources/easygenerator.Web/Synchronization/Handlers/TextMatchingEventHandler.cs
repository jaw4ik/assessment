using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.QuestionEvents.DragAndDropEvents;
using easygenerator.DomainModel.Events.QuestionEvents.TextMatchingEvents;
using easygenerator.Web.Components.Mappers;
using easygenerator.Web.Extensions;
using easygenerator.Web.Synchronization.Broadcasting.CollaborationBroadcasting;

namespace easygenerator.Web.Synchronization.Handlers
{
    public class TextMatchingEventHandler:
        IDomainEventHandler<TextMatchingAnswerCreatedEvent>,
        IDomainEventHandler<TextMatchingAnswerDeletedEvent>,
        IDomainEventHandler<TextMatchingAnswerKeyChangedEvent>,
        IDomainEventHandler<TextMatchingAnswerValueChangedEvent>
    {
        private readonly ICollaborationBroadcaster<Question> _broadcaster;
        private readonly IEntityMapper _entityMapper;

        public TextMatchingEventHandler(ICollaborationBroadcaster<Question> broadcaster, IEntityMapper entityMapper)
        {
            _broadcaster = broadcaster;
            _entityMapper = entityMapper;
        }
        
        public void Handle(TextMatchingAnswerCreatedEvent args)
        {
            _broadcaster.OtherCollaborators(args.Answer.Question)
               .textMatchingAnswerCreated(args.Answer.Question.Id.ToNString(), _entityMapper.Map(args.Answer), args.Answer.Question.ModifiedOn);
        }
        
        public void Handle(TextMatchingAnswerDeletedEvent args)
        {
            _broadcaster.OtherCollaborators(args.Question)
                .textMatchingAnswerDeleted(args.Question.Id.ToNString(), args.Answer.Id.ToNString(), args.Question.ModifiedOn);
        }

        public void Handle(TextMatchingAnswerKeyChangedEvent args)
        {
            _broadcaster.OtherCollaborators(args.Answer.Question)
                .textMatchingAnswerKeyChanged(args.Answer.Question.Id.ToNString(), _entityMapper.Map(args.Answer), args.Answer.Question.ModifiedOn);
        }

        public void Handle(TextMatchingAnswerValueChangedEvent args)
        {
            _broadcaster.OtherCollaborators(args.Answer.Question)
                .textMatchingAnswerValueChanged(args.Answer.Question.Id.ToNString(), _entityMapper.Map(args.Answer), args.Answer.Question.ModifiedOn);
        }
    }
}