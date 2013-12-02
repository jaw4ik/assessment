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
    [NUnit.Framework.DescriptionAttribute("PackageProgressScore")]
    [NUnit.Framework.CategoryAttribute("PackageListOfObjectives")]
    public partial class PackageProgressScoreFeature
    {
        
        private static TechTalk.SpecFlow.ITestRunner testRunner;
        
#line 1 "PackageProgressScore.feature"
#line hidden
        
        [NUnit.Framework.TestFixtureSetUpAttribute()]
        public virtual void FeatureSetup()
        {
            testRunner = TechTalk.SpecFlow.TestRunnerManager.GetTestRunner();
            TechTalk.SpecFlow.FeatureInfo featureInfo = new TechTalk.SpecFlow.FeatureInfo(new System.Globalization.CultureInfo("en-US"), "PackageProgressScore", @"- Effective score for each question = score of the last attempt for this question;
- Learner’s score for current question is calculated by this rule (all options have the same weight):
-- (Number of checked options that are correct + Number of not checked options that are incorrect)/(Number of answer options)×100% ;
- Learner can see his progress summary (in percent) : overall experience progress value = arithmetical mean of all progress values of objectives, progress value per objective;", ProgrammingLanguage.CSharp, new string[] {
                        "PackageListOfObjectives"});
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
#line 10
#line 11
testRunner.Given("clear data context", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "Given ");
#line hidden
            TechTalk.SpecFlow.Table table1 = new TechTalk.SpecFlow.Table(new string[] {
                        "Title",
                        "Id"});
            table1.AddRow(new string[] {
                        "Experience1",
                        "00000000000000000000000000000001"});
#line 12
testRunner.Given("publications are present in database", ((string)(null)), table1, "Given ");
#line hidden
            TechTalk.SpecFlow.Table table2 = new TechTalk.SpecFlow.Table(new string[] {
                        "Title",
                        "Id"});
            table2.AddRow(new string[] {
                        "Objective11",
                        "00000000000000000000000000000001"});
            table2.AddRow(new string[] {
                        "Objective12",
                        "00000000000000000000000000000002"});
#line 15
testRunner.Given("objectives are present in database", ((string)(null)), table2, "Given ");
#line hidden
            TechTalk.SpecFlow.Table table3 = new TechTalk.SpecFlow.Table(new string[] {
                        "Title",
                        "Id"});
            table3.AddRow(new string[] {
                        "Objective11",
                        "00000000000000000000000000000001"});
            table3.AddRow(new string[] {
                        "Objective12",
                        "00000000000000000000000000000002"});
#line 19
testRunner.Given("objectives are linked to experiance \'Experience1\'", ((string)(null)), table3, "Given ");
#line hidden
            TechTalk.SpecFlow.Table table4 = new TechTalk.SpecFlow.Table(new string[] {
                        "Title",
                        "Id"});
            table4.AddRow(new string[] {
                        "Question11",
                        "00000000000000000000000000000001"});
            table4.AddRow(new string[] {
                        "Question12",
                        "00000000000000000000000000000002"});
#line 24
testRunner.Given("questions related to \'Objective11\' are present in database", ((string)(null)), table4, "Given ");
#line hidden
            TechTalk.SpecFlow.Table table5 = new TechTalk.SpecFlow.Table(new string[] {
                        "Text",
                        "isCorrect"});
            table5.AddRow(new string[] {
                        "AnswerOption11",
                        "true"});
            table5.AddRow(new string[] {
                        "AnswerOption12",
                        "false"});
            table5.AddRow(new string[] {
                        "AnswerOption13",
                        "false"});
#line 28
testRunner.Given("answer options related to \'Question11\' of \'Objective11\' are present in database", ((string)(null)), table5, "Given ");
#line hidden
            TechTalk.SpecFlow.Table table6 = new TechTalk.SpecFlow.Table(new string[] {
                        "Text",
                        "isCorrect"});
            table6.AddRow(new string[] {
                        "AnswerOption21",
                        "true"});
            table6.AddRow(new string[] {
                        "AnswerOption22",
                        "false"});
#line 33
testRunner.Given("answer options related to \'Question12\' of \'Objective11\' are present in database", ((string)(null)), table6, "Given ");
#line hidden
            TechTalk.SpecFlow.Table table7 = new TechTalk.SpecFlow.Table(new string[] {
                        "Explanation"});
            table7.AddRow(new string[] {
                        "Explanation11"});
            table7.AddRow(new string[] {
                        "Explanation12"});
#line 37
testRunner.Given("explanations related to \'Question11\' of \'Objective11\' are present in database", ((string)(null)), table7, "Given ");
#line hidden
            TechTalk.SpecFlow.Table table8 = new TechTalk.SpecFlow.Table(new string[] {
                        "Explanation"});
            table8.AddRow(new string[] {
                        "Explanation21"});
            table8.AddRow(new string[] {
                        "Explanation22"});
#line 41
testRunner.Given("explanations related to \'Question12\' of \'Objective11\' are present in database", ((string)(null)), table8, "Given ");
#line hidden
            TechTalk.SpecFlow.Table table9 = new TechTalk.SpecFlow.Table(new string[] {
                        "Title",
                        "Id"});
            table9.AddRow(new string[] {
                        "Question21",
                        "00000000000000000000000000000003"});
            table9.AddRow(new string[] {
                        "Question22",
                        "00000000000000000000000000000004"});
#line 46
testRunner.Given("questions related to \'Objective12\' are present in database", ((string)(null)), table9, "Given ");
#line hidden
            TechTalk.SpecFlow.Table table10 = new TechTalk.SpecFlow.Table(new string[] {
                        "Text",
                        "isCorrect"});
            table10.AddRow(new string[] {
                        "AnswerOption211",
                        "true"});
            table10.AddRow(new string[] {
                        "AnswerOption212",
                        "false"});
#line 50
testRunner.Given("answer options related to \'Question21\' of \'Objective12\' are present in database", ((string)(null)), table10, "Given ");
#line hidden
            TechTalk.SpecFlow.Table table11 = new TechTalk.SpecFlow.Table(new string[] {
                        "Text",
                        "isCorrect"});
            table11.AddRow(new string[] {
                        "AnswerOption221",
                        "true"});
            table11.AddRow(new string[] {
                        "AnswerOption222",
                        "true"});
            table11.AddRow(new string[] {
                        "AnswerOption223",
                        "false"});
#line 54
testRunner.Given("answer options related to \'Question22\' of \'Objective12\' are present in database", ((string)(null)), table11, "Given ");
#line hidden
            TechTalk.SpecFlow.Table table12 = new TechTalk.SpecFlow.Table(new string[] {
                        "Explanation"});
            table12.AddRow(new string[] {
                        "Explanation211"});
            table12.AddRow(new string[] {
                        "Explanation212"});
#line 59
testRunner.Given("explanations related to \'Question21\' of \'Objective12\' are present in database", ((string)(null)), table12, "Given ");
#line hidden
            TechTalk.SpecFlow.Table table13 = new TechTalk.SpecFlow.Table(new string[] {
                        "Explanation"});
            table13.AddRow(new string[] {
                        "Explanation221"});
            table13.AddRow(new string[] {
                        "Explanation222"});
#line 63
testRunner.Given("explanations related to \'Question22\' of \'Objective12\' are present in database", ((string)(null)), table13, "Given ");
#line 72
testRunner.When("open page by url \'http://localhost:5656/#/experiences\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 73
testRunner.And("mouse hover element of publications list with title \'Experience1\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 74
testRunner.And("click build publication list item with title \'Experience1\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 75
testRunner.And("sleep 1000 milliseconds", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 76
testRunner.And("refresh page", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 77
testRunner.And("mouse hover element of publications list with title \'Experience1\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 78
testRunner.And("click download publication list item with title \'Experience1\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 79
testRunner.And("unzip \'00000000000000000000000000000001\' package to \'tmp\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 80
testRunner.And("open page by url \'http://localhost:5656/Templates/tmp\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line hidden
        }
        
        [NUnit.Framework.TestAttribute()]
        [NUnit.Framework.DescriptionAttribute("Package score should not be calculated if only visit pages and not submit answers" +
            "")]
        public virtual void PackageScoreShouldNotBeCalculatedIfOnlyVisitPagesAndNotSubmitAnswers()
        {
            TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("Package score should not be calculated if only visit pages and not submit answers" +
                    "", ((string[])(null)));
#line 84
this.ScenarioSetup(scenarioInfo);
#line 10
this.FeatureBackground();
#line 85
testRunner.When("toggle expand package objective item with title \'Objective11\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 86
testRunner.And("click package question list item \'Question11\' of \'Objective11\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 87
testRunner.And("click on show explanations link on package question page", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 88
testRunner.And("click on back to objectives link on package explanations page", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 89
testRunner.And("toggle expand package objective item with title \'Objective12\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 90
testRunner.And("click package question list item \'Question22\' of \'Objective12\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 91
testRunner.And("click on show explanations link on package question page", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 92
testRunner.And("click on progress summary link on package explanations page", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 93
testRunner.Then("overall progress score \'0%\' is shown on package summary page", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "Then ");
#line hidden
            TechTalk.SpecFlow.Table table14 = new TechTalk.SpecFlow.Table(new string[] {
                        "Title",
                        "Value",
                        "MeterValue"});
            table14.AddRow(new string[] {
                        "Objective11",
                        "0%",
                        "width: 0%;"});
            table14.AddRow(new string[] {
                        "Objective12",
                        "0%",
                        "width: 0%;"});
#line 94
testRunner.And("objective progress list contains items with data", ((string)(null)), table14, "And ");
#line hidden
            this.ScenarioCleanup();
        }
        
        [NUnit.Framework.TestAttribute()]
        [NUnit.Framework.DescriptionAttribute("All scores are 100% if all correct answers were checked and submited")]
        public virtual void AllScoresAre100IfAllCorrectAnswersWereCheckedAndSubmited()
        {
            TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("All scores are 100% if all correct answers were checked and submited", ((string[])(null)));
#line 100
this.ScenarioSetup(scenarioInfo);
#line 10
this.FeatureBackground();
#line 101
testRunner.When("toggle expand package objective item with title \'Objective11\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 102
testRunner.And("click package question list item \'Question11\' of \'Objective11\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 103
testRunner.And("toggle package answer option \'AnswerOption11\' checkbox", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 104
testRunner.And("click on submit button on package question page", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 105
testRunner.Then("question progress score \'100%\' is shown on package feedback page", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "Then ");
#line 107
testRunner.When("click on back to objectives link on package feedback page", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 108
testRunner.And("click package question list item \'Question12\' of \'Objective11\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 109
testRunner.And("toggle package answer option \'AnswerOption21\' checkbox", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 110
testRunner.And("click on submit button on package question page", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 111
testRunner.Then("question progress score \'100%\' is shown on package feedback page", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "Then ");
#line 113
testRunner.When("click on back to objectives link on package feedback page", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 114
testRunner.And("toggle expand package objective item with title \'Objective12\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 115
testRunner.And("click package question list item \'Question21\' of \'Objective12\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 116
testRunner.And("toggle package answer option \'AnswerOption211\' checkbox", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 117
testRunner.And("click on submit button on package question page", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 118
testRunner.Then("question progress score \'100%\' is shown on package feedback page", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "Then ");
#line 120
testRunner.When("click on back to objectives link on package feedback page", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 121
testRunner.And("click package question list item \'Question22\' of \'Objective12\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 122
testRunner.And("toggle package answer option \'AnswerOption221\' checkbox", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 123
testRunner.And("toggle package answer option \'AnswerOption222\' checkbox", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 124
testRunner.And("click on submit button on package question page", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 125
testRunner.Then("question progress score \'100%\' is shown on package feedback page", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "Then ");
#line 127
testRunner.When("click on progress summary link on package feedback page", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 128
testRunner.Then("overall progress score \'100%\' is shown on package summary page", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "Then ");
#line hidden
            TechTalk.SpecFlow.Table table15 = new TechTalk.SpecFlow.Table(new string[] {
                        "Title",
                        "Value",
                        "MeterValue"});
            table15.AddRow(new string[] {
                        "Objective11",
                        "100%",
                        "width: 100%;"});
            table15.AddRow(new string[] {
                        "Objective12",
                        "100%",
                        "width: 100%;"});
#line 129
testRunner.And("objective progress list contains items with data", ((string)(null)), table15, "And ");
#line hidden
            this.ScenarioCleanup();
        }
        
        [NUnit.Framework.TestAttribute()]
        [NUnit.Framework.DescriptionAttribute("All scores are 0% if all incorrect answers were checked and submited")]
        public virtual void AllScoresAre0IfAllIncorrectAnswersWereCheckedAndSubmited()
        {
            TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("All scores are 0% if all incorrect answers were checked and submited", ((string[])(null)));
#line 135
this.ScenarioSetup(scenarioInfo);
#line 10
this.FeatureBackground();
#line 136
testRunner.When("toggle expand package objective item with title \'Objective11\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 137
testRunner.And("click package question list item \'Question11\' of \'Objective11\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 138
testRunner.And("toggle package answer option \'AnswerOption12\' checkbox", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 139
testRunner.And("toggle package answer option \'AnswerOption13\' checkbox", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 140
testRunner.And("click on submit button on package question page", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 141
testRunner.Then("question progress score \'0%\' is shown on package feedback page", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "Then ");
#line 143
testRunner.When("click on back to objectives link on package feedback page", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 144
testRunner.And("click package question list item \'Question12\' of \'Objective11\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 145
testRunner.And("toggle package answer option \'AnswerOption22\' checkbox", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 146
testRunner.And("click on submit button on package question page", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 147
testRunner.Then("question progress score \'0%\' is shown on package feedback page", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "Then ");
#line 149
testRunner.When("click on back to objectives link on package feedback page", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 150
testRunner.And("toggle expand package objective item with title \'Objective12\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 151
testRunner.And("click package question list item \'Question21\' of \'Objective12\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 152
testRunner.And("toggle package answer option \'AnswerOption212\' checkbox", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 153
testRunner.And("click on submit button on package question page", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 154
testRunner.Then("question progress score \'0%\' is shown on package feedback page", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "Then ");
#line 156
testRunner.When("click on back to objectives link on package feedback page", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 157
testRunner.And("click package question list item \'Question22\' of \'Objective12\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 158
testRunner.And("toggle package answer option \'AnswerOption223\' checkbox", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 159
testRunner.And("click on submit button on package question page", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 160
testRunner.Then("question progress score \'0%\' is shown on package feedback page", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "Then ");
#line 162
testRunner.When("click on progress summary link on package feedback page", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 163
testRunner.Then("overall progress score \'0%\' is shown on package summary page", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "Then ");
#line hidden
            TechTalk.SpecFlow.Table table16 = new TechTalk.SpecFlow.Table(new string[] {
                        "Title",
                        "Value",
                        "MeterValue"});
            table16.AddRow(new string[] {
                        "Objective11",
                        "0%",
                        "width: 0%;"});
            table16.AddRow(new string[] {
                        "Objective12",
                        "0%",
                        "width: 0%;"});
#line 164
testRunner.And("objective progress list contains items with data", ((string)(null)), table16, "And ");
#line hidden
            this.ScenarioCleanup();
        }
        
        [NUnit.Framework.TestAttribute()]
        [NUnit.Framework.DescriptionAttribute("Not checked incorrect options are equal to checked correct options in score calcu" +
            "lation and vice versa")]
        public virtual void NotCheckedIncorrectOptionsAreEqualToCheckedCorrectOptionsInScoreCalculationAndViceVersa()
        {
            TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("Not checked incorrect options are equal to checked correct options in score calcu" +
                    "lation and vice versa", ((string[])(null)));
#line 169
this.ScenarioSetup(scenarioInfo);
#line 10
this.FeatureBackground();
#line 170
testRunner.When("toggle expand package objective item with title \'Objective11\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 171
testRunner.And("click package question list item \'Question11\' of \'Objective11\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 172
testRunner.And("toggle package answer option \'AnswerOption11\' checkbox", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 173
testRunner.And("toggle package answer option \'AnswerOption13\' checkbox", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 174
testRunner.And("click on submit button on package question page", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 175
testRunner.Then("question progress score \'67%\' is shown on package feedback page", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "Then ");
#line 177
testRunner.When("click on back to objectives link on package feedback page", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 178
testRunner.And("toggle expand package objective item with title \'Objective12\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 179
testRunner.And("click package question list item \'Question22\' of \'Objective12\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 180
testRunner.And("toggle package answer option \'AnswerOption221\' checkbox", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 181
testRunner.And("toggle package answer option \'AnswerOption223\' checkbox", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 182
testRunner.And("click on submit button on package question page", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 183
testRunner.Then("question progress score \'33%\' is shown on package feedback page", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "Then ");
#line hidden
            this.ScenarioCleanup();
        }
        
        [NUnit.Framework.TestAttribute()]
        [NUnit.Framework.DescriptionAttribute("Overall experience progress value is arithmetical mean of all progress values of " +
            "objectives")]
        public virtual void OverallExperienceProgressValueIsArithmeticalMeanOfAllProgressValuesOfObjectives()
        {
            TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("Overall experience progress value is arithmetical mean of all progress values of " +
                    "objectives", ((string[])(null)));
#line 185
this.ScenarioSetup(scenarioInfo);
#line 10
this.FeatureBackground();
#line 186
testRunner.When("toggle expand package objective item with title \'Objective11\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 187
testRunner.And("click package question list item \'Question11\' of \'Objective11\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 188
testRunner.And("toggle package answer option \'AnswerOption11\' checkbox", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 189
testRunner.And("toggle package answer option \'AnswerOption13\' checkbox", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 190
testRunner.And("click on submit button on package question page", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 191
testRunner.Then("question progress score \'67%\' is shown on package feedback page", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "Then ");
#line 193
testRunner.When("click on back to objectives link on package feedback page", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 194
testRunner.And("click package question list item \'Question12\' of \'Objective11\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 195
testRunner.And("toggle package answer option \'AnswerOption21\' checkbox", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 196
testRunner.And("click on submit button on package question page", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 197
testRunner.Then("question progress score \'100%\' is shown on package feedback page", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "Then ");
#line 199
testRunner.When("click on back to objectives link on package feedback page", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 200
testRunner.And("toggle expand package objective item with title \'Objective12\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 201
testRunner.And("click package question list item \'Question21\' of \'Objective12\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 202
testRunner.And("toggle package answer option \'AnswerOption211\' checkbox", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 203
testRunner.And("toggle package answer option \'AnswerOption212\' checkbox", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 204
testRunner.And("click on submit button on package question page", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 205
testRunner.Then("question progress score \'50%\' is shown on package feedback page", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "Then ");
#line 207
testRunner.When("click on back to objectives link on package feedback page", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 208
testRunner.And("click package question list item \'Question22\' of \'Objective12\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 209
testRunner.And("toggle package answer option \'AnswerOption221\' checkbox", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 210
testRunner.And("toggle package answer option \'AnswerOption223\' checkbox", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 211
testRunner.And("click on submit button on package question page", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 212
testRunner.Then("question progress score \'33%\' is shown on package feedback page", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "Then ");
#line 214
testRunner.When("click on progress summary link on package feedback page", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 215
testRunner.Then("overall progress score \'63%\' is shown on package summary page", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "Then ");
#line hidden
            TechTalk.SpecFlow.Table table17 = new TechTalk.SpecFlow.Table(new string[] {
                        "Title",
                        "Value",
                        "MeterValue"});
            table17.AddRow(new string[] {
                        "Objective11",
                        "83%",
                        "width: 83%;"});
            table17.AddRow(new string[] {
                        "Objective12",
                        "42%",
                        "width: 42%;"});
#line 216
testRunner.And("objective progress list contains items with data", ((string)(null)), table17, "And ");
#line hidden
            this.ScenarioCleanup();
        }
        
        [NUnit.Framework.TestAttribute()]
        [NUnit.Framework.DescriptionAttribute("Effective score for each question is score of the last attempt for this question")]
        public virtual void EffectiveScoreForEachQuestionIsScoreOfTheLastAttemptForThisQuestion()
        {
            TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("Effective score for each question is score of the last attempt for this question", ((string[])(null)));
#line 222
this.ScenarioSetup(scenarioInfo);
#line 10
this.FeatureBackground();
#line 223
testRunner.When("toggle expand package objective item with title \'Objective11\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 224
testRunner.And("click package question list item \'Question12\' of \'Objective11\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 225
testRunner.And("toggle package answer option \'AnswerOption21\' checkbox", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 226
testRunner.And("click on submit button on package question page", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 227
testRunner.Then("question progress score \'100%\' is shown on package feedback page", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "Then ");
#line 228
testRunner.When("click on progress summary link on package feedback page", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 229
testRunner.Then("overall progress score \'25%\' is shown on package summary page", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "Then ");
#line hidden
            TechTalk.SpecFlow.Table table18 = new TechTalk.SpecFlow.Table(new string[] {
                        "Title",
                        "Value",
                        "MeterValue"});
            table18.AddRow(new string[] {
                        "Objective11",
                        "50%",
                        "width: 50%;"});
            table18.AddRow(new string[] {
                        "Objective12",
                        "0%",
                        "width: 0%;"});
#line 230
testRunner.And("objective progress list contains items with data", ((string)(null)), table18, "And ");
#line 235
testRunner.When("click on home link on progress summary page", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 236
testRunner.And("click package question list item \'Question12\' of \'Objective11\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 237
testRunner.And("toggle package answer option \'AnswerOption21\' checkbox", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 238
testRunner.And("toggle package answer option \'AnswerOption22\' checkbox", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 239
testRunner.And("click on submit button on package question page", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 240
testRunner.Then("question progress score \'50%\' is shown on package feedback page", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "Then ");
#line 241
testRunner.When("click on progress summary link on package feedback page", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 242
testRunner.Then("overall progress score \'13%\' is shown on package summary page", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "Then ");
#line hidden
            TechTalk.SpecFlow.Table table19 = new TechTalk.SpecFlow.Table(new string[] {
                        "Title",
                        "Value",
                        "MeterValue"});
            table19.AddRow(new string[] {
                        "Objective11",
                        "25%",
                        "width: 25%;"});
            table19.AddRow(new string[] {
                        "Objective12",
                        "0%",
                        "width: 0%;"});
#line 243
testRunner.And("objective progress list contains items with data", ((string)(null)), table19, "And ");
#line hidden
            this.ScenarioCleanup();
        }
    }
}
#pragma warning restore
#endregion
