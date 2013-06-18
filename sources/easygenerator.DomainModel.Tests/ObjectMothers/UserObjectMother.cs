using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Tests.ObjectMothers
{
    class UserObjectMother
    {
        private const string Username = "Easygenerator User";
        private const string Email = "username@easygenerator.com";
        private const string Password = "abc123";

        public static User CreateWithPassword(string password)
        {
            return Create(password: password);
        }

        public static User CreateWithEmail(string email)
        {
            return Create(email: email);
        }

        public static User Create(string username = Username, string email = Email, string password = Password)
        {
            return new User(username, email, password);
        }
    }
}
