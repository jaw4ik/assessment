using easygenerator.DomainModel.Entities;

namespace easygenerator.Web.Components.DomainOperations
{
    public interface IDomainOperationExecutor
    {
        void CreateCourse(Course course, bool raiseEvent = true);
    }

    public class DomainOperationExecutor : IDomainOperationExecutor
    {
        private readonly CreateCourseOperation _createCourseOperation;

        public DomainOperationExecutor(CreateCourseOperation createCourseOperation)
        {
            _createCourseOperation = createCourseOperation;
        }

        public void CreateCourse(Course course, bool raiseEvent = true)
        {
            _createCourseOperation.Execute(course, raiseEvent);
        }
    }
}