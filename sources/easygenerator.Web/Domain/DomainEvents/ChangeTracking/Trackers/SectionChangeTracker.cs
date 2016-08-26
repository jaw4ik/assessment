using System.Collections.Generic;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.SectionEvents;
using easygenerator.Web.Domain.DomainEvents.ChangeTracking.Events;
using easygenerator.DomainModel.Events.QuestionEvents.RankingTextEvents;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
using System;

namespace easygenerator.Web.Domain.DomainEvents.ChangeTracking.Trackers
{
    public class SectionChangeTracker :
        IDomainEventHandler<SectionImageUrlUpdatedEvent>,
        IDomainEventHandler<SectionTitleUpdatedEvent>,
        IDomainEventHandler<SectionLearningObjectiveUpdatedEvent>,
        IDomainEventHandler<QuestionsReorderedEvent>,
        IDomainEventHandler<QuestionsDeletedEvent>,

        IDomainEventHandler<QuestionChangedEvent>,
        IDomainEventHandler<AnswerChangedEvent>,
        IDomainEventHandler<TextMatchingAnswerChangedEvent>,
        IDomainEventHandler<SingleSelectImageAnswerChangedEvent>,
        IDomainEventHandler<RankingTextAnswerCreatedEvent>,
        IDomainEventHandler<DropspotChangedEvent>,
        IDomainEventHandler<HotSpotPolygonChangedEvent>,
        IDomainEventHandler<RankingTextAnswerTextChangedEvent>,
        IDomainEventHandler<LearningContentChangedEvent>
    {
        private readonly IDomainEventPublisher _eventPublisher;
        private readonly ISectionRepository _repository;
        private readonly IUnitOfWork _unitOfWork;

        public SectionChangeTracker(IDomainEventPublisher eventPublisher, ISectionRepository repository, IUnitOfWork unitOfWork)
        {
            _eventPublisher = eventPublisher;
            _repository = repository;
            _unitOfWork = unitOfWork;
        }

        #region Handlers

        public void Handle(SectionImageUrlUpdatedEvent args)
        {
            RaiseSectionChangedEvent(args.Section);
        }

        public void Handle(SectionTitleUpdatedEvent args)
        {
            RaiseSectionChangedEvent(args.Section);
        }

        public void Handle(SectionLearningObjectiveUpdatedEvent args)
        {
            RaiseSectionChangedEvent(args.Section);
        }

        public void Handle(QuestionsReorderedEvent args)
        {
            RaiseSectionChangedEvent(args.Section);
        }

        public void Handle(QuestionsDeletedEvent args)
        {
            RaiseSectionChangedEvent(args.Section);
        }

        public void Handle(QuestionChangedEvent args)
        {
            OnSectionChanged(_repository.GetSectionRelatedToQuestion(args.Question.Id), args.Question);
        }

        public void Handle(AnswerChangedEvent args)
        {
            OnSectionChanged(_repository.GetSectionRelatedToAnswer(args.Answer.Id), args.Answer);
        }

        public void Handle(RankingTextAnswerCreatedEvent args)
        {
            OnSectionChanged(_repository.GetSectionRelatedToRankingTextAnswer(args.Answer.Id), args.Answer);
        }

        public void Handle(RankingTextAnswerTextChangedEvent args)
        {
            OnSectionChanged(_repository.GetSectionRelatedToRankingTextAnswer(args.Answer.Id), args.Answer);
        }

        public void Handle(SingleSelectImageAnswerChangedEvent args)
        {
            OnSectionChanged(_repository.GetSectionRelatedToSingleSelectImageAnswer(args.Answer.Id), args.Answer);
        }

        public void Handle(TextMatchingAnswerChangedEvent args)
        {
            OnSectionChanged(_repository.GetSectionRelatedToTextMatchingAnswer(args.Answer.Id), args.Answer);
        }

        public void Handle(DropspotChangedEvent args)
        {
            OnSectionChanged(_repository.GetSectionRelatedToDropspot(args.Dropspot.Id), args.Dropspot);
        }

        public void Handle(HotSpotPolygonChangedEvent args)
        {
            OnSectionChanged(_repository.GetSectionRelatedToHotSpotPolygon(args.HotSpotPolygon.Id), args.HotSpotPolygon);
        }

        public void Handle(LearningContentChangedEvent args)
        {
            OnSectionChanged(_repository.GetSectionRelatedToLearningContent(args.LearningContent.Id), args.LearningContent);
        }

        #endregion

        private void OnSectionChanged(Section section, Entity entity)
        {
            section.MarkAsModified(entity.ModifiedBy, entity.ModifiedOn);

            _unitOfWork.Save();

            RaiseSectionChangedEvent(section);
        }

        private void RaiseSectionChangedEvent(Section section)
        {
            _eventPublisher.Publish(new SectionChangedEvent(section));
        }
    }
}