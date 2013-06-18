using System;

namespace easygenerator.DomainModel.Entities
{
    public class User : Entity
    {
        protected internal User() { }

        protected internal User(string username, string email, string password)
        {
            Username = username;

            Email = email;
            PasswordHash = password;
        }

        public string Username { get; protected set; }
        public string Email { get; protected set; }
        private string PasswordHash { get; set; }

        
        //private void ThrowIfPasswordIsNotValid(string password)
        //{
        //    ArgumentValidation.ThrowIfNullOrEmpty(password, "password");

        //    if (password.Length < 6 || password.Length > 50)
        //        throw new ArgumentException("Password length should be between 6 and 50 symbols", "password");
        //}     
    }
}
