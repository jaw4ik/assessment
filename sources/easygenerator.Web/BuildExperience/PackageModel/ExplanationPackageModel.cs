using System.Web.Script.Serialization;

namespace easygenerator.Web.BuildExperience.PackageModel
{
    public class ExplanationPackageModel
    {
        public string Id { get; set; }

        [ScriptIgnore]
        public string Text { get; set; }
    }
}
