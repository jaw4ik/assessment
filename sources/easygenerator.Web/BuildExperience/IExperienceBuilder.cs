using easygenerator.Web.BuildExperience.PackageModel;

namespace easygenerator.Web.BuildExperience
{
    public interface IExperienceBuilder
    {
        BuildResult Build(ExperiencePackageModel viewModel);
    }
}
