using easygenerator.DomainModel.Entities;
using easygenerator.Web.BuildCourse.Modules.Models;
using System.Collections.Generic;

namespace easygenerator.Web.BuildCourse
{
    public interface ICourseContentProvider
    {
        void AddBuildContentToPackageDirectory(string buildDirectory, Course course, IEnumerable<PackageModule> modules);
        void AddSettingsFileToPackageDirectory(string buildDirectory, string settings);
    }
}
