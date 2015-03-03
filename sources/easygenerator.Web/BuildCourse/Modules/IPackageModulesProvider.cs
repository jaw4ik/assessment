using System.Collections.Generic;
using easygenerator.DomainModel.Entities;
using easygenerator.Web.BuildCourse.Modules.Models;

namespace easygenerator.Web.BuildCourse.Modules
{
    public interface IPackageModulesProvider
    {
        List<PackageModule> GetModulesList(Course course);
    }
}
