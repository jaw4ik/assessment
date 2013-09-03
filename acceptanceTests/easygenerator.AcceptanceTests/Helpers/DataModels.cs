using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.AcceptanceTests.Helpers
{
    public class Root
    {
        [JsonProperty("objectives")]
        public List<Objective> Objectives { get; set; }
        [JsonProperty("experiences")]
        public List<Experience> Experiences { get; set; }
    }
    public class Objective
    {
        [JsonProperty("id")]
        public string Id { get; set; }
        [JsonProperty("title")]
        public string Title { get; set; }
        [JsonProperty("image")]
        public string ImageSource { get; set; }
        [JsonProperty("createdOn")]
        public string CreatedOn { get; set; }
        [JsonProperty("modifiedOn")]
        public string ModifiedOn { get; set; }
        [JsonProperty("questions")]
        public List<Question> Questions { get; set; }

    }
    public class Question
    {
        [JsonProperty("id")]
        public string Id { get; set; }
        [JsonProperty("title")]
        public string Title { get; set; }
        [JsonProperty("createdOn")]
        public string CreatedOn { get; set; }
        [JsonProperty("modifiedOn")]
        public string ModifiedOn { get; set; }
        [JsonProperty("answerOptions")]
        public List<AnswerOption> AnswerOptions { get; set; }
        [JsonProperty("explanations")]
        public List<Explanation> Explanations { get; set; }
    }
    public class AnswerOption
    {
        [JsonProperty("id")]
        public string Id { get; set; }
        [JsonProperty("isCorrect")]
        public bool IsCorrect { get; set; }
        [JsonProperty("text")]
        public string Text { get; set; }
    }
    public class Explanation
    {
        [JsonProperty("id")]
        public string Id { get; set; }
        [JsonProperty("text")]
        public string Text { get; set; }
    }
    public class Experience
    {
        [JsonProperty("id")]
        public int Id { get; set; }
        [JsonProperty("title")]
        public string Title { get; set; }
        [JsonProperty("createdOn")]
        public string CreatedOn { get; set; }
        [JsonProperty("modifiedOn")]
        public string ModifiedOn { get; set; }
        [JsonProperty("builtOn")]
        public string BuiltOn { get; set; }
        [JsonProperty("objectives")]
        public List<string> Objectives { get; set; }
        [JsonProperty("packageUrl")]
        public string PackageUrl { get; set; }        
    }

}
