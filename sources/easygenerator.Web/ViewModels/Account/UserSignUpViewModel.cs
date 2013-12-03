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

        public string FullName { get; set; }
        public string Phone { get; set; }
        public string Organization { get; set; }
        public string Country { get; set; }

        public string PeopleBusyWithCourseDevelopmentAmount { get; set; }
        public string NeedAuthoringTool { get; set; }
        public string UsedAuthoringTool { get; set; }
    }
}