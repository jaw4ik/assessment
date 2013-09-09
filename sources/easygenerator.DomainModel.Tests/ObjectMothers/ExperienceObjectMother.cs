using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Tests.ObjectMothers
{
    public class ExperienceObjectMother
    {
        private const string Title = "Experience title";
        private const string CreatedBy = "Username";

        public static Experience CreateWithTitle(string title)
        {
            return Create(title: title);
        }

        public static Experience Create(string title = Title)
        {
            return new Experience(title);
        }
    }
}
