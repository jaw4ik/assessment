using easygenerator.DomainModel.Entities;
using easygenerator.Web.BuildCourse.Modules.Models;
using System.Collections.Generic;

namespace easygenerator.Web.BuildCourse
{
    public interface IBuildContentProvider
    {
        void AddBuildContentToPackageDirectory(string buildDirectory, Course course, IEnumerable<PackageModule> modules);
    }
}
