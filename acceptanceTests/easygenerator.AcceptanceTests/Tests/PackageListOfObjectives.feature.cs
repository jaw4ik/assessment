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
    [NUnit.Framework.DescriptionAttribute("PackageListOfObjectives")]
    [NUnit.Framework.CategoryAttribute("PackageListOfObjectives")]
    public partial class PackageListOfObjectivesFeature
    {
        
        private static TechTalk.SpecFlow.ITestRunner testRunner;
        
#line 1 "PackageListOfObjectives.feature"
#line hidden
        
        [NUnit.Framework.TestFixtureSetUpAttribute()]
        public virtual void FeatureSetup()
        {
            testRunner = TechTalk.SpecFlow.TestRunnerManager.GetTestRunner();
            TechTalk.SpecFlow.FeatureInfo featureInfo = new TechTalk.SpecFlow.FeatureInfo(new System.Globalization.CultureInfo("en-US"), "PackageListOfObjectives", "As a learner I can unzip downloaded package and open “index” file that is contain" +
                    "ed by this package,\r\nso I\'m able to see the tree of objectives and related to th" +
                    "em questions.", ProgrammingLanguage.CSharp, new string[] {
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
#line 7
#line hidden
            TechTalk.SpecFlow.Table table1 = new TechTalk.SpecFlow.Table(new string[] {
                        "Title",
                        "Id"});
            table1.AddRow(new string[] {
                        "Experience1",
                        "1"});
            table1.AddRow(new string[] {
                        "Experience2",
                        "2"});
#line 8
testRunner.Given("publications are present in database", ((string)(null)), table1, "Given ");
#line hidden
            TechTalk.SpecFlow.Table table2 = new TechTalk.SpecFlow.Table(new string[] {
                        "Title",
                        "Id"});
            table2.AddRow(new string[] {
                        "Objective1",
                        "1"});
            table2.AddRow(new string[] {
                        "Objective2",
                        "2"});
#line 12
testRunner.Given("objectives related to \'Experience1\' are present in database", ((string)(null)), table2, "Given ");
#line hidden
            TechTalk.SpecFlow.Table table3 = new TechTalk.SpecFlow.Table(new string[] {
                        "Title",
                        "Id"});
            table3.AddRow(new string[] {
                        "Question1",
                        "1"});
            table3.AddRow(new string[] {
                        "Question2",
                        "2"});
#line 17
testRunner.Given("questions related to \'Objective1\' are present in database", ((string)(null)), table3, "Given ");
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
#line 21
testRunner.Given("answer options related to \'Question1\' of \'Objective1\' are present in database", ((string)(null)), table4, "Given ");
#line hidden
            TechTalk.SpecFlow.Table table5 = new TechTalk.SpecFlow.Table(new string[] {
                        "Text",
                        "isCorrect"});
            table5.AddRow(new string[] {
                        "AnswerOption21",
                        "true"});
            table5.AddRow(new string[] {
                        "AnswerOption22",
                        "false"});
#line 25
testRunner.Given("answer options related to \'Question2\' of \'Objective1\' are present in database", ((string)(null)), table5, "Given ");
#line hidden
            TechTalk.SpecFlow.Table table6 = new TechTalk.SpecFlow.Table(new string[] {
                        "Explanation"});
            table6.AddRow(new string[] {
                        "Explanation11"});
            table6.AddRow(new string[] {
                        "Explanation12"});
#line 29
testRunner.Given("explanations related to \'Question1\' of \'Objective1\' are present in database", ((string)(null)), table6, "Given ");
#line hidden
            TechTalk.SpecFlow.Table table7 = new TechTalk.SpecFlow.Table(new string[] {
                        "Explanation"});
            table7.AddRow(new string[] {
                        "Explanation21"});
            table7.AddRow(new string[] {
                        "Explanation22"});
#line 33
testRunner.Given("explanations related to \'Question2\' of \'Objective1\' are present in database", ((string)(null)), table7, "Given ");
#line hidden
            TechTalk.SpecFlow.Table table8 = new TechTalk.SpecFlow.Table(new string[] {
                        "Title",
                        "Id"});
            table8.AddRow(new string[] {
                        "Question21",
                        "1"});
            table8.AddRow(new string[] {
                        "Question22",
                        "2"});
#line 38
testRunner.Given("questions related to \'Objective2\' are present in database", ((string)(null)), table8, "Given ");
#line hidden
            TechTalk.SpecFlow.Table table9 = new TechTalk.SpecFlow.Table(new string[] {
                        "Text",
                        "isCorrect"});
            table9.AddRow(new string[] {
                        "AnswerOption211",
                        "true"});
            table9.AddRow(new string[] {
                        "AnswerOption212",
                        "false"});
#line 42
testRunner.Given("answer options related to \'Question21\' of \'Objective2\' are present in database", ((string)(null)), table9, "Given ");
#line hidden
            TechTalk.SpecFlow.Table table10 = new TechTalk.SpecFlow.Table(new string[] {
                        "Text",
                        "isCorrect"});
            table10.AddRow(new string[] {
                        "AnswerOption221",
                        "true"});
            table10.AddRow(new string[] {
                        "AnswerOption222",
                        "false"});
#line 46
testRunner.Given("answer options related to \'Question22\' of \'Objective2\' are present in database", ((string)(null)), table10, "Given ");
#line hidden
            TechTalk.SpecFlow.Table table11 = new TechTalk.SpecFlow.Table(new string[] {
                        "Explanation"});
            table11.AddRow(new string[] {
                        "Explanation211"});
            table11.AddRow(new string[] {
                        "Explanation212"});
#line 50
testRunner.Given("explanations related to \'Question21\' of \'Objective2\' are present in database", ((string)(null)), table11, "Given ");
#line hidden
            TechTalk.SpecFlow.Table table12 = new TechTalk.SpecFlow.Table(new string[] {
                        "Explanation"});
            table12.AddRow(new string[] {
                        "Explanation221"});
            table12.AddRow(new string[] {
                        "Explanation222"});
#line 54
testRunner.Given("explanations related to \'Question22\' of \'Objective2\' are present in database", ((string)(null)), table12, "Given ");
#line 59
testRunner.And("open page by url \'http://localhost:5656/#/experiences\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 60
testRunner.And("mouse hover element of publications list with title \'Experience1\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 61
testRunner.And("click build publication list item with title \'Experience1\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 62
testRunner.And("mouse hover element of publications list with title \'Experience1\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 63
testRunner.And("click download publication list item with title \'Experience1\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 64
testRunner.And("unzip \'1.zip\' package to \'tmp\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line hidden
        }
        
        [NUnit.Framework.TestAttribute()]
        [NUnit.Framework.DescriptionAttribute("All package objectives are present on page")]
        public virtual void AllPackageObjectivesArePresentOnPage()
        {
            TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("All package objectives are present on page", ((string[])(null)));
#line 66
this.ScenarioSetup(scenarioInfo);
#line 7
this.FeatureBackground();
#line 67
testRunner.When("open page by url \'http://localhost:5656/Templates/tmp\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line hidden
            TechTalk.SpecFlow.Table table13 = new TechTalk.SpecFlow.Table(new string[] {
                        "Title"});
            table13.AddRow(new string[] {
                        "Objective1"});
            table13.AddRow(new string[] {
                        "Objective2"});
#line 68
testRunner.Then("package objectives tiles list contains only items with data", ((string)(null)), table13, "Then ");
#line hidden
            this.ScenarioCleanup();
        }
    }
}
#pragma warning restore
#endregion
