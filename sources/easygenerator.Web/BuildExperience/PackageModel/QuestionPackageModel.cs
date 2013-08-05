using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace easygenerator.Web.BuildExperience.PackageModel
{
    public class QuestionPackageModel
    {
        [Required(AllowEmptyStrings = false)]
        public string Id { get; set; }

        [Required(AllowEmptyStrings = false)]
        [StringLength(255)]
        public string Title { get; set; }

        [Required]
        public List<AnswerOptionPackageModel> Answers { get; set; }

        [Required]
        public List<ExplanationPackageModel> Explanations { get; set; }
    }
}
