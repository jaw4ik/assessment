using System.Collections.Generic;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;
using Newtonsoft.Json;

namespace easygenerator.Web.BuildCourse.PackageModel
{
    public abstract class QuestionPackageModel
    {
        public string Id { get; set; }
        public string Title { get; set; }

        [JsonIgnore]
        public string Content { get; set; }
        public bool HasContent { get; set; }
        
        public abstract string Type { get; }
        
        public List<LearningContentPackageModel> LearningContents { get; set; }

        [JsonIgnore]
        public Feedback Feedback { get; set; }
        public bool HasCorrectFeedback { get; set; }
        public bool HasIncorrectFeedback { get; set; }
        public bool HasGeneralFeedback { get; set; }
    }
}
