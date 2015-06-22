using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;

namespace easygenerator.DomainModel.Tests.Entities
{
    [TestClass]
    public class LearningPathTests
    {
        private const string ModifiedBy = "easygenerator@easygenerator.com";
        private const string CreatedBy = "easygenerator2@easygenerator.com";

        private readonly DateTime _currentDate = new DateTime(2014, 3, 19);

        [TestInitialize]
        public void InitializeContext()
        {
            DateTimeWrapper.Now = () => _currentDate;
        }

        #region Constructor

        [TestMethod]
        public void LearningPath_ShouldThrowArgumentNullException_WhenTitleIsNull()
        {
            Action action = () => LearningPathObjectMother.CreateWithTitle(null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void LearningPath_ShouldThrowArgumentException_WhenTitleIsEmpty()
        {
            Action action = () => LearningPathObjectMother.CreateWithTitle(String.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void LearningPath_ShouldThrowArgumentOutOfRangeException_WhenTitleIsLongerThan255()
        {
            Action action = () => LearningPathObjectMother.CreateWithTitle(new string('*', 256));

            action.ShouldThrow<ArgumentOutOfRangeException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void LearningPath_ShouldThrowArgumentNullException_WhenCreatedByIsNull()
        {
            Action action = () => LearningPathObjectMother.CreateWithCreatedBy(null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("createdBy");
        }


        [TestMethod]
        public void LearningPath_ShouldThrowArgumentException_WhenCreatedByIsEmpty()
        {
            Action action = () => LearningPathObjectMother.CreateWithCreatedBy(String.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("createdBy");
        }

        [TestMethod]
        public void LearningPath_ShouldCreateLearningPathInstance()
        {
            const string title = "title";
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            var learningPath = LearningPathObjectMother.Create(title, CreatedBy);

            learningPath.Id.Should().NotBeEmpty();
            learningPath.Title.Should().Be(title);
            learningPath.CreatedOn.Should().Be(DateTime.MaxValue);
            learningPath.ModifiedOn.Should().Be(DateTime.MaxValue);
            learningPath.CreatedBy.Should().Be(CreatedBy);
            learningPath.ModifiedBy.Should().Be(CreatedBy);
        }

        #endregion

        #region Update title

        [TestMethod]
        public void UpdateTitle_ShouldThrowArgumentNullException_WhenTitleIsNull()
        {
            var learningPath = LearningPathObjectMother.Create();

            Action action = () => learningPath.UpdateTitle(null, ModifiedBy);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void UpdateTitle_ShouldThrowArgumentException_WhenTitleIsEmpty()
        {
            var learningPath = LearningPathObjectMother.Create();

            Action action = () => learningPath.UpdateTitle(String.Empty, ModifiedBy);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void UpdateTitle_ShouldThrowArgumentOutOfRangeException_WhenTitleIsLongerThan255()
        {
            var learningPath = LearningPathObjectMother.Create();

            Action action = () => learningPath.UpdateTitle(new string('*', 256), ModifiedBy);

            action.ShouldThrow<ArgumentOutOfRangeException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void UpdateTitle_ShouldUpdateTitle()
        {
            const string title = "title";
            var learningPath = LearningPathObjectMother.Create();

            learningPath.UpdateTitle(title, ModifiedBy);

            learningPath.Title.Should().Be(title);
        }

        [TestMethod]
        public void UpdateTitle_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            var learningPath = LearningPathObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            learningPath.UpdateTitle("title", ModifiedBy);

            learningPath.ModifiedOn.Should().Be(dateTime);
        }

        [TestMethod]
        public void UpdateTitle_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var learningPath = LearningPathObjectMother.Create();

            Action action = () => learningPath.UpdateTitle("Some title", null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateTitle_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var learningPath = LearningPathObjectMother.Create();

            Action action = () => learningPath.UpdateTitle("Some title", string.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateTitle_ShouldUpdateMoidifiedBy()
        {
            var learningPath = LearningPathObjectMother.Create();
            var user = "Some user";

            learningPath.UpdateTitle("Some title", user);

            learningPath.ModifiedBy.Should().Be(user);
        }

        #endregion

        #region AddCourse

        [TestMethod]
        public void AddCourse_ShouldThrowNullArgumentException_WhenCourseIsNull()
        {
            //Arrange
            var learningPath = LearningPathObjectMother.Create();

            //Act
            Action action = () => learningPath.AddCourse(null, null, ModifiedBy);

            //Assert
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("course");
        }

        [TestMethod]
        public void AddCourse_ShouldUpdateModifiedOnDate()
        {
            //Arrange
            var learningPath = LearningPathObjectMother.Create();
            var course = CourseObjectMother.Create();
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            //Act
            learningPath.AddCourse(course, null, ModifiedBy);

            //Assert
            learningPath.ModifiedOn.Should().Be(DateTime.MaxValue);
        }

        [TestMethod]
        public void AddCourse_ShouldAddCourseToLearningPath()
        {
            //Arrange
            var learningPath = LearningPathObjectMother.Create();
            var course = CourseObjectMother.Create();

            //Act
            learningPath.AddCourse(course, null, ModifiedBy);

            //Assert
            learningPath.Courses.Should().Contain(course);
        }


        [TestMethod]
        public void AddCourse_ShouldUpdateObjectivesOrderedListAndInsertToEnd_WhenIndexIsNotDefined()
        {
            //Arrange
            var learningPath = LearningPathObjectMother.Create();
            var course = CourseObjectMother.Create();
            var course1 = CourseObjectMother.Create();
            learningPath.CoursesCollection = new Collection<Course>() { course };
            var coursesCollection = new List<Course>() { course };
            learningPath.UpdateCoursesOrder(coursesCollection, ModifiedBy);
            coursesCollection.Add(course1);
            var order = String.Join(",", coursesCollection.ConvertAll(o => o.Id.ToString()).ToArray());
            //Act
            learningPath.AddCourse(course1, null, ModifiedBy);

            //Assert
            learningPath.CoursesOrder.Should().Be(order);
        }

        [TestMethod]
        public void AddCourse_ShouldUpdateObjectivesOrderedListAndInsertToPosition_WhenIndexIsDefined()
        {
            //Arrange
            var learningPath = LearningPathObjectMother.Create();
            var course = CourseObjectMother.Create();
            var course1 = CourseObjectMother.Create();
            var course2 = CourseObjectMother.Create();
            const int position = 1;
            learningPath.CoursesCollection = new Collection<Course>() { course, course1 };
            var coursesCollection = new List<Course>() { course, course1 };
            learningPath.UpdateCoursesOrder(coursesCollection, ModifiedBy);
            coursesCollection.Insert(position, course2);
            var order = String.Join(",", coursesCollection.ConvertAll(o => o.Id.ToString()).ToArray());
            //Act
            learningPath.AddCourse(course2, 1, ModifiedBy);

            //Assert
            learningPath.CoursesOrder.Should().Be(order);
        }

        [TestMethod]
        public void AddCourse_ShouldThrowNullArgumentException_WhenModifiedByIsNull()
        {
            //Arrange
            var learningPath = LearningPathObjectMother.Create();
            var course = CourseObjectMother.Create();

            //Act
            Action action = () => learningPath.AddCourse(course, null, null);

            //Assert
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void AddCourse_ShouldThrowNullArgumentException_WhenModifiedByIsEmpty()
        {
            //Arrange
            var learningPath = LearningPathObjectMother.Create();
            var course = CourseObjectMother.Create();

            //Act
            Action action = () => learningPath.AddCourse(course, null, null);

            //Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void AddCourse_ShouldUpdateMoidifiedBy()
        {
            var learningPath = LearningPathObjectMother.Create();
            var course = CourseObjectMother.Create();
            var user = "Some user";

            learningPath.AddCourse(course, null, user);

            learningPath.ModifiedBy.Should().Be(user);
        }

        #endregion

        #region RemoveCourse

        [TestMethod]
        public void RemoveCourse_ShouldThrowNullArgumentException_WhenCourseIsNull()
        {
            //Arrange
            var learningPath = LearningPathObjectMother.Create();

            //Act
            Action action = () => learningPath.RemoveCourse(null, ModifiedBy);

            //Assert
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("course");
        }

        [TestMethod]
        public void RemoveCourse_ShouldUpdateModifiedOnDate()
        {
            //Arrange
            var learningPath = LearningPathObjectMother.Create();
            var course = CourseObjectMother.Create();
            learningPath.CoursesCollection = new Collection<Course>()
            {
                course
            };

            DateTimeWrapper.Now = () => DateTime.MaxValue;

            //Act
            learningPath.RemoveCourse(course, ModifiedBy);

            //Assert
            learningPath.ModifiedOn.Should().Be(DateTime.MaxValue);
        }

        [TestMethod]
        public void RemoveCourse_ShouldRemoveCourseFromLearningPath()
        {
            //Arrange
            var learningPath = LearningPathObjectMother.Create();
            var course = CourseObjectMother.Create();
            learningPath.CoursesCollection = new Collection<Course>()
            {
                course
            };

            //Act
            learningPath.RemoveCourse(course, ModifiedBy);

            //Assert
            learningPath.Courses.Should().NotContain(course);
        }

        [TestMethod]
        public void RemoveCourse_ShouldUpdateCoursesOrderedList()
        {
            //Arrange
            var learningPath = LearningPathObjectMother.Create();
            var course = CourseObjectMother.Create();
            learningPath.CoursesCollection = new Collection<Course>()
            {
                course
            };

            var coursesCollection = new List<Course>() { course };
            learningPath.UpdateCoursesOrder(coursesCollection, ModifiedBy);
            //Act
            learningPath.RemoveCourse(course, ModifiedBy);

            //Assert
            learningPath.CoursesOrder.Should().BeNull();
        }

        [TestMethod]
        public void RemoveCourse_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            //Arrange
            var learningPath = LearningPathObjectMother.Create();
            var course = CourseObjectMother.Create();
            //Act
            Action action = () => learningPath.RemoveCourse(course, null);

            //Assert
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void RemoveCourse_ShouldThrowArgumentNullException_WhenModifiedByIsEmpty()
        {
            //Arrange
            var learningPath = LearningPathObjectMother.Create();
            var course = CourseObjectMother.Create();
            //Act
            Action action = () => learningPath.RemoveCourse(course, "");

            //Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void RemoveCourse_ShouldUpdateMoidifiedBy()
        {
            //Arrange
            var learningPath = LearningPathObjectMother.Create();
            var course = CourseObjectMother.Create();
            learningPath.CoursesCollection = new Collection<Course>()
            {
                course
            };

            //Act
            learningPath.RemoveCourse(course, ModifiedBy);

            //Assert
            learningPath.ModifiedBy.Should().Be(ModifiedBy);
        }

        #endregion

        #region UpdateCoursesOrder

        [TestMethod]
        public void UpdateCoursesOrder_ShouldUpdateCoursesOrderedList()
        {
            //Arrange
            var user = "some user";
            var learningPath = LearningPathObjectMother.Create();
            var course1 = CourseObjectMother.Create();
            var course2 = CourseObjectMother.Create();
            var coursesCollection = new List<Course>()
            {
                course2,
                course1
            };
            var result = String.Join(",", coursesCollection.ConvertAll(o => o.Id.ToString()).ToArray());
            //Act
            learningPath.UpdateCoursesOrder(coursesCollection, user);

            //Assert
            learningPath.CoursesOrder.Should().Be(result);
        }

        [TestMethod]
        public void UpdateCoursesOrder_ShouldUpdateModifiedOn()
        {
            //Arrange
            var user = "some user";
            var learningPath = LearningPathObjectMother.Create();
            DateTimeWrapper.Now = () => DateTime.Now;

            var dateTime = DateTime.Now.AddDays(1);
            DateTimeWrapper.Now = () => dateTime;

            var coursesCollection = new List<Course>()
            {
                CourseObjectMother.Create()
            };

            //Act
            learningPath.UpdateCoursesOrder(coursesCollection, user);

            //Assert
            learningPath.ModifiedOn.Should().Be(dateTime);
        }

        [TestMethod]
        public void UpdateCoursesOrder_ShouldUpdateModifiedBy()
        {
            //Arrange
            var user = "some user";
            var learningPath = LearningPathObjectMother.Create();
            var coursesCollection = new List<Course>()
            {
                CourseObjectMother.Create()
            };

            //Act
            learningPath.UpdateCoursesOrder(coursesCollection, user);

            //Assert
            learningPath.ModifiedBy.Should().Be(user);
        }

        [TestMethod]
        public void UpdateCoursesOrder_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            //Arrange
            var learningPath = LearningPathObjectMother.Create();
            var coursesCollection = new List<Course>()
            {
                CourseObjectMother.Create()
            };

            //Act
            Action action = () => learningPath.UpdateCoursesOrder(coursesCollection, null);

            //Assert
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateCoursesOrder_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            //Arrange
            var learningPath = LearningPathObjectMother.Create();
            var coursesCollection = new List<Course>()
            {
                CourseObjectMother.Create()
            };

            //Act
            Action action = () => learningPath.UpdateCoursesOrder(coursesCollection, "");

            //Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        #endregion UpdateObjectivesOrder

        #region Courses

        [TestMethod]
        public void Courses_ShouldReturnOrderedCoursesCollection_WhenCoursesOrderedListNotNull()
        {
            //Arrange
            var learningPath = LearningPathObjectMother.Create();
            var course1 = CourseObjectMother.Create();
            var course2 = CourseObjectMother.Create();
            learningPath.CoursesCollection = new Collection<Course>()
            {
                course2,
                course1
            };
            learningPath.CoursesOrder = String.Format("{0},{1}", course1.Id, course2.Id);

            //Act
            var result = learningPath.Courses;

            //Assert
            result.First().Id.Should().Be(course1.Id);
        }

        [TestMethod]
        public void Courses_ShouldReturnAllObjectivesInCorrectOrder_WhenObjectivesOrderedListIsNotFull()
        {
            //Arrange
            var learningPath = LearningPathObjectMother.Create();
            var course1 = CourseObjectMother.Create();
            var course2 = CourseObjectMother.Create();
            learningPath.CoursesCollection = new Collection<Course>()
            {
                course2,
                course1
            };
            learningPath.CoursesOrder = course1.Id.ToString();

            //Act
            var result = learningPath.Courses;

            //Assert
            result.Count().Should().Be(2);
            result.First().Should().Be(course1);
        }

        [TestMethod]
        public void Courses_ShouldReturnAllCoursesInCorrectOrder_WhenCoursesOrderedListIsOverfull()
        {
            //Arrange
            var learningPath = LearningPathObjectMother.Create();
            var course1 = CourseObjectMother.Create();
            var course2 = CourseObjectMother.Create();
            learningPath.CoursesCollection = new Collection<Course>()
            {
                course2
            };
            learningPath.CoursesOrder = String.Format("{0},{1}", course1.Id, course2.Id);

            //Act
            var result = learningPath.Courses;

            //Assert
            result.Count().Should().Be(1);
            result.First().Should().Be(course2);
        }

        #endregion RelatedObjectives
    }
}
