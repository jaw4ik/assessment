using easygenerator.DomainModel.Entities;
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
        IDomainEventHandler<CourseIntroducationContentUpdated>
    {
        private readonly ICollaborationBroadcaster<Course> _broadcaster;
        private readonly IEntityMapper<Course> _courseMapper;
        private readonly IEntityMapper<Objective> _objectiveMapper;
        private readonly IEntityMapper<CourseCollaborator> _collaboratorMapper;

        public CourseEventHandler(ICollaborationBroadcaster<Course> broadcaster, IEntityMapper<Course> courseMapper, IEntityMapper<CourseCollaborator> collaboratorMapper, IEntityMapper<Objective> objectiveMapper)
        {
            _broadcaster = broadcaster;
            _courseMapper = courseMapper;
            _collaboratorMapper = collaboratorMapper;
            _objectiveMapper = objectiveMapper;
        }

        public void Handle(CourseCollaboratorAddedEvent args)
        {
            _broadcaster.User(args.Collaborator.Email)
                .courseCollaborationStarted(
                  _courseMapper.Map(args.Collaborator.Course),
                  args.Collaborator.Course.RelatedObjectives.Select(o => _objectiveMapper.Map(o)),
                  _collaboratorMapper.Map(args.Collaborator));


            _broadcaster.AllCollaboratorsExcept(args.Collaborator.Course, args.Collaborator.Email, args.AddedBy)
                .courseCollaboratorAdded(
                    args.Collaborator.Course.Id.ToNString(),
                    _collaboratorMapper.Map(args.Collaborator));
        }

        public void Handle(CourseTitleUpdatedEvent args)
        {
            _broadcaster.OtherCollaborators(args.Course).courseTitleUpdated(args.Course.Id.ToNString(), args.Course.Title, args.Course.ModifiedOn);
        }

        public void Handle(CourseIntroducationContentUpdated args)
        {
            _broadcaster.OtherCollaborators(args.Course).courseIntroducationContentUpdated(args.Course.Id.ToNString(), args.Course.IntroductionContent, args.Course.ModifiedOn);
        }
    }
}