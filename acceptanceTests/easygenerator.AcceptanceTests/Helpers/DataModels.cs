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
        public List<Expirience> Expiriences { get; set; }
    }
    public class Objective
    {
        [JsonProperty("id")]
        public int Id { get; set; }
        [JsonProperty("title")]
        public string Title { get; set; }
        [JsonProperty("image")]
        public string ImageSource { get; set; }
        [JsonProperty("questions")]
        public List<Question> Questions { get; set; }

    }
    public class Question
    {
        [JsonProperty("id")]
        public int Id { get; set; }
        [JsonProperty("title")]
        public string Title { get; set; }
        [JsonProperty("answerOptions")]
        public List<AnswerOption> AnswerOptions { get; set; }
        [JsonProperty("explanations")]
        public List<string> Explanations { get; set; }
    }
    public class AnswerOption
    {
        [JsonProperty("isCorrect")]
        public bool IsCorrect { get; set; }
        [JsonProperty("text")]
        public string Text { get; set; }

    }
    public class Expirience
    {
        [JsonProperty("id")]
        public int Id { get; set; }
        [JsonProperty("title")]
        public string Title { get; set; }
    }

}
