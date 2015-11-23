using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace easygenerator.Web.ViewModels.Dashboard
{
    public class UserSearchViewModel
    {
        public string Email { get; set; }
        public UserInfoViewModel User { get; set; }
    }
}