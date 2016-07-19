using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.CourseEvents;
using easygenerator.DomainModel.Repositories;

namespace easygenerator.Web.Components.DomainOperations.CourseOperations
{
    public class CreateCourseOperation
    {
        private readonly IOrganizationUserRepository _organizationUserRepository;
        private readonly ICourseRepository _courseRepository;
        private readonly IDomainEventPublisher _eventPublisher;

        public CreateCourseOperation(IOrganizationUserRepository organizationUserRepository, ICourseRepository courseRepository,
            IDomainEventPublisher eventPublisher)
        {
            _organizationUserRepository = organizationUserRepository;
            _courseRepository = courseRepository;
            _eventPublisher = eventPublisher;
        }

        public virtual void Execute(Course course, bool raiseEvent = true)
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
