﻿
using easygenerator.Infrastructure;
using System;

namespace easygenerator.Web.InMemoryStorages.CourseStateStorage
{
    public class CourseInfo
    {
        public DateTime BuildStartedOn { get; set; }
        public DateTime ChangedOn { get; set; }
        public bool HasUnpublishedChanges { get; set; }

        public CourseInfo()
        {
            BuildStartedOn = DateTimeWrapper.MinValue();
            ChangedOn = DateTimeWrapper.MinValue();
            HasUnpublishedChanges = false;
        }
    }
}