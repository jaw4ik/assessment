using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.Auth.ConfigurationSections.Authorization
{
    [ConfigurationCollection(typeof(ClientElement), CollectionType = ConfigurationElementCollectionType.BasicMapAlternate)]
    public class ClientsCollection : ConfigurationElementCollection
    {
        internal const string ItemPropertyName = "client";

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
            return ((ClientElement)element).Name;
        }

        protected override ConfigurationElement CreateNewElement()
        {
            return new ClientElement();
        }

        public override bool IsReadOnly()
        {
            return false;
        }
    }
}
