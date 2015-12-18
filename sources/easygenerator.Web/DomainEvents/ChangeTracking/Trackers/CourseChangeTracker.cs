using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.CourseEvents;
using easygenerator.DomainModel.Repositories;
using easygenerator.Web.DomainEvents.ChangeTracking.Events;
using System.Collections.Generic;
using easygenerator.DomainModel.Events.CommentEvents;

namespace easygenerator.Web.DomainEvents.ChangeTracking.Trackers
{
    public class CourseChangeTracker :
        IDomainEventHandler<CourseTitleUpdatedEvent>,
        IDomainEventHandler<CourseIntroductionContentUpdated>,
        IDomainEventHandler<CourseTemplateUpdatedEvent>,
        IDomainEventHandler<CourseObjectivesReorderedEvent>,
        IDomainEventHandler<CourseObjectiveRelatedEvent>,
        IDomainEventHandler<CourseObjectivesUnrelatedEvent>,
        IDomainEventHandler<CourseTemplateSettingsUpdated>,

        IDomainEventHandler<ObjectiveChangedEvent>,
        IDomainEventHandler<QuestionChangedEvent>,
        IDomainEventHandler<LearningContentChangedEvent>,
        IDomainEventHandler<AnswerChangedEvent>,
        IDomainEventHandler<DropspotChangedEvent>,
        IDomainEventHandler<HotSpotPolygonChangedEvent>,
        IDomainEventHandler<TextMatchingAnswerChangedEvent>,
        IDomainEventHandler<SingleSelectImageAnswerChangedEvent>,
        IDomainEventHandler<CommentDeletedEvent>
    {
        private readonly ICourseRepository _repository;
        private readonly IDomainEventPublisher _eventPublisher;

        public CourseChangeTracker(IDomainEventPublisher eventPublisher, ICourseRepository repository)
        {
            _eventPublisher = eventPublisher;
            _repository = repository;
        }

        #region Course event handlers

        public void Handle(CourseTitleUpdatedEvent args)
        {
            RaiseCourseChangedEvent(args.Course);
        }

        public void Handle(CourseIntroductionContentUpdated args)
        {
            RaiseCourseChangedEvent(args.Course);
        }

        public void Handle(CourseTemplateUpdatedEvent args)
        {
            RaiseCourseChangedEvent(args.Course);
        }

        public void Handle(CourseObjectivesReorderedEvent args)
        {
            RaiseCourseChangedEvent(args.Course);
        }

        public void Handle(CourseObjectiveRelatedEvent args)
        {
            RaiseCourseChangedEvent(args.Course);
        }

        public void Handle(CourseObjectivesUnrelatedEvent args)
        {
            RaiseCourseChangedEvent(args.Course);
        }

        public void Handle(CourseTemplateSettingsUpdated args)
        {
            RaiseCourseChangedEvent(args.Course);
        }

        #endregion

        public void Handle(ObjectiveChangedEvent args)
        {
            RaiseCoursesChangedEvent(_repository.GetCoursesRelatedToObjective(args.Objective.Id));
        }

        public void Handle(QuestionChangedEvent args)
        {
            RaiseCoursesChangedEvent(_repository.GetCoursesRelatedToQuestion(args.Question.Id));
        }

        public void Handle(LearningContentChangedEvent args)
        {
            RaiseCoursesChangedEvent(_repository.GetCoursesRelatedToLearningContent(args.LearningContent.Id));
        }

        public void Handle(AnswerChangedEvent args)
        {
            RaiseCoursesChangedEvent(_repository.GetCoursesRelatedToAnswer(args.Answer.Id));
        }

        public void Handle(DropspotChangedEvent args)
        {
            RaiseCoursesChangedEvent(_repository.GetCoursesRelatedToDropspot(args.Dropspot.Id));
        }

        public void Handle(HotSpotPolygonChangedEvent args)
        {
            RaiseCoursesChangedEvent(_repository.GetCoursesRelatedToHotSpotPolygon(args.HotSpotPolygon.Id));
        }

        public void Handle(TextMatchingAnswerChangedEvent args)
        {
            RaiseCoursesChangedEvent(_repository.GetCoursesRelatedToTextMatchingAnswer(args.Answer.Id));
        }

        public void Handle(SingleSelectImageAnswerChangedEvent args)
        {
            RaiseCoursesChangedEvent(_repository.GetCoursesRelatedToSingleSelectImageAnswer(args.Answer.Id));
        }
        public void Handle(CommentDeletedEvent args)
        {
            RaiseCourseChangedEvent(args.Course);
        }

        private void RaiseCoursesChangedEvent(IEnumerable<Course> courses)
        {
            foreach (var course in courses)
            {
                RaiseCourseChangedEvent(course);
            }
        }

        private void RaiseCourseChangedEvent(Course course)
        {
            _eventPublisher.Publish(new CourseChangedEvent(course));
        }
    }
}
