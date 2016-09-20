using easygenerator.DomainModel.Entities.Questions;
using System.Collections.Generic;

namespace easygenerator.Web.BuildCourse.PackageModel
{
    public class DragAndDropTextPackageModel : QuestionPackageModel
    {
        public override string Type => Question.QuestionTypes.DragAndDropText;

        public string Background { get; set; }
        public List<DropspotPackageModel> Dropspots { get; set; }
    }
}