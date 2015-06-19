
using easygenerator.DomainModel.Entities;
namespace easygenerator.DomainModel.Tests.ObjectMothers
{
    public class LearningPathObjectMother
    {
        private const string Title = "Learning path title";
        private const string CreatedBy = "username@easygenerator.com";

        public static LearningPath CreateWithTitle(string title)
        {
            return Create(title: title);
        }

        public static LearningPath CreateWithCreatedBy(string createdBy)
        {
            return Create(createdBy: createdBy);
        }

        public static LearningPath Create(string title = Title, string createdBy = CreatedBy)
        {
            return new LearningPath(title, createdBy);
        }
    }
}
