using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace easygenerator.Web.Publish
{
    public interface IPublishDispatcher
    {
        void StartPublish(string courseId);
        void EndPublish(string courseId);
        bool IsPublishing(string courseId);
    }
}