using easygenerator.DomainModel.Entities;

namespace easygenerator.Web.Components.DomainOperations.CourseOperations
{
    public interface ICourseDomainOperationExecutor
    {
        void CreateCourse(Course course, bool raiseEvent = true);
    }

    public class CourseDomainOperationExecutor : ICourseDomainOperationExecutor
    {
        private readonly CreateCourseOperation _createCourseOperation;

        public CourseDomainOperationExecutor(CreateCourseOperation createCourseOperation)
        {
            _createCourseOperation = createCourseOperation;
        }

        public void CreateCourse(Course course, bool raiseEvent = true)
        {
            _createCourseOperation.Execute(course, raiseEvent);
        }
    }
}