using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.CourseEvents;
using easygenerator.Web.Components.Mappers;
using easygenerator.Web.DomainEvents.ChangeTracking.Events;
using easygenerator.Web.Extensions;
using easygenerator.Web.Synchronization.Broadcasting.CollaborationBroadcasting;
using System.Linq;

namespace easygenerator.Web.Synchronization.Handlers
{
    public class CourseEventHandler :
        IDomainEventHandler<CourseTitleUpdatedEvent>,
        IDomainEventHandler<CourseIntroductionContentUpdated>,
        IDomainEventHandler<CourseTemplateUpdatedEvent>,
        IDomainEventHandler<CourseObjectivesReorderedEvent>,
        IDomainEventHandler<CoursePublishedEvent>,
        IDomainEventHandler<CourseDeletedEvent>,
        IDomainEventHandler<CourseObjectiveRelatedEvent>,
        IDomainEventHandler<CourseObjectivesUnrelatedEvent>,
        IDomainEventHandler<CourseObjectivesClonedEvent>,
        IDomainEventHandler<CourseStateChangedEvent>
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

        public void Handle(CourseObjectivesReorderedEvent args)
        {
            _broadcaster.OtherCollaborators(args.Course)
                .courseObjectivesReordered(args.Course.Id.ToNString(), args.Course.RelatedObjectives.Select(e => e.Id.ToNString()), args.Course.ModifiedOn);
        }

        public void Handle(CoursePublishedEvent args)
        {
            _broadcaster.OtherCollaborators(args.Course)
                .coursePublished(args.Course.Id.ToNString(), args.Course.PublicationUrl);
        }

        public void Handle(CourseDeletedEvent args)
        {
            var users = args.Collaborators.ToList();
            users.Add(args.Course.CreatedBy);
            users.Remove(args.DeletedBy);

            _broadcaster.Users(users).courseDeleted(args.Course.Id.ToNString(), args.DeletedObjectiveIds);
            foreach (var invitedCollaborator in args.InvitedCollaborators)
            {
                _broadcaster.User(invitedCollaborator.Value).collaborationInviteRemoved(invitedCollaborator.Key.ToNString());
            }
        }

        public void Handle(CourseObjectiveRelatedEvent args)
        {
            _broadcaster.OtherCollaborators(args.Course)
               .courseObjectiveRelated(args.Course.Id.ToNString(), _entityMapper.Map(args.Objective), args.Index.HasValue ? args.Index : null, args.Course.ModifiedOn);
        }

        public void Handle(CourseObjectivesUnrelatedEvent args)
        {
            _broadcaster.OtherCollaborators(args.Course)
             .courseObjectivesUnrelated(args.Course.Id.ToNString(), args.Objectives.Select(e => e.Id.ToNString()), args.Course.ModifiedOn);
        }

        public void Handle(CourseObjectivesClonedEvent args)
        {
            _broadcaster.AllCollaborators(args.Course).courseObjectivesReplaced(args.Course.Id.ToNString(),
                args.ReplacedObjectives.ToDictionary(objectivesInfo => objectivesInfo.Key.ToNString(), objectivesInfo => _entityMapper.Map(objectivesInfo.Value)), args.Course.ModifiedOn);
        }

        public void Handle(CourseStateChangedEvent args)
        {
            _broadcaster.AllCollaborators(args.Course).courseStateChanged(args.Course.Id.ToNString(), new { isDirty = args.IsDirty });
        }
    }
}