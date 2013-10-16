using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.Web.ViewModels.Account
{
    public class UserSignUpViewModel
    {
        public string Email { get; set; }
        public string Password { get; set; }

        public string FullName { get; set; }
        public string Phone { get; set; }
        public string Organization { get; set; }

        public string PeopleBusyWithCousreDevelopmentAmount { get; set; }
        public string NeedAuthoringTool { get; set; }
        public string UsedAuthoringTool { get; set; }
    }
}
