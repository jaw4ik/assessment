using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;

namespace easygenerator.Web.BuildExperience
{
    public class ExperienceBuilder : ExperienceBuilderBase
    {
        public ExperienceBuilder(PhysicalFileManager fileManager, BuildPathProvider buildPathProvider, BuildPackageCreator buildPackageCreator, BuildContentProvider buildContentProvider)
            : base(fileManager, buildPathProvider, buildPackageCreator, buildContentProvider)
        {

        }

        protected override void OnAfterBuildPackageCreated(Experience experience, string buildId)
        {
            experience.UpdatePackageUrl(buildId + ".zip");
        }
    }
}