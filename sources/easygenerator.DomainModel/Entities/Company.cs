using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.DomainModel.Entities
{
    public class Company : Entity
    {
        public Company() { }

        public string Name { get; private set; }

        public string LogoUrl { get; private set; }

        public string PublishCourseApiUrl { get; private set; }

        public string SecretKey { get; private set; }

        public virtual ICollection<User> Users { get; set; }
    }
}
