using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Tests.ObjectMothers
{
    public class OnboardingObjectMother
    {
        private const string UserEmail = "username@easygenerator.com";
        private const bool CourseCreated = false;
        private const bool ObjectiveDefined = false;
        private const bool ContentCreated = false;
        private const int QuestionsCount = 0;
        private const bool Published = false;
        private const bool IsClosed = false;

        public static Onboarding CreateWithPublished(bool published)
        {
            return Create(published: published);
        }

        public static Onboarding CreateWithQuestionsCount(int questionsCount)
        {
            return Create(questionsCount: questionsCount);
        }

        public static Onboarding CreateWithContentCreated(bool contentCreated)
        {
            return Create(contentCreated: contentCreated);
        }

        public static Onboarding CreateWithObjectiveDefined(bool objectiveDefined)
        {
            return Create(objectiveDefined: objectiveDefined);
        }

        public static Onboarding CreateWithCourseCreated(bool courseCreated)
        {
            return Create(courseCreated: courseCreated);
        }

        public static Onboarding CreateWithClosed(bool isClosed)
        {
            return Create(isClosed: isClosed);
        }

        public static Onboarding CreateWithUserEmail(string userEmail)
        {
            return Create(userEmail: userEmail);
        }

        public static Onboarding Create(bool courseCreated = CourseCreated, bool objectiveDefined = ObjectiveDefined, bool contentCreated = ContentCreated,
            int questionsCount = QuestionsCount, bool published = Published, bool isClosed = IsClosed, string userEmail = UserEmail)
        {
            return new Onboarding(courseCreated, objectiveDefined, contentCreated, questionsCount, published, isClosed, userEmail);
        }
    }
}
