using easygenerator.AcceptanceTests.LinkingModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.AcceptanceTests.Helpers;
using OpenQA.Selenium;
using OpenQA.Selenium.Remote;

namespace easygenerator.AcceptanceTests.ElementObjects
{
    public class QuestionPage : BasePageElement<QuestionPageLinkingModel>
    {
        public QuestionPage() { }

        public string BackToObjectiveLinkText
        {
            get
            {
                var el = GetByXPath(model.BackToObjectiveLink);
                return el.GetTextContent();
            }
        }

        public string QuestionTitle
        {
            get
            {
                var el = GetByXPath(model.QuestionTitle);
                return el.GetTextContent();
            }
        }

        public AnswerItem[] AnswerItems
        {
            get
            {
                var items = GetAllByXPath(model.AnswerItem);
                return items.Select(it => new AnswerItem(it)).ToArray();
            }
        }

        public AnswerItem AnswerItemByText(string text)
        {
            return AnswerItems.First(it => it.Text == text);
        }

        public ExplanationItem[] ExplanationItems
        {
            get
            {
                var items = GetAllByXPath(model.ExplanationItem);
                return items.Select(it => new ExplanationItem(it)).ToArray();
            }
        }

        public ExplanationItem ExplanationItemByText(string text)
        {
            return ExplanationItems.First(it => it.Explanation == text);
        }

        public bool AnswersBlockIsExpanded
        {
            get
            {
                var el = GetByXPath(model.AnswerOptionsBlock);
                var children = el.FindElementsByXPath(model.BlockList);
                return children.Count == 1 &&
                    children[0].Displayed;
            }
        }

        public bool ExplanationsBlockIsExpanded
        {
            get
            {
                var el = GetByXPath(model.ExplanationsBlock);
                var children = el.FindElementsByXPath(model.BlockList);
                return children.Count == 1 &&
                    children[0].Displayed;
            }
        }

        internal void NavigateBackToObjective()
        {
            var link = GetByXPath(model.BackToObjectiveLink);
            link.Click();
        }

        internal void NavigateToNextQuestion()
        {
            var link = GetByXPath(model.NextQuestionButton);
            link.Click();
            //System.Threading.Thread.Sleep(1000);
        }

        internal void NavigateToPreviousQuestion()
        {
            var link = GetByXPath(model.PreviousQuestionButton);
            link.Click();
            //System.Threading.Thread.Sleep(1000);

        }

        internal bool IsNextButtonEnabled()
        {
            return base.ExistsOnPage(model.NextQuestionButton);
        }

        internal bool IsPreviousButtonEnabled()
        {
            return base.ExistsOnPage(model.PreviousQuestionButton);
        }


        internal void ToggleAnswerOptions()
        {
            var button = GetByXPath(model.ExpandAnswerOptionsButton);
            button.Click();
        }

        internal void ToggleExplanations()
        {
            var button = GetByXPath(model.ExpandExplanationsButton);
            button.Click();
        }


        internal void AddNewAnswerOptionButtonClick()
        {
            var button = GetByXPath(model.AddNewAnswerOptionButton);
            button.Click();
        }

        internal void AddNewAnswerOptionText(string Text)
        {
            var text = Text;
            var button = GetByXPath(model.AddNewAnswerOptionButton);
            button.Click();
            DriverProvider.Current().Driver.FindElementByXPath(model.AnswerOptionActiveText).SendKeys(text);
        }

        internal void AddAnswerOptionTextIntoExisting(string newText, string existingText)
        {
            var answerItem = AnswerItemByText(existingText);
            var itemTextField = answerItem.Container.FindElementByXPath(model.AnswerItemText);
            itemTextField.Click();
            var activeItemTextField = DriverProvider.Current().Driver.FindElementByXPath(model.AnswerOptionActiveText);
            activeItemTextField.Clear();
            activeItemTextField.SendKeys(newText);
        }

        internal void ToggleActiveAnswerOptionCorrectness()
        {            
            var button = GetByXPath(model.AnswerOptionActiveCorrectnessIndicator);
            button.Click();
        }
                
        internal void ToggleAnswerOptionCorrectness(string Text)
        {
            var answerItem = AnswerItemByText(Text);
            var button = answerItem.Container.FindElementByXPath(model.AnswerItemValue);
            button.Click();
        }

        internal void AnswerOptionDelete(string Text)
        {
            var answerItem = AnswerItemByText(Text);
            var button = answerItem.Container.FindElementByXPath(model.AnswerItemDeleteButton);
            button.Click();
        }

        internal void ExplanationDelete(string Text)
        {
            var explanationItem = ExplanationItemByText(Text);
            var button = explanationItem.Container.FindElementByXPath(model.ExplanationDeleteButton);
            button.Click();
        }


        internal void AddNewExplanationText(string Text)
        {
            var text = Text;
            var button = GetByXPath(model.AddNewExplanationButton);
            button.Click();
            TestUtils.WaitForCondition((() => ExistsOnPage(model.Ckeditor)), 1000);
            //System.Threading.Thread.Sleep(3000);
            DriverProvider.Current().Driver.FindElementByXPath(model.ExplanationActiveText).SendKeys(text);
        }

        internal void AddExplanationTextIntoExisting(string newText, string existingText)
        {
            var explanationItem = ExplanationItemByText(existingText);
            var itemTextField = explanationItem.Container.FindElementByXPath(model.ExplanationItemText);
            itemTextField.Click();
            var activeItemTextField = DriverProvider.Current().Driver.FindElementByXPath(model.ExplanationActiveText);
            activeItemTextField.Clear();
            activeItemTextField.SendKeys(newText);
        }
    }



    public class AnswerItem : ContainerElement<QuestionPageLinkingModel>
    {

        public AnswerItem(RemoteWebElement container)
            : base(container) { }

        public string Text
        {
            get
            {
                var el = GetByXPathInside(model.AnswerItemText);
                return el.GetTextContent();
                //return el.GetAttribute("value");
            }
        }

        public bool IsCorrect
        {
            get
            {
                var el = GetByXPathInside(model.CorrectAnswerIndicator);
                return el.Displayed;
            }
        }
    }

    public class ExplanationItem : ContainerElement<QuestionPageLinkingModel>
    {

        public ExplanationItem(RemoteWebElement container)
            : base(container) { }

        public string Explanation
        {
            get
            {
                return Container.GetTextContent();

            }
        }

    }


}
