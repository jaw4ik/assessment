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

        public string Name { get; protected internal set; }

        public string LogoUrl { get; protected internal set; }

        public string PublishCourseApiUrl { get; protected internal set; }

        public string SecretKey { get; protected internal set; }

        public virtual ICollection<User> Users { get; protected internal set; }
    }
}
