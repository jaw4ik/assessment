using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities;

namespace easygenerator.Web.Publish
{
    public interface ICoursePublishingService
    {
        bool Publish(Course course);
        string GetPublishedPackageUrl(string courseId);
        string GetCourseReviewUrl(string courseId);
        string GetPublishedResourcePhysicalPath(string resourceUrl);
    }
}
