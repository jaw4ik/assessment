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

        public bool IsDirty(Course course)
        {
            var info = _inMemoryStorage.GetCourseInfo(course);
            if (info != null)
            {
                return info.IsDirty;
            }

            info = new CourseInfo();
            var state = _repository.GetByCourseId(course.Id);
            if (state != null)
            {
                info.IsDirty = state.IsDirty;
            }

            _inMemoryStorage.SaveCourseInfo(course, info);

            return info.IsDirty;
        }

        public void MarkAsDirty(Course course)
        {
            SaveIsDirtyState(course, true);
        }

        public void MarkAsClean(Course course)
        {
            SaveIsDirtyState(course, false);
        }

        public void RemoveState(Course course)
        {
            _inMemoryStorage.RemoveCourseInfo(course);
        }

        private void SaveIsDirtyState(Course course, bool isDirty)
        {
            var info = _inMemoryStorage.GetCourseInfoOrDefault(course);
            info.IsDirty = isDirty;
            _inMemoryStorage.SaveCourseInfo(course, info);

            var state = _repository.GetByCourseId(course.Id);
            if (state == null)
            {
                _repository.Add(_entityFactory.CourseState(course, isDirty));
            }
            else
            {
                if (isDirty)
                {
                    state.MarkAsDirty();
                }
                else
                {
                    state.MarkAsClean();
                }
            }

            _unitOfWork.Save();
        }
    }
}