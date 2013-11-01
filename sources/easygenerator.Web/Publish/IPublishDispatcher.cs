using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace easygenerator.Web.Publish
{
    public interface IPublishDispatcher
    {
        void StartPublish(string experienceId);
        void EndPublish(string experienceId);
        bool IsPublishing(string experienceId);
    }
}