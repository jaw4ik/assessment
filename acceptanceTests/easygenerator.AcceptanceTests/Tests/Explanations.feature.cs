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
    [NUnit.Framework.DescriptionAttribute("Explanations")]
    [NUnit.Framework.CategoryAttribute("Explanations")]
    public partial class ExplanationsFeature
    {
        
        private static TechTalk.SpecFlow.ITestRunner testRunner;
        
#line 1 "Explanations.feature"
#line hidden
        
        [NUnit.Framework.TestFixtureSetUpAttribute()]
        public virtual void FeatureSetup()
        {
            testRunner = TechTalk.SpecFlow.TestRunnerManager.GetTestRunner();
            TechTalk.SpecFlow.FeatureInfo featureInfo = new TechTalk.SpecFlow.FeatureInfo(new System.Globalization.CultureInfo("en-US"), "Explanations", "As an author I can Add Explanation, so I can divide needed content into more than" +
                    " one solid part.\r\n  As an author I can Delete Explanation, so I do not keep not " +
                    "needed parts of content.", ProgrammingLanguage.CSharp, new string[] {
                        "Explanations"});
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
#line 6
#line 7
testRunner.Given("clear data context", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "Given ");
#line hidden
            TechTalk.SpecFlow.Table table1 = new TechTalk.SpecFlow.Table(new string[] {
                        "Title",
                        "Id"});
            table1.AddRow(new string[] {
                        "Objective1",
                        "00000000000000000000000000000001"});
#line 8
testRunner.Given("objectives are present in database", ((string)(null)), table1, "Given ");
#line hidden
            TechTalk.SpecFlow.Table table2 = new TechTalk.SpecFlow.Table(new string[] {
                        "Title",
                        "Id"});
            table2.AddRow(new string[] {
                        "Question11",
                        "00000000000000000000000000000001"});
#line 11
testRunner.Given("questions related to \'Objective1\' are present in database", ((string)(null)), table2, "Given ");
#line hidden
            TechTalk.SpecFlow.Table table3 = new TechTalk.SpecFlow.Table(new string[] {
                        "Explanation"});
            table3.AddRow(new string[] {
                        "Explanation11"});
            table3.AddRow(new string[] {
                        "Explanation12"});
            table3.AddRow(new string[] {
                        "Explanation13"});
#line 14
testRunner.Given("explanations related to \'Question11\' of \'Objective1\' are present in database", ((string)(null)), table3, "Given ");
#line 19
testRunner.When("open page by url \'http://localhost:5656/signin\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 20
testRunner.And("sign in as \'test\' user on sign in page", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 21
testRunner.Then("browser navigates to url \'http://localhost:5656/\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "Then ");
#line hidden
        }
        
        [NUnit.Framework.TestAttribute()]
        [NUnit.Framework.DescriptionAttribute("New explanation could be added by entering new explanation text")]
        public virtual void NewExplanationCouldBeAddedByEnteringNewExplanationText()
        {
            TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("New explanation could be added by entering new explanation text", ((string[])(null)));
#line 23
this.ScenarioSetup(scenarioInfo);
#line 6
this.FeatureBackground();
#line 24
testRunner.When("open page by url \'http://localhost:5656/#/objective/00000000000000000000000000000" +
                    "001/question/00000000000000000000000000000001\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 25
testRunner.And("input text \'Explanation14\' into new explanation text field", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 26
testRunner.And("click on collapse answer options", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line hidden
            TechTalk.SpecFlow.Table table4 = new TechTalk.SpecFlow.Table(new string[] {
                        "Explanation"});
            table4.AddRow(new string[] {
                        "Explanation11"});
            table4.AddRow(new string[] {
                        "Explanation12"});
            table4.AddRow(new string[] {
                        "Explanation13"});
            table4.AddRow(new string[] {
                        "Explanation14"});
#line 27
testRunner.Then("explanations list contains only items with data", ((string)(null)), table4, "Then ");
#line hidden
            this.ScenarioCleanup();
        }
        
        [NUnit.Framework.TestAttribute()]
        [NUnit.Framework.DescriptionAttribute("Explanation becomes saved and not selected on collapse explanation")]
        public virtual void ExplanationBecomesSavedAndNotSelectedOnCollapseExplanation()
        {
            TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("Explanation becomes saved and not selected on collapse explanation", ((string[])(null)));
#line 34
this.ScenarioSetup(scenarioInfo);
#line 6
this.FeatureBackground();
#line 35
testRunner.When("open page by url \'http://localhost:5656/#/objective/00000000000000000000000000000" +
                    "001/question/00000000000000000000000000000001\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 36
testRunner.And("input text \'Explanation14\' into new explanation text field", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 37
testRunner.And("click on collapse explanations", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 38
testRunner.And("click on collapse explanations", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line hidden
            TechTalk.SpecFlow.Table table5 = new TechTalk.SpecFlow.Table(new string[] {
                        "Explanation"});
            table5.AddRow(new string[] {
                        "Explanation11"});
            table5.AddRow(new string[] {
                        "Explanation12"});
            table5.AddRow(new string[] {
                        "Explanation13"});
            table5.AddRow(new string[] {
                        "Explanation14"});
#line 39
testRunner.Then("explanations list contains only items with data", ((string)(null)), table5, "Then ");
#line 45
testRunner.And("explanation delete button is enabled false for explanation with text \'Explanation" +
                    "11\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 46
testRunner.And("explanation delete button is enabled false for explanation with text \'Explanation" +
                    "12\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 47
testRunner.And("explanation delete button is enabled false for explanation with text \'Explanation" +
                    "13\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 48
testRunner.And("explanation delete button is enabled false for explanation with text \'Explanation" +
                    "14\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line hidden
            this.ScenarioCleanup();
        }
        
        [NUnit.Framework.TestAttribute()]
        [NUnit.Framework.DescriptionAttribute("Explanation text could be edited")]
        public virtual void ExplanationTextCouldBeEdited()
        {
            TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("Explanation text could be edited", ((string[])(null)));
#line 50
this.ScenarioSetup(scenarioInfo);
#line 6
this.FeatureBackground();
#line 51
testRunner.When("open page by url \'http://localhost:5656/#/objective/00000000000000000000000000000" +
                    "001/question/00000000000000000000000000000001\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 52
testRunner.And("input text \'Explanation14\' into explanation text field \'Explanation12\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 53
testRunner.And("click on collapse answer options", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line hidden
            TechTalk.SpecFlow.Table table6 = new TechTalk.SpecFlow.Table(new string[] {
                        "Explanation"});
            table6.AddRow(new string[] {
                        "Explanation11"});
            table6.AddRow(new string[] {
                        "Explanation14"});
            table6.AddRow(new string[] {
                        "Explanation13"});
#line 54
testRunner.Then("explanations list contains only items with data", ((string)(null)), table6, "Then ");
#line hidden
            this.ScenarioCleanup();
        }
        
        [NUnit.Framework.TestAttribute()]
        [NUnit.Framework.DescriptionAttribute("Delete button should be enabled if hover explanation element")]
        public virtual void DeleteButtonShouldBeEnabledIfHoverExplanationElement()
        {
            TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("Delete button should be enabled if hover explanation element", ((string[])(null)));
#line 60
this.ScenarioSetup(scenarioInfo);
#line 6
this.FeatureBackground();
#line 61
testRunner.When("open page by url \'http://localhost:5656/#/objective/00000000000000000000000000000" +
                    "001/question/00000000000000000000000000000001\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 62
testRunner.And("mouse hover element of explanation with text \'Explanation12\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 63
testRunner.Then("explanation delete button is enabled true for explanation with text \'Explanation1" +
                    "2\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "Then ");
#line hidden
            this.ScenarioCleanup();
        }
        
        [NUnit.Framework.TestAttribute()]
        [NUnit.Framework.DescriptionAttribute("Delete buttons are not enabled for inactive explanation elements")]
        public virtual void DeleteButtonsAreNotEnabledForInactiveExplanationElements()
        {
            TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("Delete buttons are not enabled for inactive explanation elements", ((string[])(null)));
#line 65
this.ScenarioSetup(scenarioInfo);
#line 6
this.FeatureBackground();
#line 66
testRunner.When("open page by url \'http://localhost:5656/#/objective/00000000000000000000000000000" +
                    "001/question/00000000000000000000000000000001\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 67
testRunner.And("mouse hover element of explanation with text \'Explanation12\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 68
testRunner.Then("explanation delete button is enabled true for explanation with text \'Explanation1" +
                    "2\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "Then ");
#line 69
testRunner.And("explanation delete button is enabled false for explanation with text \'Explanation" +
                    "11\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 70
testRunner.And("explanation delete button is enabled false for explanation with text \'Explanation" +
                    "13\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line hidden
            this.ScenarioCleanup();
        }
        
        [NUnit.Framework.TestAttribute()]
        [NUnit.Framework.DescriptionAttribute("Delete button should be enabled if edit explanation element")]
        public virtual void DeleteButtonShouldBeEnabledIfEditExplanationElement()
        {
            TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("Delete button should be enabled if edit explanation element", ((string[])(null)));
#line 72
this.ScenarioSetup(scenarioInfo);
#line 6
this.FeatureBackground();
#line 73
testRunner.When("open page by url \'http://localhost:5656/#/objective/00000000000000000000000000000" +
                    "001/question/00000000000000000000000000000001\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 74
testRunner.And("click explanation text field \'Explanation12\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 75
testRunner.Then("explanation delete button is enabled true for explanation with text \'Explanation1" +
                    "2\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "Then ");
#line hidden
            this.ScenarioCleanup();
        }
        
        [NUnit.Framework.TestAttribute()]
        [NUnit.Framework.DescriptionAttribute("Explanation could be deleted")]
        public virtual void ExplanationCouldBeDeleted()
        {
            TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("Explanation could be deleted", ((string[])(null)));
#line 78
this.ScenarioSetup(scenarioInfo);
#line 6
this.FeatureBackground();
#line 79
testRunner.When("open page by url \'http://localhost:5656/#/objective/00000000000000000000000000000" +
                    "001/question/00000000000000000000000000000001\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 80
testRunner.And("mouse hover element of explanation with text \'Explanation12\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 81
testRunner.And("click on delete explanation \'Explanation12\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 82
testRunner.And("mouse hover element of explanation with text \'Explanation11\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 83
testRunner.And("click on delete explanation \'Explanation11\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line hidden
            TechTalk.SpecFlow.Table table7 = new TechTalk.SpecFlow.Table(new string[] {
                        "Explanation"});
            table7.AddRow(new string[] {
                        "Explanation13"});
#line 84
testRunner.Then("explanations list contains only items with data", ((string)(null)), table7, "Then ");
#line hidden
            this.ScenarioCleanup();
        }
        
        [NUnit.Framework.TestAttribute()]
        [NUnit.Framework.DescriptionAttribute("Explanation should be deleted if all content will be deleted from it")]
        public virtual void ExplanationShouldBeDeletedIfAllContentWillBeDeletedFromIt()
        {
            TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("Explanation should be deleted if all content will be deleted from it", ((string[])(null)));
#line 88
this.ScenarioSetup(scenarioInfo);
#line 6
this.FeatureBackground();
#line 89
testRunner.When("open page by url \'http://localhost:5656/#/objective/00000000000000000000000000000" +
                    "001/question/00000000000000000000000000000001\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 90
testRunner.And("input text \' \' into explanation text field \'Explanation12\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 91
testRunner.And("click on collapse answer options", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line hidden
            TechTalk.SpecFlow.Table table8 = new TechTalk.SpecFlow.Table(new string[] {
                        "Explanation"});
            table8.AddRow(new string[] {
                        "Explanation11"});
            table8.AddRow(new string[] {
                        "Explanation13"});
#line 92
testRunner.Then("explanations list contains only items with data", ((string)(null)), table8, "Then ");
#line hidden
            this.ScenarioCleanup();
        }
        
        [NUnit.Framework.TestAttribute()]
        [NUnit.Framework.DescriptionAttribute("Explanation can\'t be saved with empty text")]
        public virtual void ExplanationCanTBeSavedWithEmptyText()
        {
            TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("Explanation can\'t be saved with empty text", ((string[])(null)));
#line 98
this.ScenarioSetup(scenarioInfo);
#line 6
this.FeatureBackground();
#line 99
testRunner.When("open page by url \'http://localhost:5656/#/objective/00000000000000000000000000000" +
                    "001/question/00000000000000000000000000000001\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 100
testRunner.And("input text \' \' into new explanation text field", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 101
testRunner.And("click on collapse answer options", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line hidden
            TechTalk.SpecFlow.Table table9 = new TechTalk.SpecFlow.Table(new string[] {
                        "Explanation"});
            table9.AddRow(new string[] {
                        "Explanation11"});
            table9.AddRow(new string[] {
                        "Explanation12"});
            table9.AddRow(new string[] {
                        "Explanation13"});
#line 102
testRunner.Then("explanations list contains only items with data", ((string)(null)), table9, "Then ");
#line hidden
            this.ScenarioCleanup();
        }
        
        [NUnit.Framework.TestAttribute()]
        [NUnit.Framework.DescriptionAttribute("Changes to explanation data are not lost when user go out from current question p" +
            "age")]
        public virtual void ChangesToExplanationDataAreNotLostWhenUserGoOutFromCurrentQuestionPage()
        {
            TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("Changes to explanation data are not lost when user go out from current question p" +
                    "age", ((string[])(null)));
#line 108
this.ScenarioSetup(scenarioInfo);
#line 6
this.FeatureBackground();
#line 109
testRunner.When("open page by url \'http://localhost:5656/#/objective/00000000000000000000000000000" +
                    "001/question/00000000000000000000000000000001\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 110
testRunner.And("input text \'Explanation14\' into explanation text field \'Explanation12\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 111
testRunner.And("click on back to objective on question page", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 112
testRunner.And("mouse hover element of questions list with title \'Question11\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 113
testRunner.And("click on open question with title \'Question11\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line hidden
            TechTalk.SpecFlow.Table table10 = new TechTalk.SpecFlow.Table(new string[] {
                        "Explanation"});
            table10.AddRow(new string[] {
                        "Explanation11"});
            table10.AddRow(new string[] {
                        "Explanation14"});
            table10.AddRow(new string[] {
                        "Explanation13"});
#line 114
testRunner.Then("explanations list contains only items with data", ((string)(null)), table10, "Then ");
#line hidden
            this.ScenarioCleanup();
        }
        
        [NUnit.Framework.TestAttribute()]
        [NUnit.Framework.DescriptionAttribute("Changes to explanation list are not lost when user go out from current question p" +
            "age")]
        public virtual void ChangesToExplanationListAreNotLostWhenUserGoOutFromCurrentQuestionPage()
        {
            TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("Changes to explanation list are not lost when user go out from current question p" +
                    "age", ((string[])(null)));
#line 120
this.ScenarioSetup(scenarioInfo);
#line 6
this.FeatureBackground();
#line 121
testRunner.When("open page by url \'http://localhost:5656/#/objective/00000000000000000000000000000" +
                    "001/question/00000000000000000000000000000001\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 122
testRunner.And("input text \'Explanation14\' into new explanation text field", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 123
testRunner.And("mouse hover element of explanation with text \'Explanation12\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 124
testRunner.And("click on delete explanation \'Explanation12\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 125
testRunner.And("click on back to objective on question page", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 126
testRunner.And("mouse hover element of questions list with title \'Question11\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 127
testRunner.And("click on open question with title \'Question11\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line hidden
            TechTalk.SpecFlow.Table table11 = new TechTalk.SpecFlow.Table(new string[] {
                        "Explanation"});
            table11.AddRow(new string[] {
                        "Explanation11"});
            table11.AddRow(new string[] {
                        "Explanation13"});
            table11.AddRow(new string[] {
                        "Explanation14"});
#line 128
testRunner.Then("explanations list contains only items with data", ((string)(null)), table11, "Then ");
#line hidden
            this.ScenarioCleanup();
        }
        
        [NUnit.Framework.TestAttribute()]
        [NUnit.Framework.DescriptionAttribute("Explanation could contain special symbols")]
        public virtual void ExplanationCouldContainSpecialSymbols()
        {
            TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("Explanation could contain special symbols", ((string[])(null)));
#line 134
this.ScenarioSetup(scenarioInfo);
#line 6
this.FeatureBackground();
#line hidden
            TechTalk.SpecFlow.Table table12 = new TechTalk.SpecFlow.Table(new string[] {
                        "Explanation"});
            table12.AddRow(new string[] {
                        "~`!@#$%^&*()_+-={[]}:;\"\'|\\<,.>/?№ё"});
#line 135
testRunner.Given("explanations related to \'Question11\' of \'Objective1\' are present in database", ((string)(null)), table12, "Given ");
#line 138
testRunner.When("open page by url \'http://localhost:5656/#/objective/00000000000000000000000000000" +
                    "001/question/00000000000000000000000000000001\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line hidden
            TechTalk.SpecFlow.Table table13 = new TechTalk.SpecFlow.Table(new string[] {
                        "Explanation"});
            table13.AddRow(new string[] {
                        "~`!@#$%^&*()_+-={[]}:;\"\'|\\<,.>/?№ё"});
#line 139
testRunner.Then("explanations list contains only items with data", ((string)(null)), table13, "Then ");
#line hidden
            this.ScenarioCleanup();
        }
        
        [NUnit.Framework.TestAttribute()]
        [NUnit.Framework.DescriptionAttribute("New explanation with special symbols could be added by entering new explanation t" +
            "ext")]
        public virtual void NewExplanationWithSpecialSymbolsCouldBeAddedByEnteringNewExplanationText()
        {
            TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("New explanation with special symbols could be added by entering new explanation t" +
                    "ext", ((string[])(null)));
#line 143
this.ScenarioSetup(scenarioInfo);
#line 6
this.FeatureBackground();
#line 144
testRunner.When("open page by url \'http://localhost:5656/#/objective/00000000000000000000000000000" +
                    "001/question/00000000000000000000000000000001\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 145
testRunner.And("input text \'~`!@#$%^&*()_+-={[]}:;\"\'|\\<,.>/?\' into new explanation text field", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 146
testRunner.And("click on collapse answer options", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 147
testRunner.And("click on back to objective on question page", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 148
testRunner.And("mouse hover element of questions list with title \'Question11\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 149
testRunner.And("click on open question with title \'Question11\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line hidden
            TechTalk.SpecFlow.Table table14 = new TechTalk.SpecFlow.Table(new string[] {
                        "Explanation"});
            table14.AddRow(new string[] {
                        "Explanation11"});
            table14.AddRow(new string[] {
                        "Explanation12"});
            table14.AddRow(new string[] {
                        "Explanation13"});
            table14.AddRow(new string[] {
                        "~`!@#$%^&*()_+-={[]}:;\"\'|\\<,.>/?"});
#line 150
testRunner.Then("explanations list contains only items with data", ((string)(null)), table14, "Then ");
#line hidden
            this.ScenarioCleanup();
        }
        
        [NUnit.Framework.TestAttribute()]
        [NUnit.Framework.DescriptionAttribute("All explanations can be made visible using scroll")]
        public virtual void AllExplanationsCanBeMadeVisibleUsingScroll()
        {
            TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("All explanations can be made visible using scroll", ((string[])(null)));
#line 157
this.ScenarioSetup(scenarioInfo);
#line 6
this.FeatureBackground();
#line hidden
            TechTalk.SpecFlow.Table table15 = new TechTalk.SpecFlow.Table(new string[] {
                        "Explanation"});
            table15.AddRow(new string[] {
                        "Explanation11"});
            table15.AddRow(new string[] {
                        "Explanation12"});
            table15.AddRow(new string[] {
                        "Explanation13"});
            table15.AddRow(new string[] {
                        "Explanation14"});
            table15.AddRow(new string[] {
                        "Explanation15"});
            table15.AddRow(new string[] {
                        "Explanation16"});
#line 158
testRunner.Given("explanations related to \'Question11\' of \'Objective1\' are present in database", ((string)(null)), table15, "Given ");
#line 166
testRunner.When("open page by url \'http://localhost:5656/#/objective/00000000000000000000000000000" +
                    "001/question/00000000000000000000000000000001\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 167
testRunner.And("browser window width and height is set to 640 and 300", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 168
testRunner.And("scroll new explanation button into the view", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 169
testRunner.Then("new explanation button is visible", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "Then ");
#line hidden
            this.ScenarioCleanup();
        }
    }
}
#pragma warning restore
#endregion
