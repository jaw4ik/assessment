using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.CourseEvents;
using easygenerator.Web.Components.Mappers;
using easygenerator.Web.Extensions;
using easygenerator.Web.Synchronization.Broadcasting;
using System.Linq;

namespace easygenerator.Web.Synchronization.Handlers
{
    public class CourseEventHandler :
        IDomainEventHandler<CourseCollaboratorAddedEvent>,
        IDomainEventHandler<CourseTitleUpdatedEvent>,
        IDomainEventHandler<CourseIntroducationContentUpdated>,
        IDomainEventHandler<CourseTemplateUpdatedEvent>,
        IDomainEventHandler<CourseObjectivesReorderedEvent>,
        IDomainEventHandler<CoursePublishedEvent>,
        IDomainEventHandler<CourseDeletedEvent>
    {
        private readonly ICourseCollaborationBroadcaster _broadcaster;
        private readonly IEntityMapper _entityMapper;

        public CourseEventHandler(ICourseCollaborationBroadcaster broadcaster, IEntityMapper entityMapper)
        {
            _broadcaster = broadcaster;
            _entityMapper = entityMapper;
        }

        public void Handle(CourseCollaboratorAddedEvent args)
        {
            _broadcaster.User(args.Collaborator.Email)
                .courseCollaborationStarted(
                  _entityMapper.Map(args.Collaborator.Course),
                  args.Collaborator.Course.RelatedObjectives.Select(o => _entityMapper.Map(o)),
                  _entityMapper.Map(args.Collaborator));


            _broadcaster.AllCollaboratorsExcept(args.Collaborator.Course, args.Collaborator.Email, args.AddedBy)
                .courseCollaboratorAdded(
                    args.Collaborator.Course.Id.ToNString(),
                    _entityMapper.Map(args.Collaborator));
        }

        public void Handle(CourseTitleUpdatedEvent args)
        {
            _broadcaster.OtherCollaborators(args.Course)
                .courseTitleUpdated(args.Course.Id.ToNString(), args.Course.Title, args.Course.ModifiedOn);
        }

        public void Handle(CourseIntroducationContentUpdated args)
        {
            _broadcaster.OtherCollaborators(args.Course)
                .courseIntroducationContentUpdated(args.Course.Id.ToNString(), args.Course.IntroductionContent, args.Course.ModifiedOn);
        }

        public void Handle(CourseTemplateUpdatedEvent args)
        {
            _broadcaster.OtherCollaborators(args.Course)
                .courseTemplateUpdated(args.Course.Id.ToNString(), args.Course.Template.Id.ToNString(), args.Course.ModifiedOn);
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
            var users = args.Collaborators;
            users.Add(args.Course.CreatedBy);
            users.Remove(args.DeletedBy);

            _broadcaster.Users(users).courseDeleted(args.Course.Id.ToNString());
        }
    }
}