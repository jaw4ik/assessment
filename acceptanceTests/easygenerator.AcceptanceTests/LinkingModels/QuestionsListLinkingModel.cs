using OpenQA.Selenium;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.AcceptanceTests.LinkingModels
{
    public class QuestionsListLinkingModel : ILinkingModel
    {
        public string Item = ".//li[contains(@class,'main-content-list-item')]";
        public string OrderAsc = "//div[contains(@class,'questions-sort-by-title-asc')]";
        public string OrderDesc = "//div[contains(@class,'questions-sort-by-title-desc')]";
        public string ObjectivesTabLink = "//span[contains(@class,'top-navigation-item')]";
        public string IsTitelSortingActiveClass = "active";

        //CUD Question

        public string AddNewQuestionButton = "//div[contains(@class,'create-new-holder')]";
        public string DeleteButton = ".//span[contains(@class, 'delete-selected-text')]";
        
        //CUD Objective

        public string ObjectiveTitle = ".//div[contains(@class, 'view-header-title-text')]";
        public string BackToObjectivesListLink = ".//a[contains(@class, 'inline nav-control left')]";
        public string CharsCounter = ".//div[contains(@class, 'view-header-title')]//div[contains(@class, 'chars-counter')]";


    }
}
