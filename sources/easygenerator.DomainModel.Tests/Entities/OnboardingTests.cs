using easygenerator.DomainModel.Tests.ObjectMothers;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace easygenerator.DomainModel.Tests.Entities
{
    [TestClass]
    public class OnboardingTests
    {
        private const string UserEmail = "easygenerator2@easygenerator.com";
        
        #region Constructor

        [TestMethod]
        public void Onboarding_ShouldCreateOnboarding()
        {
            var CourseCreated = false;
            var SectionCreated = false;
            var ContentCreated = false;
            var CreatedQuestionsCount = 0;
            var CoursePublished = false;
            var IsClosed = false;

            var onboarding = OnboardingObjectMother.Create(CourseCreated, SectionCreated, ContentCreated, CreatedQuestionsCount, CoursePublished, IsClosed, UserEmail);

            onboarding.CourseCreated.Should().Be(CourseCreated);
            onboarding.SectionCreated.Should().Be(SectionCreated);
            onboarding.ContentCreated.Should().Be(ContentCreated);
            onboarding.CreatedQuestionsCount.Should().Be(CreatedQuestionsCount);
            onboarding.CoursePublished.Should().Be(CoursePublished);
            onboarding.IsClosed.Should().Be(IsClosed);
            onboarding.UserEmail.Should().Be(UserEmail);
        }

        #endregion

        #region MarkCourseCreatedAsCompleted

        [TestMethod]
        public void MarkCourseCreatedAsCompleted_ShouldSetCourseCreatedToTrue()
        {
            var onboardingObject = OnboardingObjectMother.CreateWithCourseCreated(false);

            onboardingObject.MarkCourseCreatedAsCompleted();

            onboardingObject.CourseCreated.Should().BeTrue();
        }

        #endregion

        #region MarkSectionCreatedAsCompleted

        [TestMethod]
        public void MarkSectionCreatedAsCompleted_ShouldSetSectionDefinedToTrue()
        {
            var onboardingObject = OnboardingObjectMother.CreateWithSectionDefined(false);

            onboardingObject.MarkSectionCreatedAsCompleted();

            onboardingObject.SectionCreated.Should().BeTrue();
        }
        
        #endregion

        #region MarkContentCreatedAsCompleted

        [TestMethod]
        public void UpdateContentCreated_ShouldSetSectionDefinedToTrue()
        {
            var onboardingObject = OnboardingObjectMother.CreateWithContentCreated(false);

            onboardingObject.MarkContentCreatedAsCompleted();

            onboardingObject.ContentCreated.Should().BeTrue();
        }
        
        #endregion

        #region IncreaseCreatedQuestionsCount

        [TestMethod]
        public void IncreaseCreatedQuestionsCountUpdateQuestionsCount_ShouldSetSectionDefinedToTrue()
        {
            var onboardingObject = OnboardingObjectMother.CreateWithQuestionsCount(3);

            onboardingObject.IncreaseCreatedQuestionsCount();

            onboardingObject.CreatedQuestionsCount.Should().Be(4);
        }
        
        #endregion

        #region MarkCoursePublishedAsCompleted
        
        [TestMethod]
        public void UpdatePublished_ShouldSetSectionDefinedToTrue()
        {
            var onboardingObject = OnboardingObjectMother.CreateWithPublished(false);

            onboardingObject.MarkCoursePublishedAsCompleted();

            onboardingObject.CoursePublished.Should().BeTrue();
        }

        #endregion

        #region CloseOnboarding

        [TestMethod]
        public void SetOnboardingClosed_ShouldSetIsCloserToTrue()
        {
            var onboardingObject = OnboardingObjectMother.CreateWithClosed(false);

            onboardingObject.CloseOnboarding();

            onboardingObject.IsClosed.Should().BeTrue();
        }

        #endregion
    }
}
