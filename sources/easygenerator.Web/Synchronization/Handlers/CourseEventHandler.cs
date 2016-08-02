using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.CourseEvents;
using easygenerator.Web.Components.Mappers;
using easygenerator.Web.Extensions;
using easygenerator.Web.Synchronization.Broadcasting.CollaborationBroadcasting;
using System.Linq;
using easygenerator.Web.Domain.DomainEvents.ChangeTracking.Events;

namespace easygenerator.Web.Synchronization.Handlers
{
    public class CourseEventHandler :
        IDomainEventHandler<CourseTitleUpdatedEvent>,
        IDomainEventHandler<CourseIntroductionContentUpdated>,
        IDomainEventHandler<CourseTemplateUpdatedEvent>,
        IDomainEventHandler<CourseSectionsReorderedEvent>,
        IDomainEventHandler<CoursePublishedEvent>,
        IDomainEventHandler<CoursePublishedForSaleEvent>,
        IDomainEventHandler<CourseDeletedEvent>,
        IDomainEventHandler<CourseSectionRelatedEvent>,
        IDomainEventHandler<CourseSectionsUnrelatedEvent>,
        IDomainEventHandler<CourseSectionsClonedEvent>,
        IDomainEventHandler<CourseStateChangedEvent>,
        IDomainEventHandler<CourseProcessedByCoggnoEvent>
    {
        private readonly ICollaborationBroadcaster<Course> _broadcaster;
        private readonly IEntityMapper _entityMapper;

        public CourseEventHandler(ICollaborationBroadcaster<Course> broadcaster, IEntityMapper entityMapper)
        {
            _broadcaster = broadcaster;
            _entityMapper = entityMapper;
        }

        public void Handle(CourseTitleUpdatedEvent args)
        {
            _broadcaster.OtherCollaborators(args.Course)
                .courseTitleUpdated(args.Course.Id.ToNString(), args.Course.Title, args.Course.ModifiedOn);

            _broadcaster.UsersInvitedToCollaboration(args.Course).collaborationInviteCourseTitleUpdated(args.Course.Id.ToNString(), args.Course.Title);
        }

        public void Handle(CourseIntroductionContentUpdated args)
        {
            _broadcaster.OtherCollaborators(args.Course)
                .courseIntroductionContentUpdated(args.Course.Id.ToNString(), args.Course.IntroductionContent, args.Course.ModifiedOn);
        }

        public void Handle(CourseTemplateUpdatedEvent args)
        {
            _broadcaster.OtherCollaborators(args.Course)
                .courseTemplateUpdated(args.Course.Id.ToNString(), _entityMapper.Map(args.Course.Template), args.Course.ModifiedOn);
        }

        public void Handle(CourseSectionsReorderedEvent args)
        {
            _broadcaster.OtherCollaborators(args.Course)
                .courseSectionsReordered(args.Course.Id.ToNString(), args.Course.RelatedSections.Select(e => e.Id.ToNString()), args.Course.ModifiedOn);
        }

        public void Handle(CoursePublishedEvent args)
        {
            _broadcaster.OtherCollaborators(args.Course)
                .coursePublished(args.Course.Id.ToNString(), args.Course.PublicationUrl);
        }
        public void Handle(CoursePublishedForSaleEvent args)
        {
            _broadcaster.OtherCollaborators(args.Course)
                .coursePublishedForSale(args.Course.Id.ToNString());
        }

        public void Handle(CourseDeletedEvent args)
        {
            _broadcaster.AllCollaboratorsExcept(args.Course, args.DeletedBy).courseDeleted(args.Course.Id.ToNString(), args.DeletedSectionIds);
            _broadcaster.UsersInvitedToCollaboration(args.Course).collaborationInviteRemoved(args.Course.Id.ToNString());
        }

        public void Handle(CourseSectionRelatedEvent args)
        {
            _broadcaster.OtherCollaborators(args.Course)
               .courseSectionRelated(args.Course.Id.ToNString(), _entityMapper.Map(args.Section), args.Index.HasValue ? args.Index : null, args.Course.ModifiedOn);
        }

        public void Handle(CourseSectionsUnrelatedEvent args)
        {
            _broadcaster.OtherCollaborators(args.Course)
             .courseSectionsUnrelated(args.Course.Id.ToNString(), args.Sections.Select(e => e.Id.ToNString()), args.Course.ModifiedOn);
        }

        public void Handle(CourseSectionsClonedEvent args)
        {
            _broadcaster.AllCollaborators(args.Course).courseSectionsReplaced(args.Course.Id.ToNString(),
                args.ReplacedSections.ToDictionary(sectionsInfo => sectionsInfo.Key.ToNString(), sectionsInfo => _entityMapper.Map(sectionsInfo.Value)), args.Course.ModifiedOn);
        }

        public void Handle(CourseStateChangedEvent args)
        {
            _broadcaster.AllCollaborators(args.Course).courseStateChanged(args.Course.Id.ToNString(), new { isDirty = args.IsDirty, isDirtyForSale = args.IsDirtyForSale });
        }

        public void Handle(CourseProcessedByCoggnoEvent args)
        {
            _broadcaster.AllCollaborators(args.Course)
                .courseProcessedByCoggno(args.Course.Id.ToNString(), args.Course.SaleInfo.DocumentId, args.Success);
        }
    }
}