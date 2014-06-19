using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;

namespace easygenerator.DomainModel.Tests.ObjectMothers
{
    public static class MultiplechoiceObjectMother
    {
        private const string Title = "Question title";
        private const string CreatedBy = "username@easygenerator.com";

        public static Multiplechoice CreateWithTitle(string title)
        {
            return Create(title: title);
        }

        public static Multiplechoice CreateWithCreatedBy(string createdBy)
        {
            return Create(createdBy: createdBy);
        }

        public static Multiplechoice Create(string title = Title, string createdBy = CreatedBy)
        {
            return new Multiplechoice(title, createdBy);
        }
      
    }
}
