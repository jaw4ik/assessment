using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Web.Controllers;
using easygenerator.Web.Tests.Utils;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace easygenerator.Web.Tests.Controllers
{
    [TestClass]
    public class RedirectToNewStorageControllerTests
    {
        private RedirectToNewStorageController _controller;

        [TestInitialize]
        public void InitializeController()
        {
            _controller = new RedirectToNewStorageController();
        }

        [TestMethod]
        public void RedirectToNewUrl_ShouldReturnHttpNotFoundCodeResult_WhenCourseIsNull()
        {
            //Act
            var result = _controller.RedirectToNewUrl(null, null);

            //Assert
            ActionResultAssert.IsHttpNotFoundActionResult(result);
        }

        [TestMethod]
        public void RedirectToNewUrl_ShouldReturnHttpNotFoundCodeResult_WhenCourseIsNotPublished()
        {
            //Act
            var result = _controller.RedirectToNewUrl(CourseObjectMother.Create(), null);

            //Assert
            ActionResultAssert.IsHttpNotFoundActionResult(result);
        }

        [TestMethod]
        public void RedirectToNewUrl_ShouldReturnHttpNotFoundCodeResult_WhenCoursePublicationUrlIsEmpty()
        {
            // Arrange 
            var course = CourseObjectMother.Create();
            course.UpdatePublicationUrl(null);

            //Act
            var result = _controller.RedirectToNewUrl(course, null);

            //Assert
            ActionResultAssert.IsHttpNotFoundActionResult(result);
        }

        [TestMethod]
        public void RedirectToNewUrl_ShouldReturnHttpNotFoundCodeResult_WhenRequestedResourceIsNotEmpty()
        {
            // Arrange 
            var course = CourseObjectMother.Create();
            course.UpdatePublicationUrl("url");

            //Act
            var result = _controller.RedirectToNewUrl(course, "some resource");

            //Assert
            ActionResultAssert.IsHttpNotFoundActionResult(result);
        }

        [TestMethod]
        public void RedirectToNewUrl_ShouldReturnRedirectResultWithPublicationUrl_ForEmptyResource()
        {
            // Arrange 
            var course = CourseObjectMother.Create();
            course.UpdatePublicationUrl("url");

            //Act
            var result = _controller.RedirectToNewUrl(course, null);

            //Assert
            ActionResultAssert.IsRedirectResult(result, course.PublicationUrl);
        }

        [TestMethod]
        public void RedirectToNewUrl_ShouldReturnRedirectResultWithPublicationUrl_ForIndexPage()
        {
            // Arrange 
            var course = CourseObjectMother.Create();
            course.UpdatePublicationUrl("url");

            //Act
            var result = _controller.RedirectToNewUrl(course, "index.html");

            //Assert
            ActionResultAssert.IsRedirectResult(result, course.PublicationUrl);
        }
    }
}
