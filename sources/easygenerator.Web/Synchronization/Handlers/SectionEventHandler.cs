using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.SectionEvents;
using easygenerator.DomainModel.Events.QuestionEvents;
using easygenerator.Web.Extensions;
using easygenerator.Web.Synchronization.Broadcasting.CollaborationBroadcasting;
using easygenerator.Web.Domain.DomainEvents.ChangeTracking.Events;
using System.Linq;
using System;

namespace easygenerator.Web.Synchronization.Handlers
{
    public class SectionEventHandler :
        IDomainEventHandler<SectionTitleUpdatedEvent>,
        IDomainEventHandler<SectionImageUrlUpdatedEvent>,
        IDomainEventHandler<SectionLearningObjectiveUpdatedEvent>,
        IDomainEventHandler<QuestionsReorderedEvent>,
        IDomainEventHandler<QuestionsDeletedEvent>,
        IDomainEventHandler<SectionChangedEvent>
    {
        private readonly ICollaborationBroadcaster<Section> _broadcaster;

        public SectionEventHandler(ICollaborationBroadcaster<Section> broadcaster)
        {
            _broadcaster = broadcaster;
        }
        
        public void Handle(SectionTitleUpdatedEvent args)
        {
            _broadcaster.OtherCollaborators(args.Section).sectionTitleUpdated(args.Section.Id.ToNString(), args.Section.Title, args.Section.ModifiedOn);
        }

        public void Handle(SectionImageUrlUpdatedEvent args)
        {
            _broadcaster.OtherCollaborators(args.Section).sectionImageUrlUpdated(args.Section.Id.ToNString(), args.Section.ImageUrl, args.Section.ModifiedOn);
        }

        public void Handle(SectionLearningObjectiveUpdatedEvent args)
        {
            _broadcaster.OtherCollaborators(args.Section).sectionLearningObjectiveUpdated(args.Section.Id.ToNString(), args.Section.LearningObjective, args.Section.ModifiedOn);
        }

        public void Handle(QuestionsReorderedEvent args)
        {
            _broadcaster.OtherCollaborators(args.Section)
                    .sectionQuestionsReordered(args.Section.Id.ToNString(), args.Section.Questions.Select(e => e.Id.ToNString()), args.Section.ModifiedOn);
        }

        public void Handle(QuestionsDeletedEvent args)
        {
            _broadcaster.OtherCollaborators(args.Section)
                    .questionsDeleted(args.Section.Id.ToNString(), args.Questions.Select(e => e.Id.ToNString()), args.Section.ModifiedOn);
        }

        public void Handle(SectionChangedEvent args)
        {
            _broadcaster.AllCollaborators(args.Section)
                    .sectionModified(args.Section.Id.ToNString(), args.Section.ModifiedOn);
        }
    }
}