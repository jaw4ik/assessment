using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Tests.ObjectMothers
{
    public class HelpHintObjectMother
    {
        private const string Name = "Help hint name";
        private const string CreatedBy = "username@easygenerator.com";

        public static HelpHint Create(string name = Name, string createdBy = CreatedBy)
        {
            return new HelpHint(name, createdBy);
        }

        public static HelpHint CreateWithName(string name)
        {
            return Create(name: name);
        }
    }
}
