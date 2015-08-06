using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Tests.ObjectMothers
{
    public class UserObjectMother
    {
        private const string Email = "username@easygenerator.com";
        private const string Password = "Easy123!";
        private const string CreatedBy = "easygenerator@easygenerator.com";
        private const string FirstName = "easygenerator user firstname";
        private const string LastName = "easygenerator user lastname";
        private const string Phone = "+3801234567";
        private const string Country = "Ukraine";
        private const string Role = "Teacher";
        private const string Organization = "Easygenerator";

        public static User CreateWithPassword(string password)
        {
            return Create(password: password);
        }

        public static User CreateWithEmail(string email)
        {
            return Create(email: email);
        }

        public static User CreateWithLastName(string lastname)
        {
            return Create(lastname: lastname);
        }

        public static User CreateWithFirstName(string firstname)
        {
            return Create(firstname: firstname);
        }

        public static User CreateWithPhone(string phone)
        {
            return Create(phone: phone);
        }

        public static User CreateWithCountry(string country)
        {
            return Create(country: country);
        }

        public static User Create(string email = Email, string password = Password, string firstname = FirstName, string lastname = LastName, string phone = Phone,
            string country = Country, string role = Role, string createdBy = CreatedBy)
        {
            return new User(email, password, firstname, lastname, phone, country, role, createdBy, AccessType.Trial);
        }
    }
}
