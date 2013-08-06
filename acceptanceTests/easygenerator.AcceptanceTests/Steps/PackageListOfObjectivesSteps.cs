using easygenerator.AcceptanceTests.ElementObjects;
using easygenerator.AcceptanceTests.Helpers;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TechTalk.SpecFlow;
using TechTalk.SpecFlow.Assist;

namespace easygenerator.AcceptanceTests.Steps
{
    public class PackageObjectiveData : UniqueData
    {
        public string Title { get; set; }
    }

    [Binding]
    public class PackageListOfObjectivesSteps
    {
        PackageObjectivesListPage packageObjectivesPage;
        public PackageListOfObjectivesSteps(PackageObjectivesListPage packageObjectivesPage)
        {
            this.packageObjectivesPage = packageObjectivesPage;
        }

        [Then(@"package objectives tiles list contains only items with data")]
        public void ThenPackageObjectivesTilesListContainsOnlyItemsWithData(Table table)
        {
            var expectedObjectives = table.CreateSet<PackageObjectiveData>().Select(obj => obj.Title).ToArray();
            TestUtils.Assert_IsTrue_WithWait(() =>
                TestUtils.AreCollectionsTheSame(expectedObjectives, packageObjectivesPage.ObjectiveItems.Select(obj => obj.Title).ToArray()),
                "Not all expected package objectives on page", packageObjectivesPage.ObjectiveItems.Select(obj => obj.Title).ToArray());
        }

    }
}
