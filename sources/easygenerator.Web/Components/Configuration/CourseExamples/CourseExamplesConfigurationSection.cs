using System;
using System.Configuration;

namespace easygenerator.Web.Components.Configuration.CourseExamples
{
    public class CourseExamplesConfigurationSection : ConfigurationSection
    {
        [ConfigurationProperty("courses", IsRequired = true)]
        public CourseCollection Courses
        {
            get { return ((CourseCollection)(base["courses"])); }
            set { base["courses"] = value; }
        }
    }
}