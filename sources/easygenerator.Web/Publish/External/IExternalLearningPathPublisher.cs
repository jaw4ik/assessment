using easygenerator.DomainModel.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace easygenerator.Web.Publish.External
{
    public interface IExternalLearningPathPublisher
    {
        bool Publish(LearningPath learningPath, Company company, string userEmail);
    }
}