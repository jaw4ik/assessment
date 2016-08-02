using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.CourseEvents;
using easygenerator.DomainModel.Events.QuestionEvents;
using easygenerator.DomainModel.Events.SectionEvents;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
using easygenerator.Web.Components;

namespace easygenerator.Web.Domain.DomainEvents.Handlers.Intercom
{
    public class QuestionEventsHandler :
        IDomainEventHandler<QuestionCreatedEvent>,
        IDomainEventHandler<QuestionsDeletedEvent>,
        IDomainEventHandler<CourseCreatedEvent>,
        IDomainEventHandler<CourseDeletedEvent>
    {
        private readonly ICourseRepository _courseRepository;
        private readonly IIntercomClient _intercomClient;
        private readonly ILog _logger;

        public QuestionEventsHandler(ICourseRepository courseRepository, IIntercomClient intercomClient, ILog logger)
        {
            _courseRepository = courseRepository;
            _intercomClient = intercomClient;
            _logger = logger;
        }

        public void Handle(QuestionCreatedEvent args)
        {
            if (_intercomClient.Client == null)
            {
                return;
            }

            if (!(args.Question is Scenario))
            {
                return;
            }

            var userEmail = args.Question.CreatedBy;
            UpdateScenarioQuestionsCount(userEmail, _courseRepository.GetOwnedCourses(userEmail));
        }

        public void Handle(QuestionsDeletedEvent args)
        {
            if (_intercomClient.Client == null)
            {
                return;
            }

            if (!(args.Questions.Any(question => question is Scenario)))
            {
                return;
            }

            var userEmail = args.Questions.First().CreatedBy;
            UpdateScenarioQuestionsCount(userEmail, _courseRepository.GetOwnedCourses(userEmail));
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

            UpdateScenarioQuestionsCount(userEmail, courses);
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

            UpdateScenarioQuestionsCount(userEmail, courses);
        }

        private void UpdateScenarioQuestionsCount(string email, IEnumerable<Course> courses)
        {
            var scenarioQuestions = courses
                .SelectMany(course => course.RelatedSections)
                .SelectMany(section => section.Questions)
                .Where(question => question is Scenario);

            UpdateIntercomUserFields(email, new
            {
                scenario_questions_count = scenarioQuestions.Count()
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
    }
}