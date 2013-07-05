﻿using OpenQA.Selenium;
using OpenQA.Selenium.Remote;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.AcceptanceTests.LinkingModels
{
    public class PublicationListLinkingModel : ILinkinkModel
    {
        public string Item = ".//li[@class='publication-brief']";
        public string Container = "//section[@id='content']";
        public string SortingByTitleAsc = "//button[contains(@class,'sortByTitleAsc')]";
        public string SortingByTitleDesc = "//button[contains(@class,'sortByTitleDesc')]";
        public string IsTitelSortingActiveClass = "active";
    }
}
