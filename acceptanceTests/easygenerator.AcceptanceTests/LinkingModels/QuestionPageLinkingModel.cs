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
        public string AnswerItem = ".//div[contains(@class,'question-content-items-list')]//li[contains(@class,'answer-option-item')]";
        public string ExplanationItem = ".//div[contains(@class,'question-learning-objects')]//li[contains(@class,'question-learning-object-item')]";
        public string CorrectAnswerIndicator = ".//span[@class='answer-correct-icon']";
        //public string AnswerItemText = ".//div[contains(@class,'question-answer-text')]";
        public string AnswerItemText = ".//div[contains(@class,'question-answer-text')]//div[contains(@class,'editarea-editable-text')]";
        public string ExplanationItemText = ".//div[contains(@class,'question-learning-object')]";
        public string AnswerItemValue = ".//div[contains(@class,'question-answer-value')]";
        public string AnswerItemDeleteButton = ".//div[@class='question-answer-delete-wrapper']";
        public string ExplanationDeleteButton = ".//div[@class='question-learning-object-delete-wrapper']";

        public string BackToObjectiveLink = "//div[contains(@class,'nav-control') and contains(@class,'flexible')]//div[contains(@class,'nav-element')]";
        public string BackToObjectiveText = "//div[contains(@class,'nav-control') and contains(@class,'flexible')]//span[contains(@class,'nav-element')]";

        public string QuestionTitle = ".//section[contains(@class,'question')]//header[contains(@class,'view-header')]//div[contains(@class,'view-header-title-text')]";

        public string AnswerOptionsBlock = ".//div[contains(@class,'question-content-items-list')]";
        public string ExplanationsBlock = ".//div[contains(@class,'question-learning-objects')]";
        public string BlockList = ".//div[@class='question-content-items-list']";
        public string ExpandAnswerOptionsButton = "//div[contains(@class,'question-answers')]//span[contains(@class,'nav-element')]";
        public string ExpandExplanationsButton = "//div[contains(@class,'question-learning-objects')]//span[contains(@class,'nav-element')]";

        public string NextQuestionButton = ".//header[contains(@class,'view-header')]//a[contains(@class,'view-header-nav-btn next')]";
        public string PreviousQuestionButton = ".//header[contains(@class,'view-header')]//a[contains(@class,'view-header-nav-btn previous')]";

        public string AddNewAnswerOptionButton = ".//div[contains(@class,'question-content-items-list')]//li[@class='add-button']//div[@class='question-answer-text']";
        //public string AnswerOptionActiveText = ".//div[contains(@class,'question-answers')]//li[contains(@class,'active')]//div[@class='question-answer-text']//p";
        public string AnswerOptionActiveText = ".//div[contains(@class,'question-answers')]//li[contains(@class,'active')]//div[contains(@class,'question-answer-text')]//div[contains(@class,'editarea-editable-text')]";
        public string AnswerOptionActiveCorrectnessIndicator = ".//div[contains(@class,'question-answers')]//li[contains(@class,'active')]//div[@class='question-answer-value']";

        public string AddNewExplanationButton = ".//div[contains(@class,'question-learning-objects')]//li[@class='add-button']//div[contains(@class,'question-learning-object')]";
        //public string ExplanationActiveText = ".//div[contains(@class,'question-explanations')]//li[contains(@class,'active')]//div[contains(@class,'question-explanation')]//div[contains(@class,'cke_contents_ltr')]";
        public string ExplanationActiveText = ".//div[contains(@class,'question-learning-objects')]//li[contains(@class,'active')]//div[contains(@class,'cke_contents_ltr')]";

        //      <div class="cke_editable cke_editable_inline cke_contents_ltr"
        public string Ckeditor = ".//div[contains(@class,'cke_contents_ltr')]";

        //CUD Question

        public string CreateNewQuestionButton = ".//div[contains(@class,'create-question-image')]";
        public string CreateNewQuestionText = ".//div[contains(@class,'pull-right')]//span";

        public string CharsCounter = ".//div[contains(@class,'view-header-title')]//div[contains(@class,'chars-counter')]";        
        public string CharsCount = ".//div[contains(@class,'text-block')]//div[contains(@class,'chars-counter')]//span";
        
    }
}