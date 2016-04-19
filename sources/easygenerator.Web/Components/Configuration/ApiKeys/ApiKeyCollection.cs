using System.Configuration;

namespace easygenerator.Web.Components.Configuration.ApiKeys
{
    [ConfigurationCollection(typeof(ApiKeyElement), CollectionType = ConfigurationElementCollectionType.BasicMapAlternate)]
    public class ApiKeyCollection : ConfigurationElementCollection
    {
        internal const string ItemPropertyName = "apiKey";

        public override ConfigurationElementCollectionType CollectionType
        {
            get { return ConfigurationElementCollectionType.BasicMapAlternate; }
        }

        protected override string ElementName
        {
            get { return ItemPropertyName; }
        }

        protected override bool IsElementName(string elementName)
        {
            return (elementName == ItemPropertyName);
        }

        protected override object GetElementKey(ConfigurationElement element)
        {
            return ((ApiKeyElement)element).Name;
        }

        protected override ConfigurationElement CreateNewElement()
        {
            return new ApiKeyElement();
        }

        public override bool IsReadOnly()
        {
            return false;
        }
    }
}