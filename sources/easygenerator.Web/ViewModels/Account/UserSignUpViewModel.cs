using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace easygenerator.Web.ViewModels.Account
{
    public class UserSignUpViewModel
    {
        public string Email { get; set; }
        public string Password { get; set; }

        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Phone { get; set; }
        public string Country { get; set; }

        public string UserRole { get; set; }
    }
}