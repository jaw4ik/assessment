﻿using System.Linq;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.CourseEvents;
using easygenerator.Web.Components.Mappers;
using easygenerator.Web.Extensions;
using easygenerator.Web.Synchronization.Hubs;
using Microsoft.AspNet.SignalR;

namespace easygenerator.Web.Synchronization.Handlers
{
    public class CourseEventHandler : IDomainEventHandler<CourseCollaboratorAddedEvent>
    {
        private readonly IHubContext _hubContext;
        private readonly IEntityMapper<Course> _courseMapper;
        private readonly IEntityMapper<Objective> _objectiveMapper;
        private readonly IEntityMapper<CourseCollabrator> _collaboratorMapper;

        public CourseEventHandler(IHubContext hubContext, IEntityMapper<Course> courseMapper, IEntityMapper<CourseCollabrator> collaboratorMapper, IEntityMapper<Objective> objectiveMapper)
        {
            _hubContext = hubContext;
            _courseMapper = courseMapper;
            _collaboratorMapper = collaboratorMapper;
            _objectiveMapper = objectiveMapper;
        }

        public CourseEventHandler(IEntityMapper<Course> courseMapper, IEntityMapper<CourseCollabrator> collaboratorMapper, IEntityMapper<Objective> objectiveMapper)
            : this(GlobalHost.ConnectionManager.GetHubContext<CourseHub>(), courseMapper, collaboratorMapper, objectiveMapper)
        {

        }

        public void Handle(CourseCollaboratorAddedEvent args)
        {
            _hubContext.Clients.User(args.Collaborator.User.Email).courseCollaborated(
                  _courseMapper.Map(args.Collaborator.Course),
                  args.Collaborator.Course.RelatedObjectives.Select(o => _objectiveMapper.Map(o)),
                  _collaboratorMapper.Map(args.Collaborator));

            foreach (var collaborator in args.Collaborator.Course.Collaborators.Where(collaborator => collaborator.Id != args.Collaborator.Id))
            {
                _hubContext.Clients.User(collaborator.User.Email).courseCollaboratorAdded(
                    args.Collaborator.Course.Id.ToNString(),
                    _collaboratorMapper.Map(args.Collaborator));
            }
        }
    }
}