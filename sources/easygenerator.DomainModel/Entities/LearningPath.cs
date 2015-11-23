using easygenerator.Infrastructure;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;

namespace easygenerator.DomainModel.Entities
{
    public class LearningPath : Entity
    {
        protected internal LearningPath()
        {
        }

        protected internal LearningPath(string title, string createdBy)
            : base(createdBy)
        {
            ThrowIfTitleIsInvalid(title);

            CoursesCollection = new Collection<Course>();

            Title = title;
        }

        public string Title { get; private set; }

        public virtual void UpdateTitle(string title, string modifiedBy)
        {
            ThrowIfTitleIsInvalid(title);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            Title = title;
            MarkAsModified(modifiedBy);
        }

        public string PackageUrl { get; private set; }
        public virtual void UpdatePackageUrl(string packageUrl)
        {
            ThrowIfPackageUrlIsInvalid(packageUrl);

            PackageUrl = packageUrl;
        }

        public string PublicationUrl { get; private set; }
        public virtual void UpdatePublicationUrl(string publicationUrl)
        {
            ThrowIfPublicationUrlIsInvalid(publicationUrl);

            PublicationUrl = publicationUrl;
        }

        public void ResetPublicationUrl()
        {
            PublicationUrl = null;
        }

        #region Courses

        protected internal virtual ICollection<Course> CoursesCollection { get; set; }

        protected internal string CoursesOrder { get; set; }

        public virtual IEnumerable<Course> Courses
        {
            get { return GetOrderedCourses().AsEnumerable(); }
        }

        public virtual void AddCourse(Course course, int? index, string modifiedBy)
        {
            ThrowIfCourseIsInvalid(course);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            if (!CoursesCollection.Contains(course))
            {
                var courses = GetOrderedCourses();
                if (index.HasValue)
                {
                    courses.Insert(index.Value, course);
                }
                else
                {
                    courses.Add(course);
                }

                DoUpdateCoursesOrder(courses, modifiedBy);

                CoursesCollection.Add(course);
            }

            MarkAsModified(modifiedBy);
        }

        public virtual void RemoveCourse(Course course, string modifiedBy)
        {
            ThrowIfCourseIsInvalid(course);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            var courses = GetOrderedCourses();
            courses.Remove(course);
            DoUpdateCoursesOrder(courses, modifiedBy);

            CoursesCollection.Remove(course);

            MarkAsModified(modifiedBy);
        }

        public void UpdateCoursesOrder(ICollection<Course> courses, string modifiedBy)
        {
            DoUpdateCoursesOrder(courses, modifiedBy);
        }

        private void DoUpdateCoursesOrder(ICollection<Course> courses, string modifiedBy)
        {
            CoursesOrder = OrderingUtils.GetOrder(courses);
            MarkAsModified(modifiedBy);
        }

        private IList<Course> GetOrderedCourses()
        {
            return OrderingUtils.OrderCollection(CoursesCollection, CoursesOrder);
        }

        #endregion

        #region Guard methods

        private void ThrowIfTitleIsInvalid(string title)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(title, "title");
            ArgumentValidation.ThrowIfLongerThan255(title, "title");
        }

        private void ThrowIfCourseIsInvalid(Course course)
        {
            ArgumentValidation.ThrowIfNull(course, "course");
        }

        private void ThrowIfPackageUrlIsInvalid(string packageUrl)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(packageUrl, "packageUrl");
        }

        private void ThrowIfPublicationUrlIsInvalid(string publicationUrl)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(publicationUrl, "publicationUrl");
        }

        #endregion

    }
}
