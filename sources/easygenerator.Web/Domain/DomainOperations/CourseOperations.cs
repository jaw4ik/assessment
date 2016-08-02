using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.CourseEvents;
using easygenerator.DomainModel.Repositories;

namespace easygenerator.Web.Domain.DomainOperations
{
    public interface ICourseOperations
    {
        void CreateCourse(Course course, bool raiseEvent = true);
    }

    public class CourseOperations : ICourseOperations
    {
        private readonly IOrganizationUserRepository _organizationUserRepository;
        private readonly ICourseRepository _courseRepository;
        private readonly IDomainEventPublisher _eventPublisher;

        public CourseOperations(IOrganizationUserRepository organizationUserRepository, ICourseRepository courseRepository,
            IDomainEventPublisher eventPublisher)
        {
            _organizationUserRepository = organizationUserRepository;
            _courseRepository = courseRepository;
            _eventPublisher = eventPublisher;
        }

        public virtual void CreateCourse(Course course, bool raiseEvent = true)
        {
            _courseRepository.Add(course);

            foreach (var organizationAdmin in _organizationUserRepository.GetUserOrganizationAdminUsers(course.CreatedBy))
            {
                course.CollaborateAsAdmin(organizationAdmin.Email);
            }

            if (raiseEvent)
            {
                _eventPublisher.Publish(new CourseCreatedEvent(course));
            }
        }
    }
}