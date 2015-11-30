using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;

namespace easygenerator.StorageServer.Components.ConfigurationSections
{
    [ConfigurationCollection(typeof(IssuerElement), CollectionType = ConfigurationElementCollectionType.BasicMapAlternate)]
    public class IssuersCollection : ConfigurationElementCollection
    {
        internal const string ItemPropertyName = "issuer";

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
            return ((IssuerElement)element).Name;
        }

        protected override ConfigurationElement CreateNewElement()
        {
            return new IssuerElement();
        }

        public override bool IsReadOnly()
        {
            return false;
        }
    }
}