using System.ComponentModel.DataAnnotations;

namespace easygenerator.Web.BuildExperience.BuildModel
{
    public class AnswerOptionBuildModel
    {
        [Required(AllowEmptyStrings = false)]
        public string Id { get; set; }

        [Required(AllowEmptyStrings = false)]
        [StringLength(255)]
        public string Text { get; set; }

        [Required]
        public bool IsCorrect { get; set; }
    }
}
