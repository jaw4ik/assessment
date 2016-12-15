using System;
using System.Collections;
using System.Collections.Generic;

namespace easygenerator.Web.BuildCourse.PublishSettings.Models
{
    public class PublishSettings
    {
        public PublishSettings()
        {
            Modules = new List<Module>();
            QuestionShortIds = new Dictionary<string, int>();
        }

        public List<Module> Modules { get; set; }

        public AccessLimitation AccessLimitation { get; set; }

        public string CustomFontPlace { get; set; }

        public Dictionary<string, int> QuestionShortIds { get; set; }

        public string PublishMode { get; set; }
    }


    public class Module
    {
        public Module(string name)
        {
            Name = name;
        }

        public string Name { get; set; }
    }

    public class AccessLimitation
    {
        public bool Enabled { get; set; }

        public IEnumerable<Object> AllowedUsers { get; set; }
    }
}