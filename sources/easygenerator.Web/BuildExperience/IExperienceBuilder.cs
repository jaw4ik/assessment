using easygenerator.Web.BuildExperience.PackageModel;

namespace easygenerator.Web.BuildExperience
{
    public interface IExperienceBuilder
    {
        bool Build(ExperiencePackageModel viewModel);
    }
}
