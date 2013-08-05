using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace easygenerator.Web.BuildExperience.PackageModel
{
    public class ObjectivePackageModel
    {
        [Required(AllowEmptyStrings = false)]
        public string Id { get; set; }

        [Required(AllowEmptyStrings = false)]
        [StringLength(255)]
        public string Title { get; set; }

        [Required]
        public string Image { get; set; }

        [Required]
        public List<QuestionPackageModel> Questions { get; set; }
    }
}
