using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.QuestionEvents.RankingTextEvents;
using easygenerator.Web.Components.Mappers;
using easygenerator.Web.Extensions;
using easygenerator.Web.Synchronization.Broadcasting.CollaborationBroadcasting;

namespace easygenerator.Web.Synchronization.Handlers
{
    public class RankingTextEventHandler :
        IDomainEventHandler<RankingTextAnswerCreatedEvent>,
        IDomainEventHandler<RankingTextAnswerDeletedEvent>,
        IDomainEventHandler<RankingTextAnswerTextChangedEvent>,
        IDomainEventHandler<RankingTextAnswersReorderedEvent>
    {

        private readonly ICollaborationBroadcaster<Question> _broadcaster;
        private readonly IEntityMapper _entityMapper;

        public RankingTextEventHandler(ICollaborationBroadcaster<Question> broadcaster, IEntityMapper entityMapper)
        {
            _broadcaster = broadcaster;
            _entityMapper = entityMapper;
        }
        public void Handle(RankingTextAnswerCreatedEvent args)
        {
            _broadcaster.OtherCollaborators(args.Answer.Question)
              .rankingTextAnswerCreated(args.Answer.Question.Id.ToNString(), _entityMapper.Map(args.Answer), args.Answer.Question.ModifiedOn);
        }

        public void Handle(RankingTextAnswerDeletedEvent args)
        {
            _broadcaster.OtherCollaborators(args.Question)
                 .rankingTextAnswerDeleted(args.Question.Id.ToNString(), args.Answer.Id.ToNString(), args.Question.ModifiedOn);
        }

        public void Handle(RankingTextAnswerTextChangedEvent args)
        {
            _broadcaster.OtherCollaborators(args.Answer.Question)
                .rankingtextAnswerTextChanged(args.Answer.Question.Id.ToNString(), _entityMapper.Map(args.Answer), args.Answer.Question.ModifiedOn);
        }

        public void Handle(RankingTextAnswersReorderedEvent args)
        {
            _broadcaster.OtherCollaborators(args.Question)
                    .rankingTextAnswersReordered(args.Question.Id.ToNString(), args.Answers.Select(e => e.Id.ToNString()), args.Question.ModifiedOn);
        }
    }
}