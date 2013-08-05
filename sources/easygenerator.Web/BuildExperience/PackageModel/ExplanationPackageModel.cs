using System.ComponentModel.DataAnnotations;

namespace easygenerator.Web.BuildExperience.PackageModel
{
    public class ExplanationPackageModel
    {
        [Required(AllowEmptyStrings = false)]
        public string Id { get; set; }
    }
}
