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
    [NUnit.Framework.DescriptionAttribute("CUDExperience")]
    [NUnit.Framework.CategoryAttribute("CUDExperience")]
    public partial class CUDExperienceFeature
    {
        
        private static TechTalk.SpecFlow.ITestRunner testRunner;
        
#line 1 "CUDExperience.feature"
#line hidden
        
        [NUnit.Framework.TestFixtureSetUpAttribute()]
        public virtual void FeatureSetup()
        {
            testRunner = TechTalk.SpecFlow.TestRunnerManager.GetTestRunner();
            TechTalk.SpecFlow.FeatureInfo featureInfo = new TechTalk.SpecFlow.FeatureInfo(new System.Globalization.CultureInfo("en-US"), "CUDExperience", @"As an author I can create new set of learner's experience settings and save it in form of Experience,
so I could build package with same set of settings several times if I need.
As an author I can update set of learner's experience settings in existing Experience,
so I could build package with some specific setting adjusted.
As an author I can delete exisitng Experience, so I do not keep not needed sets of settings.", ProgrammingLanguage.CSharp, new string[] {
                        "CUDExperience"});
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
#line 12
testRunner.When("open page by url \'http://localhost:5656/signin\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 13
testRunner.And("sign in as \'test\' user on sign in page", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 14
testRunner.Then("browser navigates to url \'http://localhost:5656/\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "Then ");
#line hidden
        }
        
        [NUnit.Framework.TestAttribute()]
        [NUnit.Framework.DescriptionAttribute("Add experience action on experiences list page navigates to create experience vie" +
            "w")]
        public virtual void AddExperienceActionOnExperiencesListPageNavigatesToCreateExperienceView()
        {
            TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("Add experience action on experiences list page navigates to create experience vie" +
                    "w", ((string[])(null)));
#line 17
this.ScenarioSetup(scenarioInfo);
#line 10
this.FeatureBackground();
#line 18
testRunner.When("open page by url \'http://localhost:5656/#experiences\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 19
testRunner.And("press add new experience button on experiences list page", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 20
testRunner.Then("browser navigates to url \'http://localhost:5656/#experience/create\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "Then ");
#line hidden
            this.ScenarioCleanup();
        }
        
        [NUnit.Framework.TestAttribute()]
        [NUnit.Framework.DescriptionAttribute("Edit experience title text block is active when open create experience view")]
        public virtual void EditExperienceTitleTextBlockIsActiveWhenOpenCreateExperienceView()
        {
            TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("Edit experience title text block is active when open create experience view", ((string[])(null)));
#line 22
this.ScenarioSetup(scenarioInfo);
#line 10
this.FeatureBackground();
#line 23
testRunner.When("open page by url \'http://localhost:5656/#experience/create\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 24
testRunner.Then("edit title text block is active on create view", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "Then ");
#line hidden
            this.ScenarioCleanup();
        }
        
        [NUnit.Framework.TestAttribute()]
        [NUnit.Framework.DescriptionAttribute("Edit experience title text block is empty when open create experience view")]
        public virtual void EditExperienceTitleTextBlockIsEmptyWhenOpenCreateExperienceView()
        {
            TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("Edit experience title text block is empty when open create experience view", ((string[])(null)));
#line 26
this.ScenarioSetup(scenarioInfo);
#line 10
this.FeatureBackground();
#line 27
testRunner.When("open page by url \'http://localhost:5656/#experience/create\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 28
testRunner.Then("edit title text block is empty on create view", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "Then ");
#line hidden
            this.ScenarioCleanup();
        }
        
        [NUnit.Framework.TestAttribute()]
        [NUnit.Framework.DescriptionAttribute("Buttons CreateAndEdit and CreateAndNew are disabled if template is choosen but ti" +
            "tle text is empty on create experience view")]
        public virtual void ButtonsCreateAndEditAndCreateAndNewAreDisabledIfTemplateIsChoosenButTitleTextIsEmptyOnCreateExperienceView()
        {
            TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("Buttons CreateAndEdit and CreateAndNew are disabled if template is choosen but ti" +
                    "tle text is empty on create experience view", ((string[])(null)));
#line 30
this.ScenarioSetup(scenarioInfo);
#line 10
this.FeatureBackground();
#line 31
testRunner.When("open page by url \'http://localhost:5656/#experience/create\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 32
testRunner.And("choose default template on create experience view", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 33
testRunner.Then("buttons CreateAndEdit and CreateAndNew are enabled false on create view", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "Then ");
#line 34
testRunner.When("input \'text\' into title edit area on create view", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 35
testRunner.And("clear edit area on create view", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 36
testRunner.Then("buttons CreateAndEdit and CreateAndNew are enabled false on create view", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "Then ");
#line hidden
            this.ScenarioCleanup();
        }
        
        [NUnit.Framework.TestAttribute()]
        [NUnit.Framework.DescriptionAttribute("Buttons CreateAndEdit and CreateAndNew are disabled if title text is not empty bu" +
            "t template is not choosen on create experience view")]
        public virtual void ButtonsCreateAndEditAndCreateAndNewAreDisabledIfTitleTextIsNotEmptyButTemplateIsNotChoosenOnCreateExperienceView()
        {
            TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("Buttons CreateAndEdit and CreateAndNew are disabled if title text is not empty bu" +
                    "t template is not choosen on create experience view", ((string[])(null)));
#line 38
this.ScenarioSetup(scenarioInfo);
#line 10
this.FeatureBackground();
#line 39
testRunner.When("open page by url \'http://localhost:5656/#experience/create\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 40
testRunner.Then("buttons CreateAndEdit and CreateAndNew are enabled false on create view", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "Then ");
#line 41
testRunner.When("input \'text\' into title edit area on create view", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 42
testRunner.Then("buttons CreateAndEdit and CreateAndNew are enabled false on create view", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "Then ");
#line hidden
            this.ScenarioCleanup();
        }
        
        [NUnit.Framework.TestAttribute()]
        [NUnit.Framework.DescriptionAttribute("Buttons CreateAndEdit and CreateAndNew are enabled if template is choosen and tit" +
            "le text is not empty on create experience view")]
        public virtual void ButtonsCreateAndEditAndCreateAndNewAreEnabledIfTemplateIsChoosenAndTitleTextIsNotEmptyOnCreateExperienceView()
        {
            TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("Buttons CreateAndEdit and CreateAndNew are enabled if template is choosen and tit" +
                    "le text is not empty on create experience view", ((string[])(null)));
#line 44
this.ScenarioSetup(scenarioInfo);
#line 10
this.FeatureBackground();
#line 45
testRunner.When("open page by url \'http://localhost:5656/#experience/create\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 46
testRunner.And("choose default template on create experience view", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 47
testRunner.And("input \'text\' into title edit area on create view", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 48
testRunner.Then("buttons CreateAndEdit and CreateAndNew are enabled true on create view", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "Then ");
#line hidden
            this.ScenarioCleanup();
        }
        
        [NUnit.Framework.TestAttribute()]
        [NUnit.Framework.DescriptionAttribute("Back action on create experience view navigates back to experiences list page")]
        public virtual void BackActionOnCreateExperienceViewNavigatesBackToExperiencesListPage()
        {
            TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("Back action on create experience view navigates back to experiences list page", ((string[])(null)));
#line 50
this.ScenarioSetup(scenarioInfo);
#line 10
this.FeatureBackground();
#line 51
testRunner.When("open page by url \'http://localhost:5656/#experience/create\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 52
testRunner.And("click back button on create view", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 53
testRunner.Then("browser navigates to url \'http://localhost:5656/#experiences\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "Then ");
#line hidden
            this.ScenarioCleanup();
        }
        
        [NUnit.Framework.TestAttribute()]
        [NUnit.Framework.DescriptionAttribute("Max allowed chars count is shown in edit title text block on create view from the" +
            " beginning")]
        public virtual void MaxAllowedCharsCountIsShownInEditTitleTextBlockOnCreateViewFromTheBeginning()
        {
            TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("Max allowed chars count is shown in edit title text block on create view from the" +
                    " beginning", ((string[])(null)));
#line 55
this.ScenarioSetup(scenarioInfo);
#line 10
this.FeatureBackground();
#line 56
testRunner.When("open page by url \'http://localhost:5656/#experience/create\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 57
testRunner.Then("max chars count \'255\' is shown in chars counter on create view", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "Then ");
#line hidden
            this.ScenarioCleanup();
        }
        
        [NUnit.Framework.TestAttribute()]
        [NUnit.Framework.DescriptionAttribute("correct input chars count and max chars count are shown in edit title text block " +
            "on create view")]
        public virtual void CorrectInputCharsCountAndMaxCharsCountAreShownInEditTitleTextBlockOnCreateView()
        {
            TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("correct input chars count and max chars count are shown in edit title text block " +
                    "on create view", ((string[])(null)));
#line 59
this.ScenarioSetup(scenarioInfo);
#line 10
this.FeatureBackground();
#line 60
testRunner.When("open page by url \'http://localhost:5656/#experience/create\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 61
testRunner.And("input \'text\' into title edit area on create view", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 62
testRunner.Then("chars count \'4\' is shown in chars counter on create view", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "Then ");
#line 63
testRunner.And("max chars count \'255\' is shown in chars counter on create view", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line hidden
            this.ScenarioCleanup();
        }
        
        [NUnit.Framework.TestAttribute()]
        [NUnit.Framework.DescriptionAttribute("Not possible to save more than 255 charracters in title text on create view")]
        public virtual void NotPossibleToSaveMoreThan255CharractersInTitleTextOnCreateView()
        {
            TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("Not possible to save more than 255 charracters in title text on create view", ((string[])(null)));
#line 65
this.ScenarioSetup(scenarioInfo);
#line 10
this.FeatureBackground();
#line 66
testRunner.When("open page by url \'http://localhost:5656/#experience/create\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 67
testRunner.And("choose default template on create experience view", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 68
testRunner.And(@"input 'WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW W WW WWW' into title edit area on create view", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 69
testRunner.Then("chars count \'256\' is shown in chars counter on create view", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "Then ");
#line 70
testRunner.And("buttons CreateAndEdit and CreateAndNew are enabled false on create view", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 71
testRunner.And("title text block marked with error on create view", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 72
testRunner.And("chars counter marked with error on create view", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line hidden
            this.ScenarioCleanup();
        }
        
        [NUnit.Framework.TestAttribute()]
        [NUnit.Framework.DescriptionAttribute("Changes are not saved if go back from create view")]
        public virtual void ChangesAreNotSavedIfGoBackFromCreateView()
        {
            TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("Changes are not saved if go back from create view", ((string[])(null)));
#line 74
this.ScenarioSetup(scenarioInfo);
#line 10
this.FeatureBackground();
#line hidden
            TechTalk.SpecFlow.Table table1 = new TechTalk.SpecFlow.Table(new string[] {
                        "Title",
                        "Id"});
            table1.AddRow(new string[] {
                        "Experience1",
                        "00000000000000000000000000000001"});
#line 75
testRunner.Given("publications are present in database", ((string)(null)), table1, "Given ");
#line 78
testRunner.When("open page by url \'http://localhost:5656/#experience/create\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 79
testRunner.And("choose default template on create experience view", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 80
testRunner.And("input \'text\' into title edit area on create view", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 81
testRunner.And("click back button on create view", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 82
testRunner.Then("browser navigates to url \'http://localhost:5656/#experiences\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "Then ");
#line hidden
            TechTalk.SpecFlow.Table table2 = new TechTalk.SpecFlow.Table(new string[] {
                        "Title"});
            table2.AddRow(new string[] {
                        "Experience1"});
#line 83
testRunner.And("publications tiles list consists of ordered items", ((string)(null)), table2, "And ");
#line hidden
            this.ScenarioCleanup();
        }
        
        [NUnit.Framework.TestAttribute()]
        [NUnit.Framework.DescriptionAttribute("Action CreateAndEdit navigates to newly created experience")]
        public virtual void ActionCreateAndEditNavigatesToNewlyCreatedExperience()
        {
            TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("Action CreateAndEdit navigates to newly created experience", ((string[])(null)));
#line 87
this.ScenarioSetup(scenarioInfo);
#line 10
this.FeatureBackground();
#line hidden
            TechTalk.SpecFlow.Table table3 = new TechTalk.SpecFlow.Table(new string[] {
                        "Title",
                        "Id"});
            table3.AddRow(new string[] {
                        "Experience1",
                        "00000000000000000000000000000001"});
            table3.AddRow(new string[] {
                        "Experience2",
                        "00000000000000000000000000000002"});
            table3.AddRow(new string[] {
                        "Experience3",
                        "00000000000000000000000000000003"});
#line 88
testRunner.Given("publications are present in database", ((string)(null)), table3, "Given ");
#line 93
testRunner.When("open page by url \'http://localhost:5656/#experience/create\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 94
testRunner.And("choose default template on create experience view", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 95
testRunner.And("input \'Experience4\' into title edit area on create view", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 96
testRunner.And("click on create and edit button on create view", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 97
testRunner.Then("browser navigates to url that contains \'http://localhost:5656/#experience/\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "Then ");
#line 98
testRunner.And("\'Experience4\' title is shown in experience page header", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 99
testRunner.And("\'Learning experiences\' text is shown in back to experiences list link", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line hidden
            this.ScenarioCleanup();
        }
        
        [NUnit.Framework.TestAttribute()]
        [NUnit.Framework.DescriptionAttribute("Action CreateAndNew saves changes to newly created experience and navigates to ne" +
            "w create experience view")]
        public virtual void ActionCreateAndNewSavesChangesToNewlyCreatedExperienceAndNavigatesToNewCreateExperienceView()
        {
            TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("Action CreateAndNew saves changes to newly created experience and navigates to ne" +
                    "w create experience view", ((string[])(null)));
#line 101
this.ScenarioSetup(scenarioInfo);
#line 10
this.FeatureBackground();
#line 102
testRunner.When("open page by url \'http://localhost:5656/#experience/create\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 103
testRunner.And("choose default template on create experience view", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 104
testRunner.And("input \'Experience1\' into title edit area on create view", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 105
testRunner.And("click on create and new button on create view", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 106
testRunner.Then("browser navigates to url \'http://localhost:5656/#experience/create\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "Then ");
#line 107
testRunner.When("click back button on create view", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 108
testRunner.Then("browser navigates to url \'http://localhost:5656/#experiences\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "Then ");
#line hidden
            TechTalk.SpecFlow.Table table4 = new TechTalk.SpecFlow.Table(new string[] {
                        "Title"});
            table4.AddRow(new string[] {
                        "Experience1"});
#line 109
testRunner.And("publications tiles list consists of ordered items", ((string)(null)), table4, "And ");
#line hidden
            this.ScenarioCleanup();
        }
        
        [NUnit.Framework.TestAttribute()]
        [NUnit.Framework.DescriptionAttribute("Several experiences can be created via CreateAndNew action")]
        public virtual void SeveralExperiencesCanBeCreatedViaCreateAndNewAction()
        {
            TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("Several experiences can be created via CreateAndNew action", ((string[])(null)));
#line 113
this.ScenarioSetup(scenarioInfo);
#line 10
this.FeatureBackground();
#line 114
testRunner.When("open page by url \'http://localhost:5656/#experience/create\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 115
testRunner.And("choose default template on create experience view", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 116
testRunner.And("input \'Experience3\' into title edit area on create view", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 117
testRunner.And("click on create and new button on create view", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 118
testRunner.And("choose default template on create experience view", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 119
testRunner.And("input \'Experience1\' into title edit area on create view", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 120
testRunner.And("click on create and new button on create view", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 121
testRunner.And("choose default template on create experience view", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 122
testRunner.And("input \'Experience2\' into title edit area on create view", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 123
testRunner.And("click on create and new button on create view", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 124
testRunner.And("click back button on create view", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 125
testRunner.Then("browser navigates to url \'http://localhost:5656/#experiences\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "Then ");
#line hidden
            TechTalk.SpecFlow.Table table5 = new TechTalk.SpecFlow.Table(new string[] {
                        "Title"});
            table5.AddRow(new string[] {
                        "Experience1"});
            table5.AddRow(new string[] {
                        "Experience2"});
            table5.AddRow(new string[] {
                        "Experience3"});
#line 126
testRunner.And("publications tiles list consists of ordered items", ((string)(null)), table5, "And ");
#line hidden
            this.ScenarioCleanup();
        }
        
        [NUnit.Framework.TestAttribute()]
        [NUnit.Framework.DescriptionAttribute("Special symbols could be entered into title edit area on create view and saved")]
        public virtual void SpecialSymbolsCouldBeEnteredIntoTitleEditAreaOnCreateViewAndSaved()
        {
            TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("Special symbols could be entered into title edit area on create view and saved", ((string[])(null)));
#line 132
this.ScenarioSetup(scenarioInfo);
#line 10
this.FeatureBackground();
#line 133
testRunner.When("open page by url \'http://localhost:5656/#experience/create\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 134
testRunner.And("choose default template on create experience view", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 135
testRunner.And("input \'~`!@#$%^&*()_+-={[]}:;\"\'|\\<,.>/?\' into title edit area on create view", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 136
testRunner.And("click on create and edit button on create view", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 137
testRunner.Then("browser navigates to url that contains \'http://localhost:5656/#experience/\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "Then ");
#line 138
testRunner.And("\'~`!@#$%^&*()_+-={[]}:;\"\'|\\<,.>/?\' title is shown in experience page header", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line hidden
            this.ScenarioCleanup();
        }
        
        [NUnit.Framework.TestAttribute()]
        [NUnit.Framework.DescriptionAttribute("It is possible to edit experience title on experience page")]
        public virtual void ItIsPossibleToEditExperienceTitleOnExperiencePage()
        {
            TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("It is possible to edit experience title on experience page", ((string[])(null)));
#line 140
this.ScenarioSetup(scenarioInfo);
#line 10
this.FeatureBackground();
#line hidden
            TechTalk.SpecFlow.Table table6 = new TechTalk.SpecFlow.Table(new string[] {
                        "Title",
                        "Id"});
            table6.AddRow(new string[] {
                        "Experience1",
                        "00000000000000000000000000000001"});
#line 141
testRunner.Given("publications are present in database", ((string)(null)), table6, "Given ");
#line 144
testRunner.When("open page by url \'http://localhost:5656/#experience/00000000000000000000000000000" +
                    "001\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 145
testRunner.And("edit experience title with new text \'Experience2\' on experience page", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 146
testRunner.And("click on experience header title text on experience page", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 147
testRunner.And("sleep 1000 milliseconds", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 148
testRunner.And("click on back to experiences", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line hidden
            TechTalk.SpecFlow.Table table7 = new TechTalk.SpecFlow.Table(new string[] {
                        "Title"});
            table7.AddRow(new string[] {
                        "Experience2"});
#line 149
testRunner.Then("publications tiles list consists of ordered items", ((string)(null)), table7, "Then ");
#line hidden
            this.ScenarioCleanup();
        }
        
        [NUnit.Framework.TestAttribute()]
        [NUnit.Framework.DescriptionAttribute("Not possible to make existing experience title empty")]
        public virtual void NotPossibleToMakeExistingExperienceTitleEmpty()
        {
            TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("Not possible to make existing experience title empty", ((string[])(null)));
#line 153
this.ScenarioSetup(scenarioInfo);
#line 10
this.FeatureBackground();
#line hidden
            TechTalk.SpecFlow.Table table8 = new TechTalk.SpecFlow.Table(new string[] {
                        "Title",
                        "Id"});
            table8.AddRow(new string[] {
                        "Experience1",
                        "00000000000000000000000000000001"});
#line 154
testRunner.Given("publications are present in database", ((string)(null)), table8, "Given ");
#line 157
testRunner.When("open page by url \'http://localhost:5656/#experience/00000000000000000000000000000" +
                    "001\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 158
testRunner.And("clear header title text field on experience page", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 159
testRunner.Then("title text block marked with error on experience page", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "Then ");
#line 160
testRunner.And("chars counter marked with error on experience page", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 161
testRunner.When("click on back to experiences", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line hidden
            TechTalk.SpecFlow.Table table9 = new TechTalk.SpecFlow.Table(new string[] {
                        "Title"});
            table9.AddRow(new string[] {
                        "Experience1"});
#line 162
testRunner.Then("publications tiles list consists of ordered items", ((string)(null)), table9, "Then ");
#line hidden
            this.ScenarioCleanup();
        }
        
        [NUnit.Framework.TestAttribute()]
        [NUnit.Framework.DescriptionAttribute("Delete experience button becomes available after experience was selected")]
        public virtual void DeleteExperienceButtonBecomesAvailableAfterExperienceWasSelected()
        {
            TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("Delete experience button becomes available after experience was selected", ((string[])(null)));
#line 166
this.ScenarioSetup(scenarioInfo);
#line 10
this.FeatureBackground();
#line hidden
            TechTalk.SpecFlow.Table table10 = new TechTalk.SpecFlow.Table(new string[] {
                        "Title",
                        "Id"});
            table10.AddRow(new string[] {
                        "Experience1",
                        "00000000000000000000000000000001"});
            table10.AddRow(new string[] {
                        "Experience2",
                        "00000000000000000000000000000002"});
#line 167
testRunner.Given("publications are present in database", ((string)(null)), table10, "Given ");
#line 171
testRunner.When("open page by url \'http://localhost:5656/#experiences\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 172
testRunner.And("mouse hover element of publications list with title \'Experience2\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 173
testRunner.And("select publication list item with title \'Experience2\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 174
testRunner.Then("delete button is displayed true on experiences list page", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "Then ");
#line hidden
            this.ScenarioCleanup();
        }
        
        [NUnit.Framework.TestAttribute()]
        [NUnit.Framework.DescriptionAttribute("Delete experience button is not available if there is no selected experiences")]
        public virtual void DeleteExperienceButtonIsNotAvailableIfThereIsNoSelectedExperiences()
        {
            TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("Delete experience button is not available if there is no selected experiences", ((string[])(null)));
#line 176
this.ScenarioSetup(scenarioInfo);
#line 10
this.FeatureBackground();
#line hidden
            TechTalk.SpecFlow.Table table11 = new TechTalk.SpecFlow.Table(new string[] {
                        "Title",
                        "Id"});
            table11.AddRow(new string[] {
                        "Experience1",
                        "00000000000000000000000000000001"});
            table11.AddRow(new string[] {
                        "Experience2",
                        "00000000000000000000000000000002"});
#line 177
testRunner.Given("publications are present in database", ((string)(null)), table11, "Given ");
#line 181
testRunner.When("open page by url \'http://localhost:5656/#experiences\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 182
testRunner.Then("delete button is displayed false on experiences list page", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "Then ");
#line 183
testRunner.When("mouse hover element of publications list with title \'Experience2\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 184
testRunner.And("select publication list item with title \'Experience2\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 185
testRunner.And("select publication list item with title \'Experience2\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 186
testRunner.Then("delete button is displayed false on experiences list page", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "Then ");
#line hidden
            this.ScenarioCleanup();
        }
        
        [NUnit.Framework.TestAttribute()]
        [NUnit.Framework.DescriptionAttribute("Selected experience can be deleted")]
        public virtual void SelectedExperienceCanBeDeleted()
        {
            TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("Selected experience can be deleted", ((string[])(null)));
#line 188
this.ScenarioSetup(scenarioInfo);
#line 10
this.FeatureBackground();
#line hidden
            TechTalk.SpecFlow.Table table12 = new TechTalk.SpecFlow.Table(new string[] {
                        "Title",
                        "Id"});
            table12.AddRow(new string[] {
                        "Experience1",
                        "00000000000000000000000000000001"});
            table12.AddRow(new string[] {
                        "Experience2",
                        "00000000000000000000000000000002"});
            table12.AddRow(new string[] {
                        "Experience3",
                        "00000000000000000000000000000003"});
#line 189
testRunner.Given("publications are present in database", ((string)(null)), table12, "Given ");
#line 194
testRunner.When("open page by url \'http://localhost:5656/#experiences\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 195
testRunner.And("mouse hover element of publications list with title \'Experience2\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 196
testRunner.And("select publication list item with title \'Experience2\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 197
testRunner.And("click on delete button on experiences list page", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line hidden
            TechTalk.SpecFlow.Table table13 = new TechTalk.SpecFlow.Table(new string[] {
                        "Title"});
            table13.AddRow(new string[] {
                        "Experience1"});
            table13.AddRow(new string[] {
                        "Experience3"});
#line 198
testRunner.Then("publications tiles list consists of ordered items", ((string)(null)), table13, "Then ");
#line 202
testRunner.When("mouse hover element of publications list with title \'Experience1\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line 203
testRunner.And("click open publication list item with title \'Experience1\'", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line 204
testRunner.And("click on back to experiences", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "And ");
#line hidden
            TechTalk.SpecFlow.Table table14 = new TechTalk.SpecFlow.Table(new string[] {
                        "Title"});
            table14.AddRow(new string[] {
                        "Experience1"});
            table14.AddRow(new string[] {
                        "Experience3"});
#line 205
testRunner.Then("publications tiles list consists of ordered items", ((string)(null)), table14, "Then ");
#line hidden
            this.ScenarioCleanup();
        }
    }
}
#pragma warning restore
#endregion
