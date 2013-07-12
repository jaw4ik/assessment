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
    [NUnit.Framework.DescriptionAttribute("ListOfQuestions")]
    [NUnit.Framework.CategoryAttribute("QuestionsList")]
    public partial class ListOfQuestionsFeature
    {
        
        private static TechTalk.SpecFlow.ITestRunner testRunner;
        
#line 1 "ListOfQuestions.feature"
#line hidden
        
        [NUnit.Framework.TestFixtureSetUpAttribute()]
        public virtual void FeatureSetup()
        {
            testRunner = TechTalk.SpecFlow.TestRunnerManager.GetTestRunner();
            TechTalk.SpecFlow.FeatureInfo featureInfo = new TechTalk.SpecFlow.FeatureInfo(new System.Globalization.CultureInfo("en-US"), "ListOfQuestions", "As an author I can see list of previously created Questions related to selected L" +
                    "earning Objective, so I can select one for editing.", ProgrammingLanguage.CSharp, new string[] {
                        "QuestionsList"});
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
testRunner.When("open page by url \'http://localhost:5656\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line hidden
            TechTalk.SpecFlow.Table table1 = new TechTalk.SpecFlow.Table(new string[] {
                        "Title",
                        "Id"});
            table1.AddRow(new string[] {
                        "Objective1",
                        "1"});
            table1.AddRow(new string[] {
                        "Objective2",
                        "2"});
#line 7
testRunner.Given("objectives are present in database", ((string)(null)), table1, "Given ");
#line hidden
        }
        
        [NUnit.Framework.TestAttribute()]
        [NUnit.Framework.DescriptionAttribute("All questions should be present in list")]
        public virtual void AllQuestionsShouldBePresentInList()
        {
            TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("All questions should be present in list", ((string[])(null)));
#line 12
this.ScenarioSetup(scenarioInfo);
#line 5
this.FeatureBackground();
#line hidden
            TechTalk.SpecFlow.Table table2 = new TechTalk.SpecFlow.Table(new string[] {
                        "Title"});
            table2.AddRow(new string[] {
                        "Question1"});
            table2.AddRow(new string[] {
                        "Question2"});
            table2.AddRow(new string[] {
                        "Question3"});
#line 13
testRunner.Given("questions related to \'Objective1\' are present in database", ((string)(null)), table2, "Given ");
#line 18
testRunner.When("select objective list item with title \'Objective1\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line hidden
            TechTalk.SpecFlow.Table table3 = new TechTalk.SpecFlow.Table(new string[] {
                        "Title"});
            table3.AddRow(new string[] {
                        "Question1"});
            table3.AddRow(new string[] {
                        "Question2"});
            table3.AddRow(new string[] {
                        "Question3"});
#line 19
testRunner.Then("questions list contains items with data", ((string)(null)), table3, "Then ");
#line hidden
            this.ScenarioCleanup();
        }
        
        [NUnit.Framework.TestAttribute()]
        [NUnit.Framework.DescriptionAttribute("Only questions related to selected objective should be present in list")]
        public virtual void OnlyQuestionsRelatedToSelectedObjectiveShouldBePresentInList()
        {
            TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("Only questions related to selected objective should be present in list", ((string[])(null)));
#line 25
this.ScenarioSetup(scenarioInfo);
#line 5
this.FeatureBackground();
#line hidden
            TechTalk.SpecFlow.Table table4 = new TechTalk.SpecFlow.Table(new string[] {
                        "Title"});
            table4.AddRow(new string[] {
                        "Question11"});
            table4.AddRow(new string[] {
                        "Question12"});
            table4.AddRow(new string[] {
                        "Question13"});
#line 26
testRunner.Given("questions related to \'Objective1\' are present in database", ((string)(null)), table4, "Given ");
#line hidden
            TechTalk.SpecFlow.Table table5 = new TechTalk.SpecFlow.Table(new string[] {
                        "Title"});
            table5.AddRow(new string[] {
                        "Question21"});
            table5.AddRow(new string[] {
                        "Question22"});
            table5.AddRow(new string[] {
                        "Question23"});
#line 31
testRunner.Given("questions related to \'Objective2\' are present in database", ((string)(null)), table5, "Given ");
#line 36
testRunner.When("select objective list item with title \'Objective2\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line hidden
            TechTalk.SpecFlow.Table table6 = new TechTalk.SpecFlow.Table(new string[] {
                        "Title"});
            table6.AddRow(new string[] {
                        "Question21"});
            table6.AddRow(new string[] {
                        "Question22"});
            table6.AddRow(new string[] {
                        "Question23"});
#line 37
testRunner.Then("questions list consists of ordered items", ((string)(null)), table6, "Then ");
#line hidden
            this.ScenarioCleanup();
        }
        
        [NUnit.Framework.TestAttribute()]
        [NUnit.Framework.DescriptionAttribute("Questions are sorted by title ascending by default")]
        public virtual void QuestionsAreSortedByTitleAscendingByDefault()
        {
            TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("Questions are sorted by title ascending by default", ((string[])(null)));
#line 43
this.ScenarioSetup(scenarioInfo);
#line 5
this.FeatureBackground();
#line hidden
            TechTalk.SpecFlow.Table table7 = new TechTalk.SpecFlow.Table(new string[] {
                        "Title"});
            table7.AddRow(new string[] {
                        "Question_a"});
            table7.AddRow(new string[] {
                        "a_Question"});
            table7.AddRow(new string[] {
                        "Question_z"});
            table7.AddRow(new string[] {
                        "1_Question"});
            table7.AddRow(new string[] {
                        "_Question"});
#line 44
testRunner.Given("questions related to \'Objective1\' are present in database", ((string)(null)), table7, "Given ");
#line 51
testRunner.When("select objective list item with title \'Objective1\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line hidden
            TechTalk.SpecFlow.Table table8 = new TechTalk.SpecFlow.Table(new string[] {
                        "Title"});
            table8.AddRow(new string[] {
                        "_Question"});
            table8.AddRow(new string[] {
                        "1_Question"});
            table8.AddRow(new string[] {
                        "a_Question"});
            table8.AddRow(new string[] {
                        "Question_a"});
            table8.AddRow(new string[] {
                        "Question_z"});
#line 52
testRunner.Then("questions list consists of ordered items", ((string)(null)), table8, "Then ");
#line 59
testRunner.And("questions list order switch is set to \'ascending\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line hidden
            this.ScenarioCleanup();
        }
        
        [NUnit.Framework.TestAttribute()]
        [NUnit.Framework.DescriptionAttribute("Questions are sorted by title descending if set descending order")]
        public virtual void QuestionsAreSortedByTitleDescendingIfSetDescendingOrder()
        {
            TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("Questions are sorted by title descending if set descending order", ((string[])(null)));
#line 62
this.ScenarioSetup(scenarioInfo);
#line 5
this.FeatureBackground();
#line hidden
            TechTalk.SpecFlow.Table table9 = new TechTalk.SpecFlow.Table(new string[] {
                        "Title"});
            table9.AddRow(new string[] {
                        "Question_a"});
            table9.AddRow(new string[] {
                        "a_Question"});
            table9.AddRow(new string[] {
                        "Question_z"});
            table9.AddRow(new string[] {
                        "1_Question"});
            table9.AddRow(new string[] {
                        "_Question"});
#line 63
testRunner.Given("questions related to \'Objective1\' are present in database", ((string)(null)), table9, "Given ");
#line 70
testRunner.When("select objective list item with title \'Objective1\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 71
testRunner.And("I switch questions list order to \'ascending\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 72
testRunner.And("I switch questions list order to \'descending\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line hidden
            TechTalk.SpecFlow.Table table10 = new TechTalk.SpecFlow.Table(new string[] {
                        "Title"});
            table10.AddRow(new string[] {
                        "Question_z"});
            table10.AddRow(new string[] {
                        "Question_a"});
            table10.AddRow(new string[] {
                        "a_Question"});
            table10.AddRow(new string[] {
                        "1_Question"});
            table10.AddRow(new string[] {
                        "_Question"});
#line 73
testRunner.Then("questions list consists of ordered items", ((string)(null)), table10, "Then ");
#line 80
testRunner.And("questions list order switch is set to \'descending\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line hidden
            this.ScenarioCleanup();
        }
        
        [NUnit.Framework.TestAttribute()]
        [NUnit.Framework.DescriptionAttribute("Questions are sorted by title ascending if set ascending order")]
        public virtual void QuestionsAreSortedByTitleAscendingIfSetAscendingOrder()
        {
            TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("Questions are sorted by title ascending if set ascending order", ((string[])(null)));
#line 82
this.ScenarioSetup(scenarioInfo);
#line 5
this.FeatureBackground();
#line hidden
            TechTalk.SpecFlow.Table table11 = new TechTalk.SpecFlow.Table(new string[] {
                        "Title"});
            table11.AddRow(new string[] {
                        "Question_a"});
            table11.AddRow(new string[] {
                        "a_Question"});
            table11.AddRow(new string[] {
                        "Question_z"});
            table11.AddRow(new string[] {
                        "1_Question"});
            table11.AddRow(new string[] {
                        "_Question"});
#line 83
testRunner.Given("questions related to \'Objective1\' are present in database", ((string)(null)), table11, "Given ");
#line 90
testRunner.When("select objective list item with title \'Objective1\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 91
testRunner.And("I switch questions list order to \'descending\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 92
testRunner.And("I switch questions list order to \'ascending\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line hidden
            TechTalk.SpecFlow.Table table12 = new TechTalk.SpecFlow.Table(new string[] {
                        "Title"});
            table12.AddRow(new string[] {
                        "_Question"});
            table12.AddRow(new string[] {
                        "1_Question"});
            table12.AddRow(new string[] {
                        "a_Question"});
            table12.AddRow(new string[] {
                        "Question_a"});
            table12.AddRow(new string[] {
                        "Question_z"});
#line 93
testRunner.Then("questions list consists of ordered items", ((string)(null)), table12, "Then ");
#line 100
testRunner.And("questions list order switch is set to \'ascending\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line hidden
            this.ScenarioCleanup();
        }
        
        [NUnit.Framework.TestAttribute()]
        [NUnit.Framework.DescriptionAttribute("Question should be highlited on mouse hover")]
        public virtual void QuestionShouldBeHighlitedOnMouseHover()
        {
            TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("Question should be highlited on mouse hover", ((string[])(null)));
#line 102
this.ScenarioSetup(scenarioInfo);
#line 5
this.FeatureBackground();
#line hidden
            TechTalk.SpecFlow.Table table13 = new TechTalk.SpecFlow.Table(new string[] {
                        "Title"});
            table13.AddRow(new string[] {
                        "Question1"});
            table13.AddRow(new string[] {
                        "Question2"});
            table13.AddRow(new string[] {
                        "Question3"});
#line 103
testRunner.Given("questions related to \'Objective1\' are present in database", ((string)(null)), table13, "Given ");
#line 108
testRunner.When("select objective list item with title \'Objective1\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 109
testRunner.And("mouse hover element of questions list with title \'Question2\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 110
testRunner.Then("questions list item with title \'\'Question2\' is highlited", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "Then ");
#line 111
testRunner.But("questions list item with title \'\'Question1\' is not highlited", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "But ");
#line 112
testRunner.And("questions list item with title \'\'Question3\' is not highlited", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line hidden
            this.ScenarioCleanup();
        }
        
        [NUnit.Framework.TestAttribute()]
        [NUnit.Framework.DescriptionAttribute("Selected question should be highlited after selecting")]
        public virtual void SelectedQuestionShouldBeHighlitedAfterSelecting()
        {
            TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("Selected question should be highlited after selecting", ((string[])(null)));
#line 114
this.ScenarioSetup(scenarioInfo);
#line 5
this.FeatureBackground();
#line hidden
            TechTalk.SpecFlow.Table table14 = new TechTalk.SpecFlow.Table(new string[] {
                        "Title"});
            table14.AddRow(new string[] {
                        "Question1"});
            table14.AddRow(new string[] {
                        "Question2"});
            table14.AddRow(new string[] {
                        "Question3"});
#line 115
testRunner.Given("questions related to \'Objective1\' are present in database", ((string)(null)), table14, "Given ");
#line 120
testRunner.When("select objective list item with title \'Objective1\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 121
testRunner.And("click on questions list item with title \'Question2\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 122
testRunner.Then("questions list item with title \'\'Question2\' is highlited", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "Then ");
#line 123
testRunner.But("questions list item with title \'\'Question1\' is not highlited", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "But ");
#line 124
testRunner.And("questions list item with title \'\'Question3\' is not highlited", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line hidden
            this.ScenarioCleanup();
        }
        
        [NUnit.Framework.TestAttribute()]
        [NUnit.Framework.DescriptionAttribute("No questions are selected by default in questions list")]
        public virtual void NoQuestionsAreSelectedByDefaultInQuestionsList()
        {
            TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("No questions are selected by default in questions list", ((string[])(null)));
#line 127
this.ScenarioSetup(scenarioInfo);
#line 5
this.FeatureBackground();
#line hidden
            TechTalk.SpecFlow.Table table15 = new TechTalk.SpecFlow.Table(new string[] {
                        "Title"});
            table15.AddRow(new string[] {
                        "Question1"});
            table15.AddRow(new string[] {
                        "Question2"});
            table15.AddRow(new string[] {
                        "Question3"});
#line 128
testRunner.Given("questions related to \'Objective1\' are present in database", ((string)(null)), table15, "Given ");
#line 133
testRunner.When("select objective list item with title \'Objective1\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 134
testRunner.Then("questions list item with title \'Question2\' is not selected", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "Then ");
#line 135
testRunner.And("questions list item with title \'Question1\' is not selected", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 136
testRunner.And("questions list item with title \'Question3\' is not selected", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line hidden
            this.ScenarioCleanup();
        }
        
        [NUnit.Framework.TestAttribute()]
        [NUnit.Framework.DescriptionAttribute("All elements of questions list can be made visible using scroll")]
        public virtual void AllElementsOfQuestionsListCanBeMadeVisibleUsingScroll()
        {
            TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("All elements of questions list can be made visible using scroll", ((string[])(null)));
#line 138
this.ScenarioSetup(scenarioInfo);
#line 5
this.FeatureBackground();
#line hidden
            TechTalk.SpecFlow.Table table16 = new TechTalk.SpecFlow.Table(new string[] {
                        "Title"});
            table16.AddRow(new string[] {
                        "Question1"});
            table16.AddRow(new string[] {
                        "Question2"});
            table16.AddRow(new string[] {
                        "Question3"});
            table16.AddRow(new string[] {
                        "Question4"});
            table16.AddRow(new string[] {
                        "Question5"});
            table16.AddRow(new string[] {
                        "Question6"});
            table16.AddRow(new string[] {
                        "Question7"});
            table16.AddRow(new string[] {
                        "Question8"});
            table16.AddRow(new string[] {
                        "Question9"});
            table16.AddRow(new string[] {
                        "Question10"});
            table16.AddRow(new string[] {
                        "Question11"});
            table16.AddRow(new string[] {
                        "Question12"});
            table16.AddRow(new string[] {
                        "Question13"});
            table16.AddRow(new string[] {
                        "Question14"});
#line 139
testRunner.Given("questions related to \'Objective1\' are present in database", ((string)(null)), table16, "Given ");
#line 155
testRunner.When("select objective list item with title \'Objective1\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 156
testRunner.And("browser window width and height is set to 400 and 300", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 157
testRunner.And("scroll publications list item with title \'Question14\' into the view", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 158
testRunner.Then("element with title \'Question14\' of questions list is visible", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "Then ");
#line hidden
            this.ScenarioCleanup();
        }
        
        [NUnit.Framework.TestAttribute()]
        [NUnit.Framework.DescriptionAttribute("Actions add content and edit are enabled if hover item of questions list")]
        public virtual void ActionsAddContentAndEditAreEnabledIfHoverItemOfQuestionsList()
        {
            TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("Actions add content and edit are enabled if hover item of questions list", ((string[])(null)));
#line 160
this.ScenarioSetup(scenarioInfo);
#line 5
this.FeatureBackground();
#line hidden
            TechTalk.SpecFlow.Table table17 = new TechTalk.SpecFlow.Table(new string[] {
                        "Title"});
            table17.AddRow(new string[] {
                        "Question1"});
            table17.AddRow(new string[] {
                        "Question2"});
            table17.AddRow(new string[] {
                        "Question3"});
#line 161
testRunner.Given("questions related to \'Objective1\' are present in database", ((string)(null)), table17, "Given ");
#line 166
testRunner.When("select objective list item with title \'Objective1\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 167
testRunner.And("mouse hover element of questions list with title \'Question2\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 168
testRunner.Then("Action add content is enabled true for questions list item with title \'Question2\'" +
                    "", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "Then ");
#line 169
testRunner.And("Action edit is enabled true for questions list item with title \'Question2\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line hidden
            this.ScenarioCleanup();
        }
        
        [NUnit.Framework.TestAttribute()]
        [NUnit.Framework.DescriptionAttribute("Actions add content and edit should remain enabled after selecting item of questi" +
            "ons list")]
        public virtual void ActionsAddContentAndEditShouldRemainEnabledAfterSelectingItemOfQuestionsList()
        {
            TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("Actions add content and edit should remain enabled after selecting item of questi" +
                    "ons list", ((string[])(null)));
#line 171
this.ScenarioSetup(scenarioInfo);
#line 5
this.FeatureBackground();
#line hidden
            TechTalk.SpecFlow.Table table18 = new TechTalk.SpecFlow.Table(new string[] {
                        "Title"});
            table18.AddRow(new string[] {
                        "Question1"});
            table18.AddRow(new string[] {
                        "Question2"});
            table18.AddRow(new string[] {
                        "Question3"});
#line 172
testRunner.Given("questions related to \'Objective1\' are present in database", ((string)(null)), table18, "Given ");
#line 177
testRunner.When("select objective list item with title \'Objective1\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 178
testRunner.And("click on questions list item with title \'Question2\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 179
testRunner.And("mouse hover element of questions list with title \'Question3\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 180
testRunner.Then("Action add content is enabled true for questions list item with title \'Question2\'" +
                    "", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "Then ");
#line 181
testRunner.And("Action edit is enabled true for questions list item with title \'Question2\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 182
testRunner.And("Action add content is enabled true for questions list item with title \'Question3\'" +
                    "", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 183
testRunner.And("Action edit is enabled true for questions list item with title \'Question3\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line hidden
            this.ScenarioCleanup();
        }
        
        [NUnit.Framework.TestAttribute()]
        [NUnit.Framework.DescriptionAttribute("Edit question action of questions list navigates to question\'s editing page")]
        public virtual void EditQuestionActionOfQuestionsListNavigatesToQuestionSEditingPage()
        {
            TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("Edit question action of questions list navigates to question\'s editing page", ((string[])(null)));
#line 185
this.ScenarioSetup(scenarioInfo);
#line 5
this.FeatureBackground();
#line hidden
            TechTalk.SpecFlow.Table table19 = new TechTalk.SpecFlow.Table(new string[] {
                        "Title",
                        "Id"});
            table19.AddRow(new string[] {
                        "Question1",
                        "1"});
#line 186
testRunner.Given("questions related to \'Objective1\' are present in database", ((string)(null)), table19, "Given ");
#line 189
testRunner.When("select objective list item with title \'Objective1\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 190
testRunner.And("mouse hover element of questions list with title \'Question1\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 191
testRunner.And("click on edit question with title \'Question1\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 192
testRunner.Then("browser navigates to url \'http://localhost:5656/#/objective/1/question/1\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "Then ");
#line hidden
            this.ScenarioCleanup();
        }
        
        [NUnit.Framework.TestAttribute()]
        [NUnit.Framework.DescriptionAttribute("Back action of questions list navigates to objectives list page")]
        public virtual void BackActionOfQuestionsListNavigatesToObjectivesListPage()
        {
            TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("Back action of questions list navigates to objectives list page", ((string[])(null)));
#line 195
this.ScenarioSetup(scenarioInfo);
#line 5
this.FeatureBackground();
#line hidden
            TechTalk.SpecFlow.Table table20 = new TechTalk.SpecFlow.Table(new string[] {
                        "Title"});
            table20.AddRow(new string[] {
                        "Question1"});
#line 196
testRunner.Given("questions related to \'Objective1\' are present in database", ((string)(null)), table20, "Given ");
#line 199
testRunner.When("select objective list item with title \'Objective1\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 200
testRunner.And("click on back from questions list", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 201
testRunner.Then("browser navigates to url \'http://localhost:5656/#/\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "Then ");
#line hidden
            this.ScenarioCleanup();
        }
    }
}
#pragma warning restore
#endregion
