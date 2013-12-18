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
        public string AnswerItem = ".//div[contains(@class,'question-answers')]//li[contains(@class,'answer-option-item')]";
        public string ExplanationItem = ".//div[contains(@class,'question-content-block learning-content')]//div[contains(@class,'question-learning-content-list-item')]";
        public string CorrectAnswerIndicator = ".//span[@class='answer-correct-icon']";
        //public string AnswerItemText = ".//div[contains(@class,'question-answer-text')]";
        public string AnswerItemText = ".//div[contains(@class,'question-answer-text')]//div[contains(@class,'editarea-editable-text')]";
        public string ExplanationItemText = ".//div[contains(@class,'question-learning-content selectable cke_editable')]";
        public string AnswerItemValue = ".//div[contains(@class,'question-answer-value')]";
        public string AnswerItemDeleteButton = ".//div[@class='question-answer-delete-wrapper']";
        public string ExplanationDeleteButton = ".//div[@class='question-learning-content-delete-wrapper']";

        public string BackToObjectiveLink = "//div[contains(@class,'nav-control') and contains(@class,'flexible')]//div[contains(@class,'nav-element')]";
        public string BackToObjectiveText = "//div[contains(@class,'nav-control') and contains(@class,'flexible')]//span[contains(@class,'nav-element')]";

        public string QuestionTitle = ".//section[contains(@class,'question')]//header[contains(@class,'view-header')]//div[contains(@class,'view-header-title')]//div[contains(@class,'edit-field')]";

        public string AnswerOptionsBlock = ".//div[contains(@class,'question-answers')]";
        public string ExplanationsBlock = ".//div[contains(@class,'question-content-block learning-content')]";
        public string BlockList = ".//div[@class='question-content-items-list']";
        public string ExpandAnswerOptionsButton = "//div[contains(@class,'question-answers')]//div[contains(@class,'question-content-block-header-wrapper')]";
        public string ExpandExplanationsButton = "//div[contains(@class,'question-content-block learning-content')]//div[contains(@class,'question-content-block-header-wrapper')]";

        public string NextQuestionButton = ".//header[contains(@class,'view-header')]//a[contains(@class,'view-header-nav-btn next')]";
        public string PreviousQuestionButton = ".//header[contains(@class,'view-header')]//a[contains(@class,'view-header-nav-btn previous')]";

        public string AddNewAnswerOptionButton = ".//div[contains(@class,'question-answers')]//div[@class='add-button']//div[@class='add-button-text-wrapper']";
        //public string AnswerOptionActiveText = ".//div[contains(@class,'question-answers')]//li[contains(@class,'active')]//div[@class='question-answer-text']//p";
        public string AnswerOptionActiveText = ".//div[contains(@class,'question-answers')]//li[contains(@class,'active')]//div[contains(@class,'question-answer-text')]//div[contains(@class,'editarea-editable-text')]";
        public string AnswerOptionActiveCorrectnessIndicator = ".//div[contains(@class,'question-answers')]//li[contains(@class,'active')]//div[@class='question-answer-value']";

        public string AddNewExplanationButton = ".//div[contains(@class,'question-content-block learning-content')]//div[@class='add-button']//div[contains(@class,'add-button-text-wrapper')]";
        //public string ExplanationActiveText = ".//div[contains(@class,'question-explanations')]//li[contains(@class,'active')]//div[contains(@class,'question-explanation')]//div[contains(@class,'cke_contents_ltr')]";
        public string ExplanationActiveText = ".//div[contains(@class,'question-content-block learning-content')]//div[contains(@class,'active')]//div[contains(@class,'cke_contents_ltr')]";

        //      <div class="cke_editable cke_editable_inline cke_contents_ltr"
        public string Ckeditor = ".//div[contains(@class,'cke_contents_ltr')]";

        //CUD Question

        public string CreateNewQuestionButton = ".//div[contains(@class,'create-question-image')]";
        public string CreateNewQuestionText = ".//div[contains(@class,'create-question-from-question-view pull-right')]//span";

        public string CharsCounter = ".//div[contains(@class,'chars-counter')]";        
        public string CharsCount = ".//div[contains(@class,'chars-counter')]//span[1]";
        public string MaxCharsCount = ".//div[contains(@class,'chars-counter')]//span[2]";

        public string HomeLink = ".//a[contains(@class,'header-logo')]";
        
    }
}