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
    [Binding]
    public class TryNowPageSteps
    {
        TryNowPage TryNowPage;
        public TryNowPageSteps(TryNowPage TryNowPage)
        {
            this.TryNowPage = TryNowPage;
        }


    }
}
