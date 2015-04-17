using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.QuestionEvents;
using easygenerator.Web.Components.Mappers;
using easygenerator.Web.Extensions;
using easygenerator.Web.Synchronization.Broadcasting.CollaborationBroadcasting;
using System.Linq;

namespace easygenerator.Web.Synchronization.Handlers
{
    public class QuestionEventHandler :
        IDomainEventHandler<QuestionCreatedEvent>,
        IDomainEventHandler<QuestionTitleUpdatedEvent>,
        IDomainEventHandler<QuestionBackgroundChangedEvent>,
        IDomainEventHandler<QuestionContentUpdatedEvent>,
        IDomainEventHandler<QuestionCorrectFeedbackUpdatedEvent>,
        IDomainEventHandler<QuestionIncorrectFeedbackUpdatedEvent>,
        IDomainEventHandler<QuestionGeneralFeedbackUpdatedEvent>,
        IDomainEventHandler<LearningContentsReorderedEvent>,
        IDomainEventHandler<FillInTheBlankUpdatedEvent>
    {
        private readonly ICollaborationBroadcaster<Question> _broadcaster;
        private readonly IEntityMapper _entityMapper;

        public QuestionEventHandler(ICollaborationBroadcaster<Question> broadcaster, IEntityMapper entityMapper)
        {
            _broadcaster = broadcaster;
            _entityMapper = entityMapper;
        }

        public void Handle(QuestionCreatedEvent args)
        {
            _broadcaster.OtherCollaborators(args.Question)
                .questionCreated(args.Question.Objective.Id.ToNString(), _entityMapper.Map(args.Question), args.Question.Objective.ModifiedOn);
        }

        public void Handle(QuestionContentUpdatedEvent args)
        {
            _broadcaster.OtherCollaborators(args.Question)
                .questionContentUpdated(args.Question.Id.ToNString(), args.Question.Content, args.Question.ModifiedOn);
        }

        public void Handle(QuestionTitleUpdatedEvent args)
        {
            _broadcaster.OtherCollaborators(args.Question)
                .questionTitleUpdated(args.Question.Id.ToNString(), args.Question.Title, args.Question.ModifiedOn);
        }

        public void Handle(QuestionBackgroundChangedEvent args)
        {
            _broadcaster.OtherCollaborators(args.Question)
                .questionBackgroundChanged(args.Question.Id.ToNString(), args.Background, args.Question.ModifiedOn);
        }

        public void Handle(QuestionCorrectFeedbackUpdatedEvent args)
        {
            _broadcaster.OtherCollaborators(args.Question)
                .questionCorrectFeedbackUpdated(args.Question.Id.ToNString(), args.Question.Feedback.CorrectText, args.Question.ModifiedOn);
        }

        public void Handle(QuestionIncorrectFeedbackUpdatedEvent args)
        {
            _broadcaster.OtherCollaborators(args.Question)
                .questionIncorrectFeedbackUpdated(args.Question.Id.ToNString(), args.Question.Feedback.IncorrectText, args.Question.ModifiedOn);
        }

        public void Handle(QuestionGeneralFeedbackUpdatedEvent args)
        {
            _broadcaster.OtherCollaborators(args.Question)
                .questionGeneralFeedbackUpdated(args.Question.Id.ToNString(), args.Question.Feedback.GeneralText, args.Question.ModifiedOn);
        }

        public void Handle(LearningContentsReorderedEvent args)
        {
            _broadcaster.OtherCollaborators(args.Question)
                .learningContentsReordered(args.Question.Id.ToNString(), args.Question.LearningContents.Select(e => e.Id.ToNString()), args.Question.ModifiedOn);
        }

        public void Handle(FillInTheBlankUpdatedEvent args)
        {
            _broadcaster.OtherCollaborators(args.Question)
                .fillInTheBlankUpdated(args.Question.Id.ToNString(), args.Question.Content, args.Answers.Select(e => _entityMapper.Map(e)), args.Question.ModifiedOn);
        }
    }
}