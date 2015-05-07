using System;
using System.Security.Principal;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using easygenerator.Web.Controllers.Api;
using easygenerator.Web.Tests.Utils;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;

namespace easygenerator.Web.Tests.Controllers.Api
{
    [TestClass]
    public class OnboardingControllerTests
    {
        private IOnboardingRepository _onboardingRepository;
        private OnboardingController _controller;

        IPrincipal _onboarding;
        HttpContextBase _context;

        private readonly DateTime CurrentDate = new DateTime(2014, 3, 19);
        [TestInitialize]
        public void InitializeContext()
        {
            _onboardingRepository = Substitute.For<IOnboardingRepository>();

            _controller = new OnboardingController(_onboardingRepository);

            _onboarding = Substitute.For<IPrincipal>();
            _context = Substitute.For<HttpContextBase>();
            _context.User.Returns(_onboarding);

            _controller.ControllerContext = new ControllerContext(_context, new RouteData(), _controller);
            DateTimeWrapper.Now = () => CurrentDate;
        }

        #region GetOnboardingStates

        [TestMethod]
        public void GetOnboardingStates_ShouldReturnEmptyObject_WhenUserIsNull()
        {
            _onboardingRepository.GetByUserEmail(Arg.Any<string>()).Returns((Onboarding)null);

            var result = _controller.GetOnboardingStates();

            result.Should().BeJsonSuccessResult();
        }

        [TestMethod]
        public void GetOnbordingStates_ShouldReturnIsClosed_WhenOnboardingIsClosed()
        {
            var onboarding = OnboardingObjectMother.CreateWithClosed(true);
            _onboardingRepository.GetByUserEmail(Arg.Any<string>()).Returns(onboarding);

            var result = _controller.GetOnboardingStates();

            result.Should().BeJsonSuccessResult().And.Data.ShouldBeSimilar(new
            {
                isClosed = onboarding.IsClosed
            });
        }

        [TestMethod]
        public void GetOnboardingStates_ShouldReturnJsonDataResult()
        {
            var onboarding = OnboardingObjectMother.Create();
            _onboardingRepository.GetByUserEmail(Arg.Any<string>()).Returns(onboarding);

            var result = _controller.GetOnboardingStates();

            result.Should().BeJsonSuccessResult();
        }

        #endregion

        #region CourseCreated

        [TestMethod]
        public void CourseCreated_ShouldReturnEmptyObject_WhenUserIsNull()
        {
            _onboardingRepository.GetByUserEmail(Arg.Any<string>()).Returns((Onboarding)null);

            var result = _controller.CourseCreated();

            result.Should().BeJsonErrorResult().And.Message.Should().Be(String.Empty);
        }

        [TestMethod]
        public void CourseCreated_ShouldSetCourseCreatedToTrue()
        {
            var onboarding = OnboardingObjectMother.Create();
            _onboardingRepository.GetByUserEmail(Arg.Any<string>()).Returns(onboarding);

            _controller.CourseCreated();

            onboarding.CourseCreated.Should().BeTrue();
        }

        #endregion

        #region ObjetiveCreated

        [TestMethod]
        public void ObjetiveCreated_ShouldReturnEmptyObject_WhenUserIsNull()
        {
            _onboardingRepository.GetByUserEmail(Arg.Any<string>()).Returns((Onboarding)null);

            var result = _controller.ObjetiveCreated();

            result.Should().BeJsonErrorResult().And.Message.Should().Be(String.Empty);
        }

        [TestMethod]
        public void ObjetiveCreated_ShouldSetObjectivedefinedToTrue()
        {
            var onboarding = OnboardingObjectMother.Create();
            _onboardingRepository.GetByUserEmail(Arg.Any<string>()).Returns(onboarding);

            _controller.ObjetiveCreated();

            onboarding.ObjectiveCreated.Should().BeTrue();
        }

        #endregion

        #region ContentCreated

        [TestMethod]
        public void ContentCreated_ShouldReturnEmptyObject_WhenUserIsNull()
        {
            _onboardingRepository.GetByUserEmail(Arg.Any<string>()).Returns((Onboarding)null);

            var result = _controller.ContentCreated();

            result.Should().BeJsonErrorResult().And.Message.Should().Be(String.Empty);
        }

        [TestMethod]
        public void ContentCreated_ShouldSetContentCreatedToTrue()
        {
            var onboarding = OnboardingObjectMother.Create();
            _onboardingRepository.GetByUserEmail(Arg.Any<string>()).Returns(onboarding);

            _controller.ContentCreated();

            onboarding.ContentCreated.Should().BeTrue();
        }

        #endregion

        #region QuestionCreated

        [TestMethod]
        public void QuestionCreated_ShouldReturnEmptyObject_WhenUserIsNull()
        {
            _onboardingRepository.GetByUserEmail(Arg.Any<string>()).Returns((Onboarding)null);

            var result = _controller.QuestionCreated();

            result.Should().BeJsonErrorResult().And.Message.Should().Be(String.Empty);
        }

        [TestMethod]
        public void QuestionCreated_ShouldIncreaseQuestionsCount()
        {
            var onboarding = OnboardingObjectMother.Create();
            _onboardingRepository.GetByUserEmail(Arg.Any<string>()).Returns(onboarding);

            _controller.QuestionCreated();

            onboarding.CreatedQuestionsCount.Should().Be(1);
        }

        #endregion

        #region CoursePublished

        [TestMethod]
        public void CoursePublished_ShouldReturnEmptyObject_WhenUserIsNull()
        {
            _onboardingRepository.GetByUserEmail(Arg.Any<string>()).Returns((Onboarding)null);

            var result = _controller.CoursePublished();

            result.Should().BeJsonErrorResult().And.Message.Should().Be(String.Empty);
        }

        [TestMethod]
        public void CoursePublished_ShouldSetPublishedToTrue()
        {
            var onboarding = OnboardingObjectMother.Create();
            _onboardingRepository.GetByUserEmail(Arg.Any<string>()).Returns(onboarding);

            _controller.CoursePublished();

            onboarding.CoursePublished.Should().BeTrue();
        }

        #endregion

        #region Close

        [TestMethod]
        public void Close_ShouldReturnEmptyObject_WhenUserIsNull()
        {
            _onboardingRepository.GetByUserEmail(Arg.Any<string>()).Returns((Onboarding)null);

            var result = _controller.Close();

            result.Should().BeJsonErrorResult().And.Message.Should().Be(String.Empty);
        }

        [TestMethod]
        public void Close_ShouldSetIsCloseToTrue()
        {
            var onboarding = OnboardingObjectMother.Create();
            _onboardingRepository.GetByUserEmail(Arg.Any<string>()).Returns(onboarding);

            _controller.Close();

            onboarding.IsClosed.Should().BeTrue();
        }

        #endregion
    }
}
