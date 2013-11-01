using easygenerator.DomainModel.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace easygenerator.Web.Publish
{
    public interface IExperiencePublisher
    {
        bool Publish(Experience experience);
        string GetPublishedPackageUrl(string experienceId);
        string GetPublishedResourcePhysicalPath(string resourceUrl);
    }
}