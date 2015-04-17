using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
using easygenerator.Web.InMemoryStorages.CourseStateStorage;

namespace easygenerator.Web.Storage
{
    public class CourseStateStorage : ICourseStateStorage
    {
        private readonly ICourseInfoInMemoryStorage _inMemoryStorage;
        private readonly ICourseStateRepository _repository;
        private readonly IEntityFactory _entityFactory;
        private readonly IUnitOfWork _unitOfWork;

        public CourseStateStorage(ICourseInfoInMemoryStorage inMemoryStorage, ICourseStateRepository repository, IEntityFactory entityFactory, IUnitOfWork unitOfWork)
        {
            _inMemoryStorage = inMemoryStorage;
            _repository = repository;
            _entityFactory = entityFactory;
            _unitOfWork = unitOfWork;
        }

        public bool HasUnpublishedChanges(Course course)
        {
            bool isInfoInMemory;
            var info = _inMemoryStorage.GetCourseInfo(course, out isInfoInMemory);
            if (isInfoInMemory)
            {
                return info.HasUnpublishedChanges;
            }

            var state = _repository.GetByCourseId(course.Id);
            if (state == null)
            {
                return info.HasUnpublishedChanges;
            }

            info.HasUnpublishedChanges = state.HasUnpublishedChanges;
            _inMemoryStorage.SaveCourseInfo(course, info);

            return info.HasUnpublishedChanges;
        }

        public void SaveHasUnpublishedChanges(Course course, bool hasUnpublishedChanges)
        {
            var info = _inMemoryStorage.GetCourseInfo(course);
            info.HasUnpublishedChanges = hasUnpublishedChanges;
            _inMemoryStorage.SaveCourseInfo(course, info);
            SaveCourseStateToRepository(course, hasUnpublishedChanges);
        }

        public void RemoveCourseState(Course course)
        {
            _inMemoryStorage.RemoveCourseInfo(course);
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