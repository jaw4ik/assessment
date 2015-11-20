﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.DomainModel.Entities
{
    public class Company : Entity
    {
        public Company() { }

        public Company(string name, string logoUrl, string publishApiUrl, string secretKey,
            bool hideDefaultPublishOptions)
        {
            Name = name;
            LogoUrl = logoUrl;
            PublishCourseApiUrl = publishApiUrl;
            SecretKey = secretKey;
            HideDefaultPublishOptions = hideDefaultPublishOptions;
        }

        public string Name { get; private set; }

        public string LogoUrl { get; private set; }

        public string PublishCourseApiUrl { get; private set; }

        public string SecretKey { get; private set; }

        public bool HideDefaultPublishOptions { get; private set; }

        public virtual ICollection<User> Users { get; set; }
    }
}
