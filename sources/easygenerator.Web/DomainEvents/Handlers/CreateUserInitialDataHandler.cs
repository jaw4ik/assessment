using easygenerator.DomainModel;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.UserEvents;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure.Clonning;
using easygenerator.Web.Components.DomainOperations;
using easygenerator.Web.InMemoryStorages;

namespace easygenerator.Web.DomainEvents.Handlers
{
    public class CreateUserInitialDataHandler : IDomainEventHandler<CreateUserInitialDataEvent>
    {
        private readonly IEntityFactory _entityFactory;
        private readonly ICourseRepository _courseRepository;
        private readonly IOnboardingRepository _onboardingRepository;
        private readonly ITemplateRepository _templateRepository;
        private readonly IDemoCoursesStorage _demoCoursesInMemoryStorage;
        private readonly ICloner _cloner;
        private readonly IDomainOperationExecutor _domainOperationExecutor;

        public CreateUserInitialDataHandler(IEntityFactory entityFactory, ICourseRepository courseRepository, IOnboardingRepository onboardingRepository,
            ITemplateRepository templateRepository, IDemoCoursesStorage demoCoursesInMemoryStorage, ICloner cloner, IDomainOperationExecutor domainOperationExecutor)
        {
            _entityFactory = entityFactory;
            _courseRepository = courseRepository;
            _onboardingRepository = onboardingRepository;
            _templateRepository = templateRepository;
            _demoCoursesInMemoryStorage = demoCoursesInMemoryStorage;
            _cloner = cloner;
            _domainOperationExecutor = domainOperationExecutor;
        }

        public void Handle(CreateUserInitialDataEvent args)
        {
            var onboarding = _entityFactory.Onboarding(args.User.Email);
            _onboardingRepository.Add(onboarding);

            var demoCourses = _demoCoursesInMemoryStorage.DemoCourses;
            var defaultTemplate = _templateRepository.GetDefaultTemplate();

            foreach (var demoCourse in demoCourses)
            {
                var clonedCourse = _cloner.Clone(demoCourse, args.User.Email);
                clonedCourse.UpdateTemplate(defaultTemplate, clonedCourse.CreatedBy);
                _domainOperationExecutor.CreateCourse(clonedCourse, false);
            }
        }
    }
}