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
        public Company(string name, string logoUrl, string publishApiUrl, string secretKey,
            bool hideDefaultPublishOptions)
        {
            Name = name;
            LogoUrl = logoUrl;
            PublishCourseApiUrl = publishApiUrl;
            SecretKey = secretKey;
            HideDefaultPublishOptions = hideDefaultPublishOptions;
        }

        public string LogoUrl { get; protected internal set; }

        public string PublishCourseApiUrl { get; protected internal set; }

        public string SecretKey { get; protected internal set; }

        public bool HideDefaultPublishOptions { get; private set; }

        public virtual ICollection<User> Users { get; protected internal set; }
    }
}
