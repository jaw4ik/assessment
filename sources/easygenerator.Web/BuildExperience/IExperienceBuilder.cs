using easygenerator.Web.BuildExperience.BuildModel;

namespace easygenerator.Web.BuildExperience
{
    public interface IExperienceBuilder
    {
        bool Build(ExperienceBuildModel viewModel);
    }
}
