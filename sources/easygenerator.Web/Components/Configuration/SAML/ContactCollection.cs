using System.Configuration;

namespace easygenerator.Web.Components.Configuration.SAML
{
    [ConfigurationCollection(typeof(ContactElement), CollectionType = ConfigurationElementCollectionType.BasicMapAlternate)]
    public class ContactCollection : ConfigurationElementCollection
    {
        internal const string ItemPropertyName = "contact";

        public override ConfigurationElementCollectionType CollectionType => ConfigurationElementCollectionType.BasicMapAlternate;

        protected override string ElementName => ItemPropertyName;

        protected override bool IsElementName(string elementName)
        {
            return (elementName == ItemPropertyName);
        }

        protected override object GetElementKey(ConfigurationElement element)
        {
            return ((ContactElement)element).EmailAddress;
        }

        protected override ConfigurationElement CreateNewElement()
        {
            return new ContactElement();
        }

        public override bool IsReadOnly()
        {
            return false;
        }
    }
}