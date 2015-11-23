using System;
using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Tests.ObjectMothers
{
    public class CompanyObjectMother
    {
        public static Company Company(string publishCourseApiUrl, string key)
        {
            return new Company() { PublishCourseApiUrl = publishCourseApiUrl, SecretKey = key };
        }
    }
}
