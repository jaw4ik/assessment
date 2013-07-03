﻿using easygenerator.AcceptanceTests.ElementObjects;
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
    public class ObjectiveData
    {
        public string Title { get; set; }
        public string Id { get; set; }
    }
    [Binding]
    public class ListOfObjectivesSteps
    {
        ObjectivesListPage objectivesPage;
        Dictionary<string, Order> orderWay = new Dictionary<string, Order>()
        {
            {"ascending", Order.Ascending},
            {"descending", Order.Descending}
        };
        public ListOfObjectivesSteps(ObjectivesListPage objectivesPage)
        {
            this.objectivesPage = objectivesPage;
        }

        [Given(@"objectives are present in database")]
        public void GivenObjectivesArePresentInDatabase(Table table)
        {
            var objectives = table.CreateSet<ObjectiveData>().ToArray();
            var dataSetter = new ObjectivesDataSetter();
            dataSetter.EmptyObjectivesList();
            foreach (var obj in objectives)
            {
                var idString = obj.Id != null ? obj.Id : "0";
                dataSetter.AddObjectiveToDatabase(idString, obj.Title);
            }
        }
        [When(@"click home page icon")]
        public void WhenClickHomePageIcon()
        {
            objectivesPage.ClickHomePageIcon();
        }

        [Then(@"objectives tiles list contains items with data")]
        public void ThenObjectivesTilesListContainsItemsWithData(Table table)
        {
            var expectedObjectives = table.CreateSet<ObjectiveData>().ToArray();
            var realObjectives = objectivesPage.Items;
            Assert.IsTrue(expectedObjectives.All(obj => realObjectives.Any(item => item.Title == obj.Title)));
        }

        [Then(@"objectives tiles list consists of ordered items")]
        public void ThenObjectivesTilesListConsistsOfOrderedItems(Table table)
        {
            var expectedObjectives = table.CreateSet<ObjectiveData>().Select(obj => obj.Title).ToArray();
            var realObjectives = objectivesPage.Items.Select(obj => obj.Title).ToArray();
            CollectionAssert.AreEqual(expectedObjectives, realObjectives);
        }

        [Then(@"objectives list order switch is set to '(.*)'")]
        public void ThenObjectivesListOrderSwitchIsSetTo(string orderString)
        {
            Assert.AreEqual(orderWay[orderString], objectivesPage.Order);
        }

        [When(@"I switch objectives list order to '(.*)'")]
        public void WhenISwitchObjectivesListOrderTo(string orderString)
        {
            var expectedOrder = orderWay[orderString];
            if (objectivesPage.Order != expectedOrder)
                objectivesPage.Order = expectedOrder;
        }

        [When(@"click on objective list item with title '(.*)'")]
        public void WhenClickOnObjectiveListItemWithTitle(string title)
        {
            foreach (var item in objectivesPage.Items)
            {
                if (item.Title == title)
                {
                    item.Click();
                    return;
                }
            }
            throw new InvalidOperationException("Cannot find objective with given title");
        }

        [Then(@"objective list item with title '(.*)' is selected")]
        public void ThenObjectiveListItemWithTitleIsSelected(string title)
        {
            var item = objectivesPage.Items.First(it => it.Title == title);
            Assert.IsTrue(item.IsSelected);
        }

        [Then(@"objective list item with title '(.*)' is not selected")]
        public void ThenObjectiveListItemWithTitleIsNotSelected(string title)
        {
            var item = objectivesPage.Items.First(it => it.Title == title);
            Assert.IsFalse(item.IsSelected);
        }

        [Then(@"objectives list is displayed in (.*) columns")]
        public void ThenObjectivesListIsDisplayedInColumns(int columnsCount)
        {
            Assert.AreEqual(columnsCount, objectivesPage.GetColumnsCount());
        }

        [Then(@"last element of objectives list is visible")]
        public void ThenLastElementOfObjectivesListIsVisible()
        {
            Assert.IsTrue(objectivesPage.Items.Last().IsVisisble());
        }

        [When(@"mouse hover element of objectives list with title '(.*)'")]
        public void WhenMouseHoverElementOfObjectivesListWithTitle(string title)
        {
            var item = objectivesPage.Items.First(it => it.Title == title);
            item.Hover();
        }

        [Then(@"Action open is enabled (.*) for objectives list item with title '(.*)'")]
        public void ThenActionOpenIsEnabledTrueForObjectivesListItemWithTitle(bool isEnabled, string title)
        {
            var item = objectivesPage.Items.First(it => it.Title == title);
            Assert.AreEqual(isEnabled, item.IsOpenEnabled);
        }

        [Then(@"Action select is enabled (.*) for objectives list item with title '(.*)'")]
        public void ThenActionSelectIsEnabledTrueForObjectivesListItemWithTitle(bool isEnabled, string title)
        {
            var item = objectivesPage.Items.First(it => it.Title == title);
            Assert.AreEqual(isEnabled, item.IsSelectEnabled);
        }
    }
}
