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
using easygenerator.Infrastructure;
using System;

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
        IDomainEventHandler<CourseAccessGrantedEvent>,
        IDomainEventHandler<CourseAccessRemovedEvent>,

        IDomainEventHandler<SectionChangedEvent>,
        IDomainEventHandler<ThemeUpdatedEvent>,
        IDomainEventHandler<ThemeDeletedEvent>
    {
        private readonly ICourseRepository _repository;
        private readonly IDomainEventPublisher _eventPublisher;
        private readonly IUnitOfWork _unitOfWork;

        public CourseChangeTracker(IDomainEventPublisher eventPublisher, ICourseRepository repository, IUnitOfWork unitOfWork)
        {
            _eventPublisher = eventPublisher;
            _repository = repository;
            _unitOfWork = unitOfWork;
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

        public void Handle(CourseAccessGrantedEvent args)
        {
            RaiseCourseChangedEvent(args.Course);
        }

        public void Handle(CourseAccessRemovedEvent args)
        {
            RaiseCourseChangedEvent(args.Course);
        }

        #endregion

        public void Handle(SectionChangedEvent args)
        {
            OnCoursesChanged(_repository.GetCoursesRelatedToSection(args.Section.Id), args.Section);
        }

        public void Handle(ThemeUpdatedEvent args)
        {
            OnCoursesChanged(_repository.GetCoursesWithTheme(args.Theme.Id), args.Theme);
        }

        public void Handle(ThemeDeletedEvent args)
        {
            var changedCourses = args.ChangedCourseSettings.Where(item => item.Course.Template == item.Template)
                    .Select(item => item.Course);

            OnCoursesChanged(changedCourses, args.Theme);
        }

        private void OnCoursesChanged(IEnumerable<Course> courses, Entity entity)
        {
            foreach (var course in courses)
            {
                course.MarkAsModified(entity.ModifiedBy, entity.ModifiedOn);

                RaiseCourseChangedEvent(course);
            }

            _unitOfWork.Save();
        }

        private void RaiseCourseChangedEvent(Course course)
        {
            _eventPublisher.Publish(new CourseChangedEvent(course));
        }
    }
}
