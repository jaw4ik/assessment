using System.Collections.Generic;
using easygenerator.DomainModel.Entities;
using easygenerator.Web.BuildCourse.Modules.Models;
using easygenerator.Web.BuildCourse.PackageModel;

namespace easygenerator.Web.BuildCourse
{
    public interface ICourseContentProvider
    {
        void AddBuildContentToPackageDirectory(string buildDirectory, Course course, bool equip);
        void AddSettingsFileToPackageDirectory(string buildDirectory, string settings);
        void AddPublishSettingsFileToPackageDirectory(string buildDirectory, string publishSettings);
        void AddModulesFilesToPackageDirectory(string buildDirectory, IEnumerable<PackageModule> modules);
    }
}
