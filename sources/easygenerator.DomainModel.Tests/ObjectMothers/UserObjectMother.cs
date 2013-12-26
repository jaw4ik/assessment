using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Tests.ObjectMothers
{
    public class UserObjectMother
    {
        private const string Email = "username@easygenerator.com";
        private const string Password = "Easy123!";
        private const string CreatedBy = "easygenerator@easygenerator.com";
        private const string FullName = "easygenerator user";
        private const string Phone = "+3801234567";
        private const string Country = "Ukraine";
        private const string Organization = "Easygenerator";

        public static User CreateWithPassword(string password)
        {
            return Create(password: password);
        }

        public static User CreateWithEmail(string email)
        {
            return Create(email: email);
        }

        public static User CreateWithFullName(string fullname)
        {
            return Create(fullname: fullname);
        }

        public static User CreateWithPhone(string phone)
        {
            return Create(phone: phone);
        }

        public static User CreateWithCountry(string country)
        {
            return Create(country: country);
        }

        public static User CreateWithOrganization(string organization)
        {
            return Create(oraganization: organization);
        }

        public static User Create(string email = Email, string password = Password, string fullname = FullName, string phone = Phone,
            string oraganization = Organization, string country = Country, string createdBy = CreatedBy)
        {
            return new User(email, password, fullname, phone, oraganization, country, createdBy, new UserSettings(createdBy, true));
        }
    }
}
