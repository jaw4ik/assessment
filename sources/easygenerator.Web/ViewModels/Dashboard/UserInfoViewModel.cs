using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace easygenerator.Web.ViewModels.Dashboard
{
    public class UserInfoViewModel
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Role { get; set; }
        public string Country { get; set; }
        public string AccessType { get; set; }
        public DateTime? ExpirationDate { get; set; }
        public string Phone { get; set; }
        public DateTime CreatedOn { get; set; }
        public IEnumerable<CourseViewModel> Courses { get; set; } = new List<CourseViewModel>();
    }
}