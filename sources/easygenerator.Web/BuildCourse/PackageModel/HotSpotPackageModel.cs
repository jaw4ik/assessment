using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using easygenerator.DomainModel.Entities.Questions;
using Newtonsoft.Json;

namespace easygenerator.Web.BuildCourse.PackageModel
{
    public class HotSpotPackageModel : QuestionPackageModel
    {
        public override string Type
        {
            get { return Question.QuestionTypes.HotSpot; }
        }

        public string Background { get; set; }
        public bool IsMultiple { get; set; }
        public List<dynamic> Spots { get; set; }
    }
}