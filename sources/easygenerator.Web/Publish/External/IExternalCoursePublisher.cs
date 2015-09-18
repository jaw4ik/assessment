using easygenerator.DomainModel.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace easygenerator.Web.Publish.External
{
    public interface IExternalCoursePublisher
    {
        bool PublishCourseUrl(Course course, Company company, string userEmail);
    }
}