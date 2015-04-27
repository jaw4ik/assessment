using easygenerator.DomainModel.Entities.Questions;

namespace easygenerator.DomainModel.Tests.ObjectMothers
{
    public static class SingleSelectTextObjectMother
    {
        private const string Title = "Question title";
        private const string CreatedBy = "username@easygenerator.com";

        public static SingleSelectText CreateWithTitle(string title)
        {
            return Create(title: title);
        }

        public static SingleSelectText CreateWithCreatedBy(string createdBy)
        {
            return Create(createdBy: createdBy);
        }

        public static SingleSelectText Create(string title = Title, string createdBy = CreatedBy)
        {
            return new SingleSelectText(title, createdBy);
        }
      
    }
}
