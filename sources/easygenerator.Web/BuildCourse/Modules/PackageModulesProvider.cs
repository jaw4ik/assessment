using System.Collections.Generic;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.Web.BuildCourse.Modules.Models;

namespace easygenerator.Web.BuildCourse.Modules
{
    public class PackageModulesProvider : IPackageModulesProvider
    {
        private const string BrandingModuleName = "branding";
        private const string BrandingModulePath = "~/BuildCourse/Modules/js";
        
        private readonly IUserRepository _userRepository;

        public PackageModulesProvider(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public virtual List<PackageModule> GetModulesList(Course course)
        {
            var modulesList = new List<PackageModule>();

            var user = _userRepository.GetUserByEmail(course.CreatedBy);
            if (user != null && user.IsFreeAccess())
            {
                modulesList.Add(new PackageModule(BrandingModuleName, BrandingModulePath));
            }

            return modulesList;
        }
    }
}