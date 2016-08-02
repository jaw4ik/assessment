using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.CourseEvents;
using easygenerator.DomainModel.Events.CourseEvents.Collaboration;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
using easygenerator.Web.Components;

namespace easygenerator.Web.Domain.DomainEvents.Handlers.Intercom
{
    public class CourseEventsHandler :
        IDomainEventHandler<CoursePublishedEvent>,
        IDomainEventHandler<CourseCreatedEvent>,
        IDomainEventHandler<CourseDeletedEvent>,
        IDomainEventHandler<CourseCollaboratorAddedEvent>,
        IDomainEventHandler<CourseCollaboratorRemovedEvent>
    {
        private readonly ICourseRepository _courseRepository;
        private readonly IIntercomClient _intercomClient;
        private readonly ILog _logger;

        public CourseEventsHandler(ICourseRepository courseRepository, IIntercomClient intercomClient, ILog logger)
        {
            _courseRepository = courseRepository;
            _intercomClient = intercomClient;
            _logger = logger;
        }

        public void Handle(CoursePublishedEvent args)
        {
            if (_intercomClient.Client == null)
            {
                return;
            }

            SendIntercomEvent(args.Course.CreatedBy, "Course published");
        }

        public void Handle(CourseCreatedEvent args)
        {
            if (_intercomClient.Client == null)
            {
                return;
            }

            var userEmail = args.Course.CreatedBy;
            var courses = _courseRepository.GetOwnedCourses(args.Course.CreatedBy);
            if (!courses.Contains(args.Course))
            {
                courses.Add(args.Course);
            }

            UpdateCoursesCount(userEmail, courses);
        }

        public void Handle(CourseDeletedEvent args)
        {
            if (_intercomClient.Client == null)
            {
                return;
            }

            var userEmail = args.Course.CreatedBy;
            var courses = _courseRepository.GetOwnedCourses(args.Course.CreatedBy);
            if (courses.Contains(args.Course))
            {
                courses.Remove(args.Course);
            }

            UpdateCoursesCount(userEmail, courses);
            UpdateCollaboratorsCount(userEmail, courses);
        }

        public void Handle(CourseCollaboratorAddedEvent args)
        {
            if (_intercomClient.Client == null)
            {
                return;
            }

            var userEmail = args.Collaborator.Course.CreatedBy;
            UpdateCollaboratorsCount(userEmail, _courseRepository.GetOwnedCourses(userEmail));
        }

        public void Handle(CourseCollaboratorRemovedEvent args)
        {
            if (_intercomClient.Client == null)
            {
                return;
            }

            var userEmail = args.Course.CreatedBy;
            UpdateCollaboratorsCount(userEmail, _courseRepository.GetOwnedCourses(userEmail));
        }

        private void UpdateCoursesCount(string email, IEnumerable<Course> courses)
        {
            UpdateIntercomUserFields(email, new
            {
                courses_count = courses.Count()
            });
        }

        private void UpdateCollaboratorsCount(string email, IEnumerable<Course> courses)
        {
            var uniqueCollaborators = courses
                .SelectMany(course => course.Collaborators)
                .Select(collaborator => collaborator.Email)
                .Distinct();

            UpdateIntercomUserFields(email, new
            {
                collaborators_count = uniqueCollaborators.Count()
            });
        }

        private void UpdateIntercomUserFields(string email, object fields)
        {
            Task.Run(() =>
            {
                try
                {
                    _intercomClient.Client.Users.Post(new
                    {
                        email,
                        custom_attributes = fields
                    });
                }
                catch (Exception exception)
                {
                    _logger.LogException(exception);
                }
            });
        }

        private void SendIntercomEvent(string email, string eventName)
        {
            Task.Run(() =>
            {
                try
                {
                    _intercomClient.Client.Events.Post(new
                    {
                        email,
                        event_name = eventName,
                        created_at = GetDateTimeUtcTimestamp()
                    });
                }
                catch (Exception exception)
                {
                    _logger.LogException(exception);
                }
            });
        }

        private int GetDateTimeUtcTimestamp()
        {
            return (int)(DateTime.UtcNow.Subtract(new DateTime(1970, 1, 1))).TotalSeconds;
        }
    }
}