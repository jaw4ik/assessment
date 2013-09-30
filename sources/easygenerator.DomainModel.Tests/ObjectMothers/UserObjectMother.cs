using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Tests.ObjectMothers
{
    public class UserObjectMother
    {
        private const string Email = "username@easygenerator.com";
        private const string Password = "Easy123!";
        private const string CreatedBy = "easygenerator@easygenerator.com";

        public static User CreateWithPassword(string password)
        {
            return Create(password: password);
        }

        public static User CreateWithEmail(string email)
        {
            return Create(email: email);
        }

        public static User Create(string email = Email, string password = Password, string createdBy = CreatedBy)
        {
            return new User(email, password, createdBy);
        }
    }
}
