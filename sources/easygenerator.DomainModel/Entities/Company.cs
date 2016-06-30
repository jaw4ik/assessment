using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;

namespace easygenerator.DomainModel.Entities
{
    public class Company : Entity
    {
        protected internal Company()
        {
            Users = new Collection<User>();
            CompanyCourses = new Collection<Course>();
            CompanyLearningPaths = new Collection<LearningPath>();
        }

        protected internal Company(string name, string logoUrl, string publishApiUrl, string secretKey,
            bool hideDefaultPublishOptions, short priority = 0)
        {
            Name = name;
            LogoUrl = logoUrl;
            PublishCourseApiUrl = publishApiUrl;
            SecretKey = secretKey;
            HideDefaultPublishOptions = hideDefaultPublishOptions;
            Priority = priority;

            Users = new Collection<User>();
            CompanyCourses = new Collection<Course>();
            CompanyLearningPaths = new Collection<LearningPath>();
        }

        public string Name { get; protected internal set; }

        public string LogoUrl { get; protected internal set; }

        public string PublishCourseApiUrl { get; protected internal set; }

        public string SecretKey { get; protected internal set; }

        public bool HideDefaultPublishOptions { get; private set; }

        public short Priority { get; private set; }

        protected internal virtual ICollection<User> Users { get; set; }

        protected internal virtual ICollection<Course> CompanyCourses { get; set; }

        protected internal virtual ICollection<LearningPath> CompanyLearningPaths { get; set; }
    }
}
