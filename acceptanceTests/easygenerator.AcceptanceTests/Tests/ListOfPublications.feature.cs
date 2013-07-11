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
    [NUnit.Framework.DescriptionAttribute("ListOfPublications")]
    [NUnit.Framework.CategoryAttribute("ExperiencesList")]
    public partial class ListOfPublicationsFeature
    {
        
        private static TechTalk.SpecFlow.ITestRunner testRunner;
        
#line 1 "ListOfPublications.feature"
#line hidden
        
        [NUnit.Framework.TestFixtureSetUpAttribute()]
        public virtual void FeatureSetup()
        {
            testRunner = TechTalk.SpecFlow.TestRunnerManager.GetTestRunner();
            TechTalk.SpecFlow.FeatureInfo featureInfo = new TechTalk.SpecFlow.FeatureInfo(new System.Globalization.CultureInfo("en-US"), "ListOfPublications", "As an author I want to see list of previously created Publications,\r\nso I could c" +
                    "orrect needed settings and perform publication once more without defining all th" +
                    "e settings each time.", ProgrammingLanguage.CSharp, new string[] {
                        "ExperiencesList"});
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
testRunner.When("open page by url \'http://localhost:5656\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line hidden
        }
        
        [NUnit.Framework.TestAttribute()]
        [NUnit.Framework.DescriptionAttribute("All publications should be present in list")]
        public virtual void AllPublicationsShouldBePresentInList()
        {
            TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("All publications should be present in list", ((string[])(null)));
#line 9
this.ScenarioSetup(scenarioInfo);
#line 6
this.FeatureBackground();
#line hidden
            TechTalk.SpecFlow.Table table1 = new TechTalk.SpecFlow.Table(new string[] {
                        "Title"});
            table1.AddRow(new string[] {
                        "Publication1"});
            table1.AddRow(new string[] {
                        "Publication2"});
            table1.AddRow(new string[] {
                        "Publication3"});
#line 10
testRunner.Given("publications are present in database", ((string)(null)), table1, "Given ");
#line 15
testRunner.When("click on tab publications link on objectives list page", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line hidden
            TechTalk.SpecFlow.Table table2 = new TechTalk.SpecFlow.Table(new string[] {
                        "Title"});
            table2.AddRow(new string[] {
                        "Publication1"});
            table2.AddRow(new string[] {
                        "Publication2"});
            table2.AddRow(new string[] {
                        "Publication3"});
#line 16
testRunner.Then("publications tiles list contains items with data", ((string)(null)), table2, "Then ");
#line hidden
            this.ScenarioCleanup();
        }
        
        [NUnit.Framework.TestAttribute()]
        [NUnit.Framework.DescriptionAttribute("Publications are sorted by title ascending by default")]
        public virtual void PublicationsAreSortedByTitleAscendingByDefault()
        {
            TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("Publications are sorted by title ascending by default", ((string[])(null)));
#line 23
this.ScenarioSetup(scenarioInfo);
#line 6
this.FeatureBackground();
#line hidden
            TechTalk.SpecFlow.Table table3 = new TechTalk.SpecFlow.Table(new string[] {
                        "Title"});
            table3.AddRow(new string[] {
                        "Publication_a"});
            table3.AddRow(new string[] {
                        "a_Publication"});
            table3.AddRow(new string[] {
                        "Publication_z"});
            table3.AddRow(new string[] {
                        "1_Publication"});
            table3.AddRow(new string[] {
                        "_Publication"});
#line 24
testRunner.Given("publications are present in database", ((string)(null)), table3, "Given ");
#line 31
testRunner.When("click on tab publications link on objectives list page", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line hidden
            TechTalk.SpecFlow.Table table4 = new TechTalk.SpecFlow.Table(new string[] {
                        "Title"});
            table4.AddRow(new string[] {
                        "1_Publication"});
            table4.AddRow(new string[] {
                        "_Publication"});
            table4.AddRow(new string[] {
                        "a_Publication"});
            table4.AddRow(new string[] {
                        "Publication_a"});
            table4.AddRow(new string[] {
                        "Publication_z"});
#line 32
testRunner.Then("publications tiles list consists of ordered items", ((string)(null)), table4, "Then ");
#line 39
testRunner.And("publications list order switch is set to \'ascending\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line hidden
            this.ScenarioCleanup();
        }
        
        [NUnit.Framework.TestAttribute()]
        [NUnit.Framework.DescriptionAttribute("Publications are sorted by title descending if set descending order")]
        public virtual void PublicationsAreSortedByTitleDescendingIfSetDescendingOrder()
        {
            TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("Publications are sorted by title descending if set descending order", ((string[])(null)));
#line 42
this.ScenarioSetup(scenarioInfo);
#line 6
this.FeatureBackground();
#line hidden
            TechTalk.SpecFlow.Table table5 = new TechTalk.SpecFlow.Table(new string[] {
                        "Title"});
            table5.AddRow(new string[] {
                        "Publication_a"});
            table5.AddRow(new string[] {
                        "a_Publication"});
            table5.AddRow(new string[] {
                        "Publication_z"});
            table5.AddRow(new string[] {
                        "_Publication"});
            table5.AddRow(new string[] {
                        "1_Publication"});
#line 43
testRunner.Given("publications are present in database", ((string)(null)), table5, "Given ");
#line 50
testRunner.When("click on tab publications link on objectives list page", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 51
testRunner.And("I switch publications list order to \'ascending\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 52
testRunner.And("I switch publications list order to \'descending\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line hidden
            TechTalk.SpecFlow.Table table6 = new TechTalk.SpecFlow.Table(new string[] {
                        "Title"});
            table6.AddRow(new string[] {
                        "Publication_z"});
            table6.AddRow(new string[] {
                        "Publication_a"});
            table6.AddRow(new string[] {
                        "a_Publication"});
            table6.AddRow(new string[] {
                        "_Publication"});
            table6.AddRow(new string[] {
                        "1_Publication"});
#line 53
testRunner.Then("publications tiles list consists of ordered items", ((string)(null)), table6, "Then ");
#line 60
testRunner.And("publications list order switch is set to \'descending\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line hidden
            this.ScenarioCleanup();
        }
        
        [NUnit.Framework.TestAttribute()]
        [NUnit.Framework.DescriptionAttribute("Publications are sorted by title ascending if set ascending order")]
        public virtual void PublicationsAreSortedByTitleAscendingIfSetAscendingOrder()
        {
            TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("Publications are sorted by title ascending if set ascending order", ((string[])(null)));
#line 62
this.ScenarioSetup(scenarioInfo);
#line 6
this.FeatureBackground();
#line hidden
            TechTalk.SpecFlow.Table table7 = new TechTalk.SpecFlow.Table(new string[] {
                        "Title"});
            table7.AddRow(new string[] {
                        "Publication_a"});
            table7.AddRow(new string[] {
                        "a_Publication"});
            table7.AddRow(new string[] {
                        "Publication_z"});
            table7.AddRow(new string[] {
                        "1_Publication"});
            table7.AddRow(new string[] {
                        "_Publication"});
#line 63
testRunner.Given("publications are present in database", ((string)(null)), table7, "Given ");
#line 70
testRunner.When("click on tab publications link on objectives list page", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 71
testRunner.And("I switch publications list order to \'descending\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 72
testRunner.And("I switch publications list order to \'ascending\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line hidden
            TechTalk.SpecFlow.Table table8 = new TechTalk.SpecFlow.Table(new string[] {
                        "Title"});
            table8.AddRow(new string[] {
                        "1_Publication"});
            table8.AddRow(new string[] {
                        "_Publication"});
            table8.AddRow(new string[] {
                        "a_Publication"});
            table8.AddRow(new string[] {
                        "Publication_a"});
            table8.AddRow(new string[] {
                        "Publication_z"});
#line 73
testRunner.Then("publications tiles list consists of ordered items", ((string)(null)), table8, "Then ");
#line 80
testRunner.And("publications list order switch is set to \'ascending\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line hidden
            this.ScenarioCleanup();
        }
        
        [NUnit.Framework.TestAttribute()]
        [NUnit.Framework.DescriptionAttribute("Selected publication should be highlited after selecting")]
        public virtual void SelectedPublicationShouldBeHighlitedAfterSelecting()
        {
            TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("Selected publication should be highlited after selecting", ((string[])(null)));
#line 82
this.ScenarioSetup(scenarioInfo);
#line 6
this.FeatureBackground();
#line hidden
            TechTalk.SpecFlow.Table table9 = new TechTalk.SpecFlow.Table(new string[] {
                        "Title"});
            table9.AddRow(new string[] {
                        "Publication1"});
            table9.AddRow(new string[] {
                        "Publication2"});
            table9.AddRow(new string[] {
                        "Publication3"});
#line 83
testRunner.Given("publications are present in database", ((string)(null)), table9, "Given ");
#line 88
testRunner.When("click on tab publications link on objectives list page", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 89
testRunner.And("mouse hover element of publications list with title \'Publication2\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 90
testRunner.And("select publication list item with title \'Publication2\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 91
testRunner.Then("publication list item with title \'Publication2\' is selected", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "Then ");
#line 92
testRunner.But("publication list item with title \'Publication1\' is not selected", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "But ");
#line 93
testRunner.And("publication list item with title \'Publication3\' is not selected", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line hidden
            this.ScenarioCleanup();
        }
        
        [NUnit.Framework.TestAttribute()]
        [NUnit.Framework.DescriptionAttribute("No publications are selected by default in publications list")]
        public virtual void NoPublicationsAreSelectedByDefaultInPublicationsList()
        {
            TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("No publications are selected by default in publications list", ((string[])(null)));
#line 96
this.ScenarioSetup(scenarioInfo);
#line 6
this.FeatureBackground();
#line hidden
            TechTalk.SpecFlow.Table table10 = new TechTalk.SpecFlow.Table(new string[] {
                        "Title"});
            table10.AddRow(new string[] {
                        "Publication1"});
            table10.AddRow(new string[] {
                        "Publication2"});
            table10.AddRow(new string[] {
                        "Publication3"});
#line 97
testRunner.Given("publications are present in database", ((string)(null)), table10, "Given ");
#line 102
testRunner.When("click on tab publications link on objectives list page", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 103
testRunner.Then("publication list item with title \'Publication2\' is not selected", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "Then ");
#line 104
testRunner.And("publication list item with title \'Publication1\' is not selected", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 105
testRunner.And("publication list item with title \'Publication3\' is not selected", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line hidden
            this.ScenarioCleanup();
        }
        
        [NUnit.Framework.TestAttribute()]
        [NUnit.Framework.DescriptionAttribute("Publications list columns count should depend on screen width")]
        [NUnit.Framework.TestCaseAttribute("640", "1", null)]
        [NUnit.Framework.TestCaseAttribute("800", "2", null)]
        [NUnit.Framework.TestCaseAttribute("1200", "3", null)]
        [NUnit.Framework.TestCaseAttribute("1600", "3", null)]
        public virtual void PublicationsListColumnsCountShouldDependOnScreenWidth(string windowWidth, string columnsCount, string[] exampleTags)
        {
            TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("Publications list columns count should depend on screen width", exampleTags);
#line 108
this.ScenarioSetup(scenarioInfo);
#line 6
this.FeatureBackground();
#line hidden
            TechTalk.SpecFlow.Table table11 = new TechTalk.SpecFlow.Table(new string[] {
                        "Title"});
            table11.AddRow(new string[] {
                        "Publication1"});
            table11.AddRow(new string[] {
                        "Publication2"});
            table11.AddRow(new string[] {
                        "Publication3"});
            table11.AddRow(new string[] {
                        "Publication4"});
            table11.AddRow(new string[] {
                        "Publication5"});
#line 109
testRunner.Given("publications are present in database", ((string)(null)), table11, "Given ");
#line 116
testRunner.When("click on tab publications link on objectives list page", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 117
testRunner.And(string.Format("browser window width and height is set to {0} and 600", windowWidth), ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 118
testRunner.Then(string.Format("publications list is displayed in {0} columns", columnsCount), ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "Then ");
#line hidden
            this.ScenarioCleanup();
        }
        
        [NUnit.Framework.TestAttribute()]
        [NUnit.Framework.DescriptionAttribute("All elements of publications list can be made visible using scroll")]
        public virtual void AllElementsOfPublicationsListCanBeMadeVisibleUsingScroll()
        {
            TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("All elements of publications list can be made visible using scroll", ((string[])(null)));
#line 127
this.ScenarioSetup(scenarioInfo);
#line 6
this.FeatureBackground();
#line hidden
            TechTalk.SpecFlow.Table table12 = new TechTalk.SpecFlow.Table(new string[] {
                        "Title"});
            table12.AddRow(new string[] {
                        "Publication1"});
            table12.AddRow(new string[] {
                        "Publication2"});
            table12.AddRow(new string[] {
                        "Publication3"});
            table12.AddRow(new string[] {
                        "Publication4"});
            table12.AddRow(new string[] {
                        "Publication5"});
#line 128
testRunner.Given("publications are present in database", ((string)(null)), table12, "Given ");
#line 135
testRunner.When("click on tab publications link on objectives list page", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 136
testRunner.And("browser window width and height is set to 400 and 300", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 137
testRunner.And("scroll publication with title \'Publication5\' into the view", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 138
testRunner.Then("element with title \'Publication5\' of publications list is visible", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "Then ");
#line hidden
            this.ScenarioCleanup();
        }
        
        [NUnit.Framework.TestAttribute()]
        [NUnit.Framework.DescriptionAttribute("Actions open and select are enabled if hover item of publications list")]
        public virtual void ActionsOpenAndSelectAreEnabledIfHoverItemOfPublicationsList()
        {
            TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("Actions open and select are enabled if hover item of publications list", ((string[])(null)));
#line 141
this.ScenarioSetup(scenarioInfo);
#line 6
this.FeatureBackground();
#line hidden
            TechTalk.SpecFlow.Table table13 = new TechTalk.SpecFlow.Table(new string[] {
                        "Title"});
            table13.AddRow(new string[] {
                        "Publication1"});
            table13.AddRow(new string[] {
                        "Publication2"});
            table13.AddRow(new string[] {
                        "Publication3"});
#line 142
testRunner.Given("publications are present in database", ((string)(null)), table13, "Given ");
#line 147
testRunner.When("click on tab publications link on objectives list page", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 148
testRunner.And("mouse hover element of publications list with title \'Publication1\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 149
testRunner.Then("Action open is enabled true for publications list item with title \'Publication1\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "Then ");
#line 150
testRunner.And("Action select is enabled true for publications list item with title \'Publication1" +
                    "\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line hidden
            this.ScenarioCleanup();
        }
        
        [NUnit.Framework.TestAttribute()]
        [NUnit.Framework.DescriptionAttribute("Open action of publications list item navigates to publication\'s editing page")]
        public virtual void OpenActionOfPublicationsListItemNavigatesToPublicationSEditingPage()
        {
            TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("Open action of publications list item navigates to publication\'s editing page", ((string[])(null)));
#line 153
this.ScenarioSetup(scenarioInfo);
#line 6
this.FeatureBackground();
#line hidden
            TechTalk.SpecFlow.Table table14 = new TechTalk.SpecFlow.Table(new string[] {
                        "Title",
                        "Id"});
            table14.AddRow(new string[] {
                        "Publication1",
                        "1"});
#line 154
testRunner.Given("publications are present in database", ((string)(null)), table14, "Given ");
#line 157
testRunner.When("click on tab publications link on objectives list page", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 158
testRunner.And("mouse hover element of publications list with title \'Publication1\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 159
testRunner.And("click open publication list item with title \'Publication1\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 160
testRunner.Then("browser navigates to url \'http://localhost:5656/#/experience/1\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "Then ");
#line hidden
            this.ScenarioCleanup();
        }
        
        [NUnit.Framework.TestAttribute()]
        [NUnit.Framework.DescriptionAttribute("Sorting order should be saved when navigate to other page")]
        public virtual void SortingOrderShouldBeSavedWhenNavigateToOtherPage()
        {
            TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("Sorting order should be saved when navigate to other page", ((string[])(null)));
#line 163
this.ScenarioSetup(scenarioInfo);
#line 6
this.FeatureBackground();
#line hidden
            TechTalk.SpecFlow.Table table15 = new TechTalk.SpecFlow.Table(new string[] {
                        "Title"});
            table15.AddRow(new string[] {
                        "Publication_a"});
            table15.AddRow(new string[] {
                        "a_Publication"});
            table15.AddRow(new string[] {
                        "Publication_z"});
            table15.AddRow(new string[] {
                        "1_Publication"});
            table15.AddRow(new string[] {
                        "_Publication"});
#line 164
testRunner.Given("publications are present in database", ((string)(null)), table15, "Given ");
#line 171
testRunner.When("I switch objectives list order to \'descending\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 172
testRunner.And("click on tab objectives link on publications list page", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 173
testRunner.But("click on tab publications link on objectives list page", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "But ");
#line hidden
            TechTalk.SpecFlow.Table table16 = new TechTalk.SpecFlow.Table(new string[] {
                        "Title"});
            table16.AddRow(new string[] {
                        "Publication_z"});
            table16.AddRow(new string[] {
                        "Publication_a"});
            table16.AddRow(new string[] {
                        "a_Publication"});
            table16.AddRow(new string[] {
                        "_Publication"});
            table16.AddRow(new string[] {
                        "1_Publication"});
#line 174
testRunner.Then("publications tiles list consists of ordered items", ((string)(null)), table16, "Then ");
#line hidden
            this.ScenarioCleanup();
        }
    }
}
#pragma warning restore
#endregion
