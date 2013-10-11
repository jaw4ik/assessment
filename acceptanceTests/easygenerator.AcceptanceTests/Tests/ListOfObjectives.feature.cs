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
    [NUnit.Framework.DescriptionAttribute("ListOfObjectives")]
    [NUnit.Framework.CategoryAttribute("ListOfObjectives")]
    public partial class ListOfObjectivesFeature
    {
        
        private static TechTalk.SpecFlow.ITestRunner testRunner;
        
#line 1 "ListOfObjectives.feature"
#line hidden
        
        [NUnit.Framework.TestFixtureSetUpAttribute()]
        public virtual void FeatureSetup()
        {
            testRunner = TechTalk.SpecFlow.TestRunnerManager.GetTestRunner();
            TechTalk.SpecFlow.FeatureInfo featureInfo = new TechTalk.SpecFlow.FeatureInfo(new System.Globalization.CultureInfo("en-US"), "ListOfObjectives", "As an author I want to see list of previously created Learning Objectives, so I c" +
                    "ould select certain Learning Objective to start working with related content.", ProgrammingLanguage.CSharp, new string[] {
                        "ListOfObjectives"});
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
#line 7
testRunner.When("open page by url \'http://localhost:5656/signin\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 8
testRunner.And("sign in as \'test\' user on sign in page", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 9
testRunner.Then("browser navigates to url \'http://localhost:5656/\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "Then ");
#line hidden
        }
        
        [NUnit.Framework.TestAttribute()]
        [NUnit.Framework.DescriptionAttribute("All objectives should be present in list")]
        public virtual void AllObjectivesShouldBePresentInList()
        {
            TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("All objectives should be present in list", ((string[])(null)));
#line 12
this.ScenarioSetup(scenarioInfo);
#line 5
this.FeatureBackground();
#line hidden
            TechTalk.SpecFlow.Table table1 = new TechTalk.SpecFlow.Table(new string[] {
                        "Title"});
            table1.AddRow(new string[] {
                        "Objective1"});
            table1.AddRow(new string[] {
                        "Objective2"});
            table1.AddRow(new string[] {
                        "Objective3"});
#line 13
testRunner.Given("objectives are present in database", ((string)(null)), table1, "Given ");
#line 18
testRunner.When("open page by url \'http://localhost:5656/#objectives\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line hidden
            TechTalk.SpecFlow.Table table2 = new TechTalk.SpecFlow.Table(new string[] {
                        "Title"});
            table2.AddRow(new string[] {
                        "Objective1"});
            table2.AddRow(new string[] {
                        "Objective2"});
            table2.AddRow(new string[] {
                        "Objective3"});
#line 19
testRunner.Then("objectives tiles list contains items with data", ((string)(null)), table2, "Then ");
#line hidden
            this.ScenarioCleanup();
        }
        
        [NUnit.Framework.TestAttribute()]
        [NUnit.Framework.DescriptionAttribute("Objectives list item name could contain special symbols")]
        public virtual void ObjectivesListItemNameCouldContainSpecialSymbols()
        {
            TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("Objectives list item name could contain special symbols", ((string[])(null)));
#line 25
this.ScenarioSetup(scenarioInfo);
#line 5
this.FeatureBackground();
#line hidden
            TechTalk.SpecFlow.Table table3 = new TechTalk.SpecFlow.Table(new string[] {
                        "Title"});
            table3.AddRow(new string[] {
                        "~`!@#$%^&*()_+-={[]}:;\"\'|\\<,.>/?№ё"});
#line 26
testRunner.Given("objectives are present in database", ((string)(null)), table3, "Given ");
#line 29
testRunner.When("open page by url \'http://localhost:5656/#objectives\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line hidden
            TechTalk.SpecFlow.Table table4 = new TechTalk.SpecFlow.Table(new string[] {
                        "Title"});
            table4.AddRow(new string[] {
                        "~`!@#$%^&*()_+-={[]}:;\"\'|\\<,.>/?№ё"});
#line 30
testRunner.Then("objectives tiles list contains items with data", ((string)(null)), table4, "Then ");
#line hidden
            this.ScenarioCleanup();
        }
        
        [NUnit.Framework.TestAttribute()]
        [NUnit.Framework.DescriptionAttribute("Objectives are sorted by title ascending by default")]
        public virtual void ObjectivesAreSortedByTitleAscendingByDefault()
        {
            TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("Objectives are sorted by title ascending by default", ((string[])(null)));
#line 34
this.ScenarioSetup(scenarioInfo);
#line 5
this.FeatureBackground();
#line hidden
            TechTalk.SpecFlow.Table table5 = new TechTalk.SpecFlow.Table(new string[] {
                        "Title"});
            table5.AddRow(new string[] {
                        "Objective_a"});
            table5.AddRow(new string[] {
                        "objective_b"});
            table5.AddRow(new string[] {
                        "a_Objective"});
            table5.AddRow(new string[] {
                        "Objective_z"});
            table5.AddRow(new string[] {
                        "1_Objective"});
            table5.AddRow(new string[] {
                        "_Objective"});
#line 35
testRunner.Given("objectives are present in database", ((string)(null)), table5, "Given ");
#line 43
testRunner.When("open page by url \'http://localhost:5656/#objectives\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line hidden
            TechTalk.SpecFlow.Table table6 = new TechTalk.SpecFlow.Table(new string[] {
                        "Title"});
            table6.AddRow(new string[] {
                        "1_Objective"});
            table6.AddRow(new string[] {
                        "_Objective"});
            table6.AddRow(new string[] {
                        "a_Objective"});
            table6.AddRow(new string[] {
                        "Objective_a"});
            table6.AddRow(new string[] {
                        "objective_b"});
            table6.AddRow(new string[] {
                        "Objective_z"});
#line 44
testRunner.Then("objectives tiles list consists of ordered items", ((string)(null)), table6, "Then ");
#line 52
testRunner.And("objectives list order switch is set to \'ascending\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line hidden
            this.ScenarioCleanup();
        }
        
        [NUnit.Framework.TestAttribute()]
        [NUnit.Framework.DescriptionAttribute("Objectives are sorted by title descending if set descending order")]
        public virtual void ObjectivesAreSortedByTitleDescendingIfSetDescendingOrder()
        {
            TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("Objectives are sorted by title descending if set descending order", ((string[])(null)));
#line 54
this.ScenarioSetup(scenarioInfo);
#line 5
this.FeatureBackground();
#line hidden
            TechTalk.SpecFlow.Table table7 = new TechTalk.SpecFlow.Table(new string[] {
                        "Title"});
            table7.AddRow(new string[] {
                        "Objective_a"});
            table7.AddRow(new string[] {
                        "a_Objective"});
            table7.AddRow(new string[] {
                        "Objective_z"});
            table7.AddRow(new string[] {
                        "1_Objective"});
            table7.AddRow(new string[] {
                        "_Objective"});
#line 55
testRunner.Given("objectives are present in database", ((string)(null)), table7, "Given ");
#line 62
testRunner.When("open page by url \'http://localhost:5656/#objectives\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 63
testRunner.When("I switch objectives list order to \'ascending\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 64
testRunner.And("I switch objectives list order to \'descending\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line hidden
            TechTalk.SpecFlow.Table table8 = new TechTalk.SpecFlow.Table(new string[] {
                        "Title"});
            table8.AddRow(new string[] {
                        "Objective_z"});
            table8.AddRow(new string[] {
                        "Objective_a"});
            table8.AddRow(new string[] {
                        "a_Objective"});
            table8.AddRow(new string[] {
                        "_Objective"});
            table8.AddRow(new string[] {
                        "1_Objective"});
#line 65
testRunner.Then("objectives tiles list consists of ordered items", ((string)(null)), table8, "Then ");
#line 72
testRunner.And("objectives list order switch is set to \'descending\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line hidden
            this.ScenarioCleanup();
        }
        
        [NUnit.Framework.TestAttribute()]
        [NUnit.Framework.DescriptionAttribute("Objectives are sorted by title ascending if set ascending order")]
        public virtual void ObjectivesAreSortedByTitleAscendingIfSetAscendingOrder()
        {
            TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("Objectives are sorted by title ascending if set ascending order", ((string[])(null)));
#line 74
this.ScenarioSetup(scenarioInfo);
#line 5
this.FeatureBackground();
#line hidden
            TechTalk.SpecFlow.Table table9 = new TechTalk.SpecFlow.Table(new string[] {
                        "Title"});
            table9.AddRow(new string[] {
                        "Objective_a"});
            table9.AddRow(new string[] {
                        "a_Objective"});
            table9.AddRow(new string[] {
                        "Objective_z"});
            table9.AddRow(new string[] {
                        "1_Objective"});
            table9.AddRow(new string[] {
                        "_Objective"});
#line 75
testRunner.Given("objectives are present in database", ((string)(null)), table9, "Given ");
#line 82
testRunner.When("open page by url \'http://localhost:5656/#objectives\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 83
testRunner.When("I switch objectives list order to \'descending\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 84
testRunner.And("I switch objectives list order to \'ascending\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line hidden
            TechTalk.SpecFlow.Table table10 = new TechTalk.SpecFlow.Table(new string[] {
                        "Title"});
            table10.AddRow(new string[] {
                        "1_Objective"});
            table10.AddRow(new string[] {
                        "_Objective"});
            table10.AddRow(new string[] {
                        "a_Objective"});
            table10.AddRow(new string[] {
                        "Objective_a"});
            table10.AddRow(new string[] {
                        "Objective_z"});
#line 85
testRunner.Then("objectives tiles list consists of ordered items", ((string)(null)), table10, "Then ");
#line 92
testRunner.And("objectives list order switch is set to \'ascending\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line hidden
            this.ScenarioCleanup();
        }
        
        [NUnit.Framework.TestAttribute()]
        [NUnit.Framework.DescriptionAttribute("Selected objective should be highlited after selecting")]
        public virtual void SelectedObjectiveShouldBeHighlitedAfterSelecting()
        {
            TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("Selected objective should be highlited after selecting", ((string[])(null)));
#line 94
this.ScenarioSetup(scenarioInfo);
#line 5
this.FeatureBackground();
#line hidden
            TechTalk.SpecFlow.Table table11 = new TechTalk.SpecFlow.Table(new string[] {
                        "Title"});
            table11.AddRow(new string[] {
                        "Objective1"});
            table11.AddRow(new string[] {
                        "Objective2"});
            table11.AddRow(new string[] {
                        "Objective3"});
#line 95
testRunner.Given("objectives are present in database", ((string)(null)), table11, "Given ");
#line 100
testRunner.When("open page by url \'http://localhost:5656/#objectives\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 101
testRunner.When("mouse hover element of objectives list with title \'Objective2\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 102
testRunner.And("select objective list item with title \'Objective2\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 103
testRunner.Then("objective list item with title \'Objective2\' is selected", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "Then ");
#line 104
testRunner.But("objective list item with title \'Objective1\' is not selected", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "But ");
#line 105
testRunner.And("objective list item with title \'Objective3\' is not selected", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line hidden
            this.ScenarioCleanup();
        }
        
        [NUnit.Framework.TestAttribute()]
        [NUnit.Framework.DescriptionAttribute("Objective could be deselected")]
        public virtual void ObjectiveCouldBeDeselected()
        {
            TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("Objective could be deselected", ((string[])(null)));
#line 107
this.ScenarioSetup(scenarioInfo);
#line 5
this.FeatureBackground();
#line hidden
            TechTalk.SpecFlow.Table table12 = new TechTalk.SpecFlow.Table(new string[] {
                        "Title"});
            table12.AddRow(new string[] {
                        "Objective1"});
            table12.AddRow(new string[] {
                        "Objective2"});
            table12.AddRow(new string[] {
                        "Objective3"});
#line 108
testRunner.Given("objectives are present in database", ((string)(null)), table12, "Given ");
#line 113
testRunner.When("open page by url \'http://localhost:5656/#objectives\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 114
testRunner.When("mouse hover element of objectives list with title \'Objective1\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 115
testRunner.And("select objective list item with title \'Objective1\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 116
testRunner.And("mouse hover element of objectives list with title \'Objective2\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 117
testRunner.And("select objective list item with title \'Objective2\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 118
testRunner.And("mouse hover element of objectives list with title \'Objective3\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 119
testRunner.And("select objective list item with title \'Objective3\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 120
testRunner.And("mouse hover element of objectives list with title \'Objective1\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 121
testRunner.And("select objective list item with title \'Objective1\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 122
testRunner.And("mouse hover element of objectives list with title \'Objective2\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 123
testRunner.And("select objective list item with title \'Objective2\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 124
testRunner.Then("objective list item with title \'Objective1\' is not selected", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "Then ");
#line 125
testRunner.But("objective list item with title \'Objective2\' is not selected", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "But ");
#line 126
testRunner.And("objective list item with title \'Objective3\' is selected", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line hidden
            this.ScenarioCleanup();
        }
        
        [NUnit.Framework.TestAttribute()]
        [NUnit.Framework.DescriptionAttribute("No objectives are selected by default in objectives list")]
        public virtual void NoObjectivesAreSelectedByDefaultInObjectivesList()
        {
            TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("No objectives are selected by default in objectives list", ((string[])(null)));
#line 128
this.ScenarioSetup(scenarioInfo);
#line 5
this.FeatureBackground();
#line hidden
            TechTalk.SpecFlow.Table table13 = new TechTalk.SpecFlow.Table(new string[] {
                        "Title"});
            table13.AddRow(new string[] {
                        "Objective1"});
            table13.AddRow(new string[] {
                        "Objective2"});
            table13.AddRow(new string[] {
                        "Objective3"});
#line 129
testRunner.Given("objectives are present in database", ((string)(null)), table13, "Given ");
#line 134
testRunner.When("open page by url \'http://localhost:5656/#objectives\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 135
testRunner.Then("objective list item with title \'Objective2\' is not selected", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "Then ");
#line 136
testRunner.And("objective list item with title \'Objective1\' is not selected", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 137
testRunner.And("objective list item with title \'Objective3\' is not selected", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line hidden
            this.ScenarioCleanup();
        }
        
        [NUnit.Framework.TestAttribute()]
        [NUnit.Framework.DescriptionAttribute("Objectives list columns count should depend on screen width")]
        [NUnit.Framework.TestCaseAttribute("650", "1", null)]
        [NUnit.Framework.TestCaseAttribute("800", "2", null)]
        [NUnit.Framework.TestCaseAttribute("1200", "3", null)]
        [NUnit.Framework.TestCaseAttribute("1600", "3", null)]
        public virtual void ObjectivesListColumnsCountShouldDependOnScreenWidth(string windowWidth, string columnsCount, string[] exampleTags)
        {
            TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("Objectives list columns count should depend on screen width", exampleTags);
#line 140
this.ScenarioSetup(scenarioInfo);
#line 5
this.FeatureBackground();
#line hidden
            TechTalk.SpecFlow.Table table14 = new TechTalk.SpecFlow.Table(new string[] {
                        "Title"});
            table14.AddRow(new string[] {
                        "Objective1"});
            table14.AddRow(new string[] {
                        "Objective2"});
            table14.AddRow(new string[] {
                        "Objective3"});
            table14.AddRow(new string[] {
                        "Objective4"});
            table14.AddRow(new string[] {
                        "Objective5"});
#line 141
testRunner.Given("objectives are present in database", ((string)(null)), table14, "Given ");
#line 148
testRunner.When("open page by url \'http://localhost:5656/#objectives\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 149
testRunner.When(string.Format("browser window width and height is set to {0} and 600", windowWidth), ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 150
testRunner.Then(string.Format("objectives list is displayed in {0} columns", columnsCount), ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "Then ");
#line hidden
            this.ScenarioCleanup();
        }
        
        [NUnit.Framework.TestAttribute()]
        [NUnit.Framework.DescriptionAttribute("All elements of objectives list can be made visible using scroll")]
        public virtual void AllElementsOfObjectivesListCanBeMadeVisibleUsingScroll()
        {
            TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("All elements of objectives list can be made visible using scroll", ((string[])(null)));
#line 159
this.ScenarioSetup(scenarioInfo);
#line 5
this.FeatureBackground();
#line hidden
            TechTalk.SpecFlow.Table table15 = new TechTalk.SpecFlow.Table(new string[] {
                        "Title"});
            table15.AddRow(new string[] {
                        "Objective1"});
            table15.AddRow(new string[] {
                        "Objective2"});
            table15.AddRow(new string[] {
                        "Objective3"});
            table15.AddRow(new string[] {
                        "Objective4"});
            table15.AddRow(new string[] {
                        "Objective5"});
#line 160
testRunner.Given("objectives are present in database", ((string)(null)), table15, "Given ");
#line 167
testRunner.When("open page by url \'http://localhost:5656/#objectives\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 168
testRunner.When("browser window width and height is set to 600 and 600", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 169
testRunner.And("scroll objective with title \'Objective5\' into the view", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 170
testRunner.Then("element of objectives list with title \'Objective5\' is visible", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "Then ");
#line hidden
            this.ScenarioCleanup();
        }
        
        [NUnit.Framework.TestAttribute()]
        [NUnit.Framework.DescriptionAttribute("Actions open and select are enabled if hover item of objectives list")]
        [NUnit.Framework.CategoryAttribute("NotFirefox")]
        public virtual void ActionsOpenAndSelectAreEnabledIfHoverItemOfObjectivesList()
        {
            TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("Actions open and select are enabled if hover item of objectives list", new string[] {
                        "NotFirefox"});
#line 173
this.ScenarioSetup(scenarioInfo);
#line 5
this.FeatureBackground();
#line hidden
            TechTalk.SpecFlow.Table table16 = new TechTalk.SpecFlow.Table(new string[] {
                        "Title"});
            table16.AddRow(new string[] {
                        "Objective1"});
            table16.AddRow(new string[] {
                        "Objective2"});
            table16.AddRow(new string[] {
                        "Objective3"});
#line 174
testRunner.Given("objectives are present in database", ((string)(null)), table16, "Given ");
#line 179
testRunner.When("open page by url \'http://localhost:5656/#objectives\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 180
testRunner.When("mouse hover element of objectives list with title \'Objective1\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 181
testRunner.Then("Action open is enabled true for objectives list item with title \'Objective1\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "Then ");
#line 182
testRunner.And("Action select is enabled true for objectives list item with title \'Objective1\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line hidden
            this.ScenarioCleanup();
        }
        
        [NUnit.Framework.TestAttribute()]
        [NUnit.Framework.DescriptionAttribute("Open action of objectives list item navigates to objective\'s editing page")]
        [NUnit.Framework.CategoryAttribute("NotFirefox")]
        public virtual void OpenActionOfObjectivesListItemNavigatesToObjectiveSEditingPage()
        {
            TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("Open action of objectives list item navigates to objective\'s editing page", new string[] {
                        "NotFirefox"});
#line 186
this.ScenarioSetup(scenarioInfo);
#line 5
this.FeatureBackground();
#line hidden
            TechTalk.SpecFlow.Table table17 = new TechTalk.SpecFlow.Table(new string[] {
                        "Title",
                        "Id"});
            table17.AddRow(new string[] {
                        "Objective1",
                        "00000000000000000000000000000001"});
#line 187
testRunner.Given("objectives are present in database", ((string)(null)), table17, "Given ");
#line 190
testRunner.When("open page by url \'http://localhost:5656/#objectives\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 191
testRunner.When("mouse hover element of objectives list with title \'Objective1\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 192
testRunner.And("click open objective list item with title \'Objective1\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 193
testRunner.Then("browser navigates to url \'http://localhost:5656/#objective/0000000000000000000000" +
                    "0000000001\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "Then ");
#line hidden
            this.ScenarioCleanup();
        }
        
        [NUnit.Framework.TestAttribute()]
        [NUnit.Framework.DescriptionAttribute("Navigation works using tab navigation to expiriences from objectives list")]
        public virtual void NavigationWorksUsingTabNavigationToExpiriencesFromObjectivesList()
        {
            TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("Navigation works using tab navigation to expiriences from objectives list", ((string[])(null)));
#line 196
this.ScenarioSetup(scenarioInfo);
#line 5
this.FeatureBackground();
#line 197
testRunner.When("open page by url \'http://localhost:5656/#/objectives\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 198
testRunner.And("click on tab expiriences link on objectives", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 199
testRunner.Then("browser navigates to url \'http://localhost:5656/#experiences\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "Then ");
#line hidden
            this.ScenarioCleanup();
        }
    }
}
#pragma warning restore
#endregion
