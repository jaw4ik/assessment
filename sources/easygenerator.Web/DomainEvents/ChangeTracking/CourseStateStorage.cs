using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
using easygenerator.Web.InMemoryStorages.CourseStateStorage;

namespace easygenerator.Web.DomainEvents.ChangeTracking
{
    public class CourseStateStorage : ICourseStateStorage
    {
        private readonly ICourseStateInMemoryStorage _inMemoryStorage;
        private readonly ICourseStateRepository _repository;
        private readonly IEntityFactory _entityFactory;
        private readonly IUnitOfWork _unitOfWork;

        public CourseStateStorage(ICourseStateInMemoryStorage inMemoryStorage, ICourseStateRepository repository, IEntityFactory entityFactory, IUnitOfWork unitOfWork)
        {
            _inMemoryStorage = inMemoryStorage;
            _repository = repository;
            _entityFactory = entityFactory;
            _unitOfWork = unitOfWork;
        }

        public bool HasUnpublishedChanges(Course course)
        {
            bool hasUnpublishedChanges;
            if (_inMemoryStorage.TryGetHasUnpublishedChanges(course, out hasUnpublishedChanges))
            {
                return hasUnpublishedChanges;
            }

            var state = _repository.GetByCourseId(course.Id);
            hasUnpublishedChanges = state != null && state.HasUnpublishedChanges;
            _inMemoryStorage.SaveHasUnpublishedChanges(course, hasUnpublishedChanges);

            return hasUnpublishedChanges;
        }

        public void SaveHasUnpublishedChanges(Course course, bool hasUnpublishedChanges)
        {
            _inMemoryStorage.SaveHasUnpublishedChanges(course, hasUnpublishedChanges);
            SaveCourseStateToRepository(course, hasUnpublishedChanges);
        }

        public void RemoveCourseState(Course course)
        {
            _inMemoryStorage.RemoveCourseState(course);
        }

        private void SaveCourseStateToRepository(Course course, bool hasUnpublishedChanges)
        {
            var state = _repository.GetByCourseId(course.Id);
            if (state == null)
            {
                _repository.Add(_entityFactory.CourseState(course, hasUnpublishedChanges));
            }
            else
            {
                state.UpdateHasUnpublishedChanges(hasUnpublishedChanges);
            }

            _unitOfWork.Save();
        }
    }
}