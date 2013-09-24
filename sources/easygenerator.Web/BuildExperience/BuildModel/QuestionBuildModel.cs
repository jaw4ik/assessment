using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace easygenerator.Web.BuildExperience.BuildModel
{
    public class QuestionBuildModel
    {
        [Required(AllowEmptyStrings = false)]
        public string Id { get; set; }

        [Required(AllowEmptyStrings = false)]
        [StringLength(255)]
        public string Title { get; set; }

        public List<AnswerOptionBuildModel> AnswerOptions { get; set; }

        public List<LearningObjectBuildModel> LearningObjects { get; set; }
    }
}
