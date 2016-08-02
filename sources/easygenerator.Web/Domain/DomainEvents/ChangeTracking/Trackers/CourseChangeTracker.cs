using System.Collections.Generic;
using System.Linq;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.CommentEvents;
using easygenerator.DomainModel.Events.CourseEvents;
using easygenerator.DomainModel.Events.QuestionEvents.RankingTextEvents;
using easygenerator.DomainModel.Events.ThemeEvents;
using easygenerator.DomainModel.Repositories;
using easygenerator.Web.Domain.DomainEvents.ChangeTracking.Events;

namespace easygenerator.Web.Domain.DomainEvents.ChangeTracking.Trackers
{
    public class CourseChangeTracker :
        IDomainEventHandler<CourseTitleUpdatedEvent>,
        IDomainEventHandler<CourseIntroductionContentUpdated>,
        IDomainEventHandler<CourseTemplateUpdatedEvent>,
        IDomainEventHandler<CourseSectionsReorderedEvent>,
        IDomainEventHandler<CourseSectionRelatedEvent>,
        IDomainEventHandler<CourseSectionsUnrelatedEvent>,
        IDomainEventHandler<CourseTemplateSettingsUpdated>,

        IDomainEventHandler<SectionChangedEvent>,
        IDomainEventHandler<QuestionChangedEvent>,
        IDomainEventHandler<LearningContentChangedEvent>,
        IDomainEventHandler<AnswerChangedEvent>,
        IDomainEventHandler<DropspotChangedEvent>,
        IDomainEventHandler<HotSpotPolygonChangedEvent>,
        IDomainEventHandler<TextMatchingAnswerChangedEvent>,
        IDomainEventHandler<SingleSelectImageAnswerChangedEvent>,
        IDomainEventHandler<RankingTextAnswerCreatedEvent>,
        IDomainEventHandler<RankingTextAnswerTextChangedEvent>,
        IDomainEventHandler<CommentDeletedEvent>,
        IDomainEventHandler<ThemeUpdatedEvent>,
        IDomainEventHandler<ThemeDeletedEvent>
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

        public void Handle(CourseSectionsReorderedEvent args)
        {
            RaiseCourseChangedEvent(args.Course);
        }

        public void Handle(CourseSectionRelatedEvent args)
        {
            RaiseCourseChangedEvent(args.Course);
        }

        public void Handle(CourseSectionsUnrelatedEvent args)
        {
            RaiseCourseChangedEvent(args.Course);
        }

        public void Handle(CourseTemplateSettingsUpdated args)
        {
            RaiseCourseChangedEvent(args.Course);
        }

        #endregion

        public void Handle(SectionChangedEvent args)
        {
            RaiseCoursesChangedEvent(_repository.GetCoursesRelatedToSection(args.Section.Id));
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

        public void Handle(RankingTextAnswerCreatedEvent args)
        {
            RaiseCoursesChangedEvent(_repository.GetCoursesRelatedToRankingTextAnswer(args.Answer.Id));
        }

        public void Handle(RankingTextAnswerTextChangedEvent args)
        {
            RaiseCoursesChangedEvent(_repository.GetCoursesRelatedToRankingTextAnswer(args.Answer.Id));
        }
        public void Handle(CommentDeletedEvent args)
        {
            RaiseCourseChangedEvent(args.Course);
        }
        public void Handle(ThemeUpdatedEvent args)
        {
            RaiseCoursesChangedEvent(_repository.GetCoursesWithTheme(args.Theme.Id));
        }
        public void Handle(ThemeDeletedEvent args)
        {
            var changedCourses = args.ChangedCourseSettings.Where(item => item.Course.Template == item.Template)
                    .Select(item => item.Course);

            RaiseCoursesChangedEvent(changedCourses);
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
