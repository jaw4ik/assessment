using easygenerator.DomainModel.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace easygenerator.Web.Publish
{
    public interface ICoursePublisher
    {
        bool Publish(Course course, string destinationDirectory);
    }
}