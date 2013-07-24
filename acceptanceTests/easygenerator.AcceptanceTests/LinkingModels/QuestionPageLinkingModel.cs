using OpenQA.Selenium;
using OpenQA.Selenium.Remote;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.AcceptanceTests.LinkingModels
{
    public class QuestionPageLinkingModel : ILinkingModel
    {        
        public string AnswerItem = ".//div[contains(@class,'question-answers')]//li[@class='answer-option-item']";
        public string ExplanationItem = ".//div[contains(@class,'question-explanations')]//li[@class='question-explanation-item']";
        public string CorrectAnswerIndicator = ".//span[@class='answer-correct-icon']";
        public string AnswerItemText = ".//div[@class='question-answer-text']";
        //public string AnswerItemText = ".//div[@class='question-answer-text']//textarea";        
        public string AnswerItemValue = ".//div[contains(@class,'question-answer-value')]";
        public string AnswerItemDeleteButton = ".//div[@class='question-answer-delete-wrapper']";

        public string BackToObjectiveLink = ".//a[contains(@class,'inline nav-control')]";
        public string QuestionTitle = ".//div[@class='question-header-title']";

        public string AnswerOptionsBlock = ".//div[contains(@class,'question-answers')]";
        public string ExplanationsBlock = ".//div[contains(@class,'question-explanations')]";
        public string BlockList = ".//div[@class='question-content-items-list']";
        public string ExpandAnswerOptionsButton = "//div[contains(@class,'question-answers')]//a[contains(@class,'nav-element')]";
        public string ExpandExplanationsButton = "//div[contains(@class,'question-explanations')]//a[contains(@class,'nav-element')]";

        public string NextQuestionButton = ".//a[@class='nav-element'and @title='Next']";
        public string PreviousQuestionButton = ".//a[@class='nav-element'and @title='Previous']";

        public string AddNewAnswerOptionButton = ".//div[contains(@class,'question-answers')]//li[@class='add-button']//div[@class='question-answer-text']";
        public string AnswerOptionActiveText = ".//div[contains(@class,'question-answers')]//li[contains(@class,'active')]//div[@class='question-answer-text']//p";
        //public string AnswerOptionActiveText = ".//div[contains(@class,'question-answers')]//li[contains(@class,'active')]//div[@class='question-answer-text']//textarea";        
        public string AnswerOptionActiveCorrectnessIndicator = ".//div[contains(@class,'question-answers')]//li[contains(@class,'active')]//div[@class='question-answer-value']";

        public string AddNewExplanationButton = ".//div[contains(@class,'question-explanations')]//li[@class='add-button']//div[@class='question-explanation']";
        public string ExplanationActiveText = ".//div[contains(@class,'question-explanations')]//li[contains(@class,'active')]//div[@class='question-explanation']//div";


        //      <div class="cke_editable cke_editable_inline cke_contents_ltr"
        public string Ckeditor = ".//div[contains(@class,'cke_contents_ltr')]";
    }
}
