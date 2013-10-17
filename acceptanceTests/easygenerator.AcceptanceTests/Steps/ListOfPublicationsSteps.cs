using easygenerator.AcceptanceTests.ElementObjects;
using easygenerator.AcceptanceTests.Helpers;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TechTalk.SpecFlow;
using TechTalk.SpecFlow.Assist;

namespace easygenerator.AcceptanceTests.Steps
{
    public class ExperienceData : UniqueData
    {
        public string Title { get; set; }
    }
    [Binding]
    public class ListOfPublicationsSteps
    {
        PublicationsListPage publicationsPage;
        public ListOfPublicationsSteps(PublicationsListPage publicationsPage)
        {
            this.publicationsPage = publicationsPage;
        }

        Experience BuildExperience(ExperienceData data)
        {
            return new Experience()
            {
                Id = data.Id,
                Title = data.Title,
                CreatedOn = DateTime.Now,
                ModifiedOn = DateTime.Now,
                BuildOn = null,
                Objectives = new Collection<Objective>(),
                PackageUrl = "",
                Template_Id = Guid.Empty,
                //Template_Id = new Collection<Template>().First(it => it.Name == "Default").Id,
                CreatedBy = "vr.danylchuk@ism-ukraine.com",
                ModifiedBy = "vr.danylchuk@ism-ukraine.com"

            };
        }

        

        [Given(@"publications are present in database")]
        public void GivenPublicationsArePresentInDatabase(Table table)
        {
            var publications = table.CreateSet<ExperienceData>().ToArray();
            var dataSetter = new DataSetter();
            dataSetter.AddPublicationsToDatabase(publications.Select(data => BuildExperience(data)).ToArray());
        }
        [Then(@"publications tiles list contains items with data")]
        public void ThenPublicationsTilesListContainsItemsWithData(Table table)
        {
            var expectedPublications = table.CreateSet<ExperienceData>().ToArray();
            TestUtils.Assert_IsTrue_WithWait(() =>
                expectedPublications.All(obj => publicationsPage.Items.Select(pub => pub.Title).ToArray().Any(item => item == obj.Title)),
                "Not all expected publications on page", publicationsPage.Items.Select(pub => pub.Title).ToArray());
        }

        [Then(@"publications tiles list consists of ordered items")]
        public void ThenPublicationsTilesListConsistsOfOrderedItems(Table table)
        {
            var expectedPublications = table.CreateSet<ExperienceData>().Select(obj => obj.Title).ToArray();
            TestUtils.Assert_IsTrue_WithWait(() =>
                TestUtils.AreCollectionsEqual(expectedPublications, publicationsPage.Items.Select(pub => pub.Title).ToArray()),
                "Order of publications should be the same", publicationsPage.Items.Select(pub => pub.Title).ToArray());
        }

        [Then(@"publications list order switch is set to '(.*)'")]
        public void ThenPublicationsListOrderSwitchIsSetTo(string orderString)
        {
            TestUtils.Assert_IsTrue_WithWait(() =>
                Constants.OrderWay[orderString] == publicationsPage.Order,
                "Incorrect publications order switch state");
        }

        [When(@"I switch publications list order to '(.*)'")]
        public void WhenISwitchPublicationsListOrderTo(string orderString)
        {
            var expectedOrder = Constants.OrderWay[orderString];
            if (publicationsPage.Order != expectedOrder)
                publicationsPage.Order = expectedOrder;
        }

        [When(@"select publication list item with title '(.*)'")]
        public void WhenClickOnPublicationListItemWithTitle(string title)
        {
            foreach (var item in publicationsPage.Items)
            {
                if (item.Title == title)
                {
                    item.Select();
                    return;
                }
            }
            throw new InvalidOperationException("Cannot find publication with given title");
        }

        [Then(@"publication list item with title '(.*)' is selected")]
        public void ThenPublicationListItemWithTitleIsSelected(string title)
        {
            var item = publicationsPage.Items.First(it => it.Title == title);
            TestUtils.Assert_IsTrue_WithWait(() =>
                item.IsSelected,
                "Publication should be selected");
        }

        [Then(@"publication list item with title '(.*)' is not selected")]
        public void ThenPublicationListItemWithTitleIsNotSelected(string title)
        {
            var item = publicationsPage.Items.First(it => it.Title == title);
            TestUtils.Assert_IsFalse_WithWait(() =>
                item.IsSelected,
                "Publication should not be selected");
        }

        [Then(@"publications list is displayed in (.*) columns")]
        public void ThenPublicationsListIsDisplayedInColumns(int columnsCount)
        {
            TestUtils.Assert_IsTrue_WithWait(() =>
                columnsCount == publicationsPage.GetColumnsCount(),
                "Incorrect columns count, real is" + publicationsPage.GetColumnsCount().ToString());
        }
        [When(@"scroll publication with title '(.*)' into the view")]
        public void WhenScrollPublicationWithTitleIntoTheView(string title)
        {
            publicationsPage.ItemByTitle(title).ScrollIntoView();
        }

        [Then(@"element with title '(.*)' of publications list is visible")]
        public void ThenLastElementOfPublicationsListIsVisible(string title)
        {
            TestUtils.Assert_IsTrue_WithWait(() =>
                publicationsPage.Items.First(it => it.Title == title).IsVisisble(),
                "Element should be visible");
        }

        [When(@"mouse hover element of publications list with title '(.*)'")]
        public void WhenMouseHoverElementOfPublicationsListWithTitle(string title)
        {
            var item = publicationsPage.ItemByTitle(title);
            item.Hover();
        }

        [Given(@"mouse hover element of publications list with title '(.*)'")]
        public void GivenMouseHoverElementOfPublicationsListWithTitle(string title)
        {
            var item = publicationsPage.ItemByTitle(title);
            item.Hover();
        }


        [Then(@"Action open is enabled (.*) for publications list item with title '(.*)'")]
        public void ThenActionOpenIsEnabledTrueForPublicationsListItemWithTitle(bool isEnabled, string title)
        {
            var item = publicationsPage.Items.First(it => it.Title == title);
            TestUtils.Assert_IsTrue_WithWait(() =>
                isEnabled = item.IsOpenEnabled,
                "Open should be enabled");
        }

        [Then(@"Action select is enabled (.*) for publications list item with title '(.*)'")]
        public void ThenActionSelectIsEnabledTrueForPublicationsListItemWithTitle(bool isEnabled, string title)
        {
            var item = publicationsPage.Items.First(it => it.Title == title);
            TestUtils.Assert_IsTrue_WithWait(() =>
                isEnabled = item.IsSelectEnabled,
                "Select should be enabled");
        }

        [Then(@"Action build is enabled (.*) for publications list item with title '(.*)'")]
        public void ThenActionBuildIsEnabledForPublicationsListItemWithTitle(bool isEnabled, string title)
        {
            var item = publicationsPage.Items.First(it => it.Title == title);
            TestUtils.Assert_IsTrue_WithWait(() =>
                isEnabled = item.IsBuildEnabled,
                "Build should be enabled");
        }

        [Then(@"Action download is enabled (.*) for publications list item with title '(.*)'")]
        public void ThenActionDownloadIsEnabledForPublicationsListItemWithTitle(bool isEnabled, string title)
        {
            var item = publicationsPage.Items.First(it => it.Title == title);
            TestUtils.Assert_IsTrue_WithWait(() =>
                isEnabled = item.IsDownloadEnabled,
                "Download should be enabled");
        }

        [Then(@"Action rebuild is enabled (.*) for publications list item with title '(.*)'")]
        public void ThenActionRebuildIsEnabledForPublicationsListItemWithTitle(bool isEnabled, string title)
        {
            var item = publicationsPage.Items.First(it => it.Title == title);
            TestUtils.Assert_IsTrue_WithWait(() =>
                isEnabled = item.IsRebuildEnabled,
                "Rebuild should be enabled");
        }



        [Given(@"unzip '(.*)' package to '(.*)'")]
        public void GivenUnzipPackageTo(string zipFileName, string extractFolder)
        {
            string downloadDirPath;
            string extractPath;
            if (System.IO.Directory.Exists(@"D:\AcceptanceTests_WorkDirectory"))
            {
                downloadDirPath = @"C:\Windows\SysWOW64\config\systemprofile\Documents\Downloads";
                extractPath = @"D:\AcceptanceTests_WorkDirectory\acceptanceTests\easygenerator.AcceptanceTests\bin\Release\easygenerator.Web\Templates\" + extractFolder;
            }
            else
            {
                downloadDirPath = System.IO.Path.Combine(Environment.ExpandEnvironmentVariables("%userprofile%"), "Downloads");
                extractPath = @"D:\Development\easygenerator-web\acceptanceTests\easygenerator.AcceptanceTests\bin\Debug\easygenerator.Web\Templates\" + extractFolder;
            }
            
            if (System.IO.Directory.Exists(extractPath))
            {
                //int loop1 = 0;
                //while (loop1 < 60)
                //{
                //    try
                //    {
                //        System.Threading.Thread.Sleep(1000);
                //        System.IO.Directory.Delete(extractPath, true);
                //        break;
                //    }
                //    catch (UnauthorizedAccessException)
                //    {
                //        loop1++;
                //    }
                //}
                System.Threading.Thread.Sleep(1000);
                System.IO.Directory.Delete(extractPath, true);

            }

            System.IO.DirectoryInfo downloadDir = new System.IO.DirectoryInfo(downloadDirPath);
            string zipFilePath = downloadDir.GetFiles().ToList().First(f => (f.Name.Contains(zipFileName + " ") && f.Name.Contains("-UTC"))).FullName;
            int loop2 = 0;
            while (loop2 < 60)
            {
                try
                {
                    System.Threading.Thread.Sleep(1000);
                    System.IO.Compression.ZipFile.ExtractToDirectory(zipFilePath, extractPath);
                    break;
                }
                catch (UnauthorizedAccessException)
                {
                    loop2++;
                }
            }
            //System.IO.Compression.ZipFile.ExtractToDirectory(zipFilePath, extractPath);
            
            System.Threading.Thread.Sleep(2000);

            //System.IO.File.Delete(zipFilePath);
            FsHelper.DirClean(downloadDir);
        }


        [When(@"unzip '(.*)' package to '(.*)'")]
        public void WhenUnzipPackageTo(string zipFileName, string extractFolder)
        {
            string downloadDirPath;
            string extractPath;
            if (System.IO.Directory.Exists(@"D:\AcceptanceTests_WorkDirectory"))
            {
                downloadDirPath = @"C:\Windows\SysWOW64\config\systemprofile\Documents\Downloads";
                extractPath = @"D:\AcceptanceTests_WorkDirectory\acceptanceTests\easygenerator.AcceptanceTests\bin\Release\easygenerator.Web\Templates\" + extractFolder;
            }
            else
            {
                downloadDirPath = System.IO.Path.Combine(Environment.ExpandEnvironmentVariables("%userprofile%"), "Downloads");
                extractPath = @"D:\Development\easygenerator-web\acceptanceTests\easygenerator.AcceptanceTests\bin\Debug\easygenerator.Web\Templates\" + extractFolder;
            }

            if (System.IO.Directory.Exists(extractPath))
            {
                //int loop1 = 0;
                //while (loop1 < 60)
                //{
                //    try
                //    {
                //        System.Threading.Thread.Sleep(1000);
                //        System.IO.Directory.Delete(extractPath, true);
                //        break;
                //    }
                //    catch (UnauthorizedAccessException)
                //    {
                //        loop1++;
                //    }
                //}
                System.Threading.Thread.Sleep(1000);
                System.IO.Directory.Delete(extractPath, true);

            }

            System.IO.DirectoryInfo downloadDir = new System.IO.DirectoryInfo(downloadDirPath);
            string zipFilePath = downloadDir.GetFiles().ToList().First(f => (f.Name.Contains(zipFileName + " ") && f.Name.Contains("-UTC"))).FullName;
            int loop2 = 0;
            while (loop2 < 60)
            {
                try
                {
                    System.Threading.Thread.Sleep(1000);
                    System.IO.Compression.ZipFile.ExtractToDirectory(zipFilePath, extractPath);
                    break;
                }
                catch (UnauthorizedAccessException)
                {
                    loop2++;
                }
            }
            //System.IO.Compression.ZipFile.ExtractToDirectory(zipFilePath, extractPath);

            System.Threading.Thread.Sleep(2000);

            //System.IO.File.Delete(zipFilePath);
            FsHelper.DirClean(downloadDir);
        }
                
        [When(@"click open publication list item with title '(.*)'")]
        public void WhenClickOpenPublicationListItemWithTitle(string title)
        {
            publicationsPage.ItemByTitle(title).Open();
        }

        [Given(@"click build publication list item with title '(.*)'")]
        public void GivenClickBuildPublicationListItemWithTitle(string title)
        {
            var item = publicationsPage.Items.First(it => it.Title == title);
            if (TestUtils.WaitForCondition((() => item.IsBuildEnabled),1000))
            {
                item.Build();
            }
            System.Threading.Thread.Sleep(2000);
        
        }

        [When(@"click build publication list item with title '(.*)'")]
        public void WhenClickBuildPublicationListItemWithTitle(string title)
        {
            var item = publicationsPage.Items.First(it => it.Title == title);
            if (TestUtils.WaitForCondition((() => item.IsBuildEnabled), 1000))
            {
                item.Build();
            }
        }

        [When(@"click rebuild publication list item with title '(.*)'")]
        public void WhenClickRebuildPublicationListItemWithTitle(string title)
        {
            var item = publicationsPage.Items.First(it => it.Title == title);
            if (TestUtils.WaitForCondition((() => item.IsRebuildEnabled), 1000))
            {
                item.Rebuild();
            }
        }



        [Given(@"click download publication list item with title '(.*)'")]
        public void GivenClickDownloadPublicationListItemWithTitle(string title)
        {
            System.Threading.Thread.Sleep(1000);
            var item = publicationsPage.Items.First(it => it.Title == title);
            if (TestUtils.WaitForCondition((() => item.IsDownloadEnabled), 1000))
            {
                item.Download();
            }
            
        }

        [When(@"click download publication list item with title '(.*)'")]
        public void WhenClickDownloadPublicationListItemWithTitle(string title)
        {
            System.Threading.Thread.Sleep(1000);
            var item = publicationsPage.Items.First(it => it.Title == title);
            if (TestUtils.WaitForCondition((() => item.IsDownloadEnabled), 1000))
            {
                item.Download();
            }
        }




        [When(@"click on tab objectives link on expiriences list page")]
        public void WhenClickOnTabObjectivesLinkOnExpiriencesListPage()
        {
            publicationsPage.NavigateToObjectivesUsingTabs();
        }

        [Then(@"objective count for element of publications list with title '(.*)' is '(.*)'")]
        public void ThenObjectiveCountForElementOfPublicationsListWithTitleIs(string title, string objectiveCount)
        {
            var item = publicationsPage.Items.First(it => it.Title == title);
            TestUtils.Assert_IsTrue_WithWait(() => objectiveCount == item.ObjectiveCount,
                "Incorrect objective count");
        }


        //CUD Experience

        [When(@"press add new experience button on experiences list page")]
        public void WhenPressAddNewExperienceButtonOnExperiencesListPage()
        {
            publicationsPage.ClickAddNewExperienceButton();
        }

        [Then(@"delete button is displayed (.*) on experiences list page")]
        public void ThenDeleteButtonIsDisplayedTrueOnExperiencesListPage(bool isDisplayed)
        {
            TestUtils.Assert_IsTrue_WithWait(() =>
                publicationsPage.DeleteButtonIsDisplayed == isDisplayed,
                "incorrect delete button visibility");
        }

        [When(@"click on delete button on experiences list page")]
        public void WhenClickOnDeleteButtonOnExperiencesListPage()
        {
            publicationsPage.DeleteButtonClick();
        }

        [Then(@"error notification is displayed (.*) on experiences list page")]
        public void ThenErrorNotificationIsDisplayedOnExperiencesListPage(bool isDisplayed)
        {
            TestUtils.Assert_IsTrue_WithWait(() =>
                publicationsPage.ErrorNotificationIsShown == isDisplayed,
                "error notification is not shown");
        }

        

    }
}
