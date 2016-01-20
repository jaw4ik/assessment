namespace easygenerator.Web.BuildLearningPath.PackageModel
{
    public interface ILearningPathEntityPackageModel
    {
        LearningPathEntityType Type { get; set; }
        string Title { get; set; }
        string Link { get; set; }
    }
}