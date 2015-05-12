using System.Configuration;

namespace easygenerator.Auth.ConfigurationSections.Authorization
{
    [ConfigurationCollection(typeof(EndpointElement), CollectionType = ConfigurationElementCollectionType.BasicMapAlternate)]
    public class EndpointsCollection : ConfigurationElementCollection
    {
        internal const string ItemPropertyName = "endpoint";

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
            return ((EndpointElement)element).Name;
        }

        protected override ConfigurationElement CreateNewElement()
        {
            return new EndpointElement();
        }

        public override bool IsReadOnly()
        {
            return false;
        }
    }
}
