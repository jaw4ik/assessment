using System.Collections.Generic;
using System.Configuration;

namespace easygenerator.Web.Components.Configuration.CourseExamples
{
    [ConfigurationCollection(typeof(CourseElement), CollectionType = ConfigurationElementCollectionType.BasicMapAlternate)]
    public class CourseCollection : ConfigurationElementCollection, IEnumerable<CourseElement>
    {
        internal const string ItemPropertyName = "course";

        public override ConfigurationElementCollectionType CollectionType => ConfigurationElementCollectionType.BasicMapAlternate;

        protected override string ElementName => ItemPropertyName;

        protected override bool IsElementName(string elementName)
        {
            return (elementName == ItemPropertyName);
        }

        protected override object GetElementKey(ConfigurationElement element)
        {
            return ((CourseElement)element).Id;
        }

        protected override ConfigurationElement CreateNewElement()
        {
            return new CourseElement();
        }

        public override bool IsReadOnly()
        {
            return false;
        }

        public new IEnumerator<CourseElement> GetEnumerator()
        {
            for (var i = 0; i < Count; i++)
            {
                yield return base.BaseGet(i) as CourseElement;
            }
        }
    }
}