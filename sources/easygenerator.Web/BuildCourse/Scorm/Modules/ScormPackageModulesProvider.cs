using System.Collections.Generic;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.Web.BuildCourse.Modules;
using easygenerator.Web.BuildCourse.Modules.Models;

namespace easygenerator.Web.BuildCourse.Scorm.Modules
{
    public class ScormPackageModulesProvider : PackageModulesProvider
    {
        private const string LmsModuleName = "lms";
        private const string LmsModulePath = "~/BuildCourse/Scorm/Modules/js";

        public ScormPackageModulesProvider(IUserRepository userRepository)
            : base(userRepository) { }

        public override List<PackageModule> GetModulesList(Course course)
        {
            var modulesList = base.GetModulesList(course);

            modulesList.Add(new PackageModule(LmsModuleName, LmsModulePath));

            return modulesList;
        }
    }
}