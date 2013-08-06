﻿using easygenerator.AcceptanceTests.LinkingModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.AcceptanceTests.Helpers;
using OpenQA.Selenium;
using OpenQA.Selenium.Remote;

namespace easygenerator.AcceptanceTests.ElementObjects
{
    public class PackageObjectivesListPage : BasePageElement<PackageObjectiveListLinkingModel>
    {
        public PackageObjectivesListPage() { }

        public PackageObjectivesListItem[] ObjectiveItems
        {
            get
            {
                var items = GetAllByXPath(model.ObjectiveItem);
                return items.Select(it => new PackageObjectivesListItem(it)).ToArray();
            }
        }

        public PackageQuestionsListItem[] QuestionItems
        {
            get
            {
                var els = GetAllByXPath(model.QuestionItem);
                return els.Select(el => new PackageQuestionsListItem(el)).ToArray();
            }
        }

        public PackageObjectivesListItem ObjectiveItemByTitle(string title)
        {
            return ObjectiveItems.First(it => it.Title == title);
        }

        public PackageQuestionsListItem QuestionItemByTitle(string title)
        {
            return QuestionItems.First(it => it.Title == title);
        }

    }
}
