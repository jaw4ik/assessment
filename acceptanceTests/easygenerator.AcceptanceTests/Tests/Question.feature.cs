﻿// ------------------------------------------------------------------------------
//  <auto-generated>
//      This code was generated by SpecFlow (http://www.specflow.org/).
//      SpecFlow Version:1.9.0.77
//      SpecFlow Generator Version:1.9.0.0
//      Runtime Version:4.0.30319.17929
// 
//      Changes to this file may cause incorrect behavior and will be lost if
//      the code is regenerated.
//  </auto-generated>
// ------------------------------------------------------------------------------
#region Designer generated code
#pragma warning disable
namespace easygenerator.AcceptanceTests.Tests
{
    using TechTalk.SpecFlow;
    
    
    [System.CodeDom.Compiler.GeneratedCodeAttribute("TechTalk.SpecFlow", "1.9.0.77")]
    [System.Runtime.CompilerServices.CompilerGeneratedAttribute()]
    [NUnit.Framework.TestFixtureAttribute()]
    [NUnit.Framework.DescriptionAttribute("Question")]
    [NUnit.Framework.CategoryAttribute("Question")]
    public partial class QuestionFeature
    {
        
        private static TechTalk.SpecFlow.ITestRunner testRunner;
        
#line 1 "Question.feature"
#line hidden
        
        [NUnit.Framework.TestFixtureSetUpAttribute()]
        public virtual void FeatureSetup()
        {
            testRunner = TechTalk.SpecFlow.TestRunnerManager.GetTestRunner();
            TechTalk.SpecFlow.FeatureInfo featureInfo = new TechTalk.SpecFlow.FeatureInfo(new System.Globalization.CultureInfo("en-US"), "Question", "As an author I can see content of open Question, so I can check if it is enough t" +
                    "o check/provide a learner\'s knowledge.", ProgrammingLanguage.CSharp, new string[] {
                        "Question"});
            testRunner.OnFeatureStart(featureInfo);
        }
        
        [NUnit.Framework.TestFixtureTearDownAttribute()]
        public virtual void FeatureTearDown()
        {
            testRunner.OnFeatureEnd();
            testRunner = null;
        }
        
        [NUnit.Framework.SetUpAttribute()]
        public virtual void TestInitialize()
        {
        }
        
        [NUnit.Framework.TearDownAttribute()]
        public virtual void ScenarioTearDown()
        {
            testRunner.OnScenarioEnd();
        }
        
        public virtual void ScenarioSetup(TechTalk.SpecFlow.ScenarioInfo scenarioInfo)
        {
            testRunner.OnScenarioStart(scenarioInfo);
        }
        
        public virtual void ScenarioCleanup()
        {
            testRunner.CollectScenarioErrors();
        }
        
        public virtual void FeatureBackground()
        {
#line 5
#line 6
testRunner.Given("clear data context", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "Given ");
#line hidden
            TechTalk.SpecFlow.Table table1 = new TechTalk.SpecFlow.Table(new string[] {
                        "Title",
                        "Id"});
            table1.AddRow(new string[] {
                        "Objective1",
                        "00000000000000000000000000000001"});
            table1.AddRow(new string[] {
                        "Objective2",
                        "00000000000000000000000000000002"});
#line 7
testRunner.Given("objectives are present in database", ((string)(null)), table1, "Given ");
#line hidden
            TechTalk.SpecFlow.Table table2 = new TechTalk.SpecFlow.Table(new string[] {
                        "Title",
                        "Id"});
            table2.AddRow(new string[] {
                        "Question11",
                        "00000000000000000000000000000001"});
            table2.AddRow(new string[] {
                        "Question12",
                        "00000000000000000000000000000002"});
            table2.AddRow(new string[] {
                        "Question13",
                        "00000000000000000000000000000003"});
#line 11
testRunner.Given("questions related to \'Objective1\' are present in database", ((string)(null)), table2, "Given ");
#line hidden
            TechTalk.SpecFlow.Table table3 = new TechTalk.SpecFlow.Table(new string[] {
                        "Title",
                        "Id"});
            table3.AddRow(new string[] {
                        "Question112",
                        "00000000000000000000000000000011"});
            table3.AddRow(new string[] {
                        "Question113",
                        "00000000000000000000000000000013"});
#line 16
testRunner.Given("questions related to \'Objective2\' are present in database", ((string)(null)), table3, "Given ");
#line hidden
            TechTalk.SpecFlow.Table table4 = new TechTalk.SpecFlow.Table(new string[] {
                        "Text",
                        "isCorrect"});
            table4.AddRow(new string[] {
                        "AnswerOption11",
                        "true"});
            table4.AddRow(new string[] {
                        "AnswerOption12",
                        "false"});
            table4.AddRow(new string[] {
                        "AnswerOption13",
                        "true"});
#line 20
testRunner.Given("answer options related to \'Question11\' of \'Objective1\' are present in database", ((string)(null)), table4, "Given ");
#line hidden
            TechTalk.SpecFlow.Table table5 = new TechTalk.SpecFlow.Table(new string[] {
                        "Text"});
            table5.AddRow(new string[] {
                        "AnswerOption21"});
            table5.AddRow(new string[] {
                        "AnswerOption22"});
            table5.AddRow(new string[] {
                        "AnswerOption23"});
#line 25
testRunner.Given("answer options related to \'Question12\' of \'Objective1\' are present in database", ((string)(null)), table5, "Given ");
#line hidden
            TechTalk.SpecFlow.Table table6 = new TechTalk.SpecFlow.Table(new string[] {
                        "Explanation"});
            table6.AddRow(new string[] {
                        "Explanation11"});
            table6.AddRow(new string[] {
                        "Explanation12"});
            table6.AddRow(new string[] {
                        "Explanation13"});
#line 30
testRunner.Given("explanations related to \'Question11\' of \'Objective1\' are present in database", ((string)(null)), table6, "Given ");
#line hidden
            TechTalk.SpecFlow.Table table7 = new TechTalk.SpecFlow.Table(new string[] {
                        "Explanation"});
            table7.AddRow(new string[] {
                        "Explanation21"});
            table7.AddRow(new string[] {
                        "Explanation22"});
            table7.AddRow(new string[] {
                        "Explanation23"});
#line 35
testRunner.Given("explanations related to \'Question12\' of \'Objective1\' are present in database", ((string)(null)), table7, "Given ");
#line hidden
        }
        
        [NUnit.Framework.TestAttribute()]
        [NUnit.Framework.DescriptionAttribute("All answer options and explanations related to question are present on question p" +
            "age")]
        public virtual void AllAnswerOptionsAndExplanationsRelatedToQuestionArePresentOnQuestionPage()
        {
            TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("All answer options and explanations related to question are present on question p" +
                    "age", ((string[])(null)));
#line 45
this.ScenarioSetup(scenarioInfo);
#line 5
this.FeatureBackground();
#line 46
testRunner.When("open page by url \'http://localhost:5656/#/objective/00000000000000000000000000000" +
                    "001/question/00000000000000000000000000000002\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line hidden
            TechTalk.SpecFlow.Table table8 = new TechTalk.SpecFlow.Table(new string[] {
                        "Text"});
            table8.AddRow(new string[] {
                        "AnswerOption21"});
            table8.AddRow(new string[] {
                        "AnswerOption22"});
            table8.AddRow(new string[] {
                        "AnswerOption23"});
#line 47
testRunner.Then("answer options list contains only items with data", ((string)(null)), table8, "Then ");
#line hidden
            TechTalk.SpecFlow.Table table9 = new TechTalk.SpecFlow.Table(new string[] {
                        "Explanation"});
            table9.AddRow(new string[] {
                        "Explanation21"});
            table9.AddRow(new string[] {
                        "Explanation22"});
            table9.AddRow(new string[] {
                        "Explanation23"});
#line 52
testRunner.And("explanations list contains only items with data", ((string)(null)), table9, "And ");
#line hidden
            this.ScenarioCleanup();
        }
        
        [NUnit.Framework.TestAttribute()]
        [NUnit.Framework.DescriptionAttribute("Related question title is shown in question page header")]
        public virtual void RelatedQuestionTitleIsShownInQuestionPageHeader()
        {
            TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("Related question title is shown in question page header", ((string[])(null)));
#line 62
this.ScenarioSetup(scenarioInfo);
#line 5
this.FeatureBackground();
#line 63
testRunner.When("open page by url \'http://localhost:5656/#/objective/00000000000000000000000000000" +
                    "001/question/00000000000000000000000000000002\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 64
testRunner.Then("\'Question12\' title is shown in question page header", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "Then ");
#line hidden
            this.ScenarioCleanup();
        }
        
        [NUnit.Framework.TestAttribute()]
        [NUnit.Framework.DescriptionAttribute("Correct indicators are shown for answer options on question page")]
        public virtual void CorrectIndicatorsAreShownForAnswerOptionsOnQuestionPage()
        {
            TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("Correct indicators are shown for answer options on question page", ((string[])(null)));
#line 66
this.ScenarioSetup(scenarioInfo);
#line 5
this.FeatureBackground();
#line 67
testRunner.When("open page by url \'http://localhost:5656/#/objective/00000000000000000000000000000" +
                    "001/question/00000000000000000000000000000001\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 68
testRunner.Then("correct answer option is set to \'true\' for \'AnswerOption11\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "Then ");
#line 69
testRunner.And("correct answer option is set to \'false\' for \'AnswerOption12\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line hidden
            this.ScenarioCleanup();
        }
        
        [NUnit.Framework.TestAttribute()]
        [NUnit.Framework.DescriptionAttribute("answer options block and explanations block are expanded by default")]
        public virtual void AnswerOptionsBlockAndExplanationsBlockAreExpandedByDefault()
        {
            TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("answer options block and explanations block are expanded by default", ((string[])(null)));
#line 88
this.ScenarioSetup(scenarioInfo);
#line 5
this.FeatureBackground();
#line 89
testRunner.When("open page by url \'http://localhost:5656/#/objective/00000000000000000000000000000" +
                    "001/question/00000000000000000000000000000001\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 90
testRunner.Then("answer options block is expanded", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "Then ");
#line 91
testRunner.And("explanations block is expanded", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line hidden
            this.ScenarioCleanup();
        }
        
        [NUnit.Framework.TestAttribute()]
        [NUnit.Framework.DescriptionAttribute("Collapse answer options action on question page collapses answer options block")]
        public virtual void CollapseAnswerOptionsActionOnQuestionPageCollapsesAnswerOptionsBlock()
        {
            TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("Collapse answer options action on question page collapses answer options block", ((string[])(null)));
#line 93
this.ScenarioSetup(scenarioInfo);
#line 5
this.FeatureBackground();
#line 94
testRunner.When("open page by url \'http://localhost:5656/#/objective/00000000000000000000000000000" +
                    "001/question/00000000000000000000000000000001\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 95
testRunner.And("click on collapse answer options", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 96
testRunner.Then("answer options block is collapsed", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "Then ");
#line 97
testRunner.And("explanations block is expanded", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line hidden
            this.ScenarioCleanup();
        }
        
        [NUnit.Framework.TestAttribute()]
        [NUnit.Framework.DescriptionAttribute("Collapse explanations action on question page collapses explanations block")]
        public virtual void CollapseExplanationsActionOnQuestionPageCollapsesExplanationsBlock()
        {
            TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("Collapse explanations action on question page collapses explanations block", ((string[])(null)));
#line 99
this.ScenarioSetup(scenarioInfo);
#line 5
this.FeatureBackground();
#line 100
testRunner.When("open page by url \'http://localhost:5656/#/objective/00000000000000000000000000000" +
                    "001/question/00000000000000000000000000000001\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 101
testRunner.And("click on collapse explanations", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 102
testRunner.Then("explanations block is collapsed", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "Then ");
#line 103
testRunner.And("answer options block is expanded", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line hidden
            this.ScenarioCleanup();
        }
        
        [NUnit.Framework.TestAttribute()]
        [NUnit.Framework.DescriptionAttribute("Expand answer options action on question page expands answer option block")]
        public virtual void ExpandAnswerOptionsActionOnQuestionPageExpandsAnswerOptionBlock()
        {
            TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("Expand answer options action on question page expands answer option block", ((string[])(null)));
#line 105
this.ScenarioSetup(scenarioInfo);
#line 5
this.FeatureBackground();
#line 106
testRunner.When("open page by url \'http://localhost:5656/#/objective/00000000000000000000000000000" +
                    "001/question/00000000000000000000000000000001\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 107
testRunner.And("click on collapse answer options", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 108
testRunner.And("click on collapse explanations", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 109
testRunner.And("click on expand answer options", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 110
testRunner.Then("answer options block is expanded", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "Then ");
#line 111
testRunner.And("explanations block is collapsed", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line hidden
            this.ScenarioCleanup();
        }
        
        [NUnit.Framework.TestAttribute()]
        [NUnit.Framework.DescriptionAttribute("Expand explanations action on question page expands explanations block")]
        public virtual void ExpandExplanationsActionOnQuestionPageExpandsExplanationsBlock()
        {
            TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("Expand explanations action on question page expands explanations block", ((string[])(null)));
#line 113
this.ScenarioSetup(scenarioInfo);
#line 5
this.FeatureBackground();
#line 114
testRunner.When("open page by url \'http://localhost:5656/#/objective/00000000000000000000000000000" +
                    "001/question/00000000000000000000000000000001\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 115
testRunner.And("click on collapse answer options", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 116
testRunner.And("click on collapse explanations", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 117
testRunner.And("click on expand explanations options", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 118
testRunner.Then("explanations block is expanded", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "Then ");
#line 119
testRunner.And("answer options block is collapsed", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line hidden
            this.ScenarioCleanup();
        }
        
        [NUnit.Framework.TestAttribute()]
        [NUnit.Framework.DescriptionAttribute("Back action of question page navigates to relative objective page")]
        public virtual void BackActionOfQuestionPageNavigatesToRelativeObjectivePage()
        {
            TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("Back action of question page navigates to relative objective page", ((string[])(null)));
#line 121
this.ScenarioSetup(scenarioInfo);
#line 5
this.FeatureBackground();
#line 122
testRunner.When("open page by url \'http://localhost:5656/#/objective/00000000000000000000000000000" +
                    "001/question/00000000000000000000000000000001\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 123
testRunner.And("click on shell back button", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 124
testRunner.Then("browser navigates to url \'http://localhost:5656/#objective/0000000000000000000000" +
                    "0000000001\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "Then ");
#line hidden
            this.ScenarioCleanup();
        }
    }
}
#pragma warning restore
#endregion
