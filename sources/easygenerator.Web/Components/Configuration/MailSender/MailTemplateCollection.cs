using System.Configuration;

namespace easygenerator.Web.Components.Configuration.MailSender
{
    [ConfigurationCollection(typeof(MailTemplate), CollectionType = ConfigurationElementCollectionType.BasicMapAlternate)]
    public class MailTemplateCollection : ConfigurationElementCollection
    {
        internal const string ItemPropertyName = "mailTemplate";

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
            return ((MailTemplate)element).Name;
        }

        protected override ConfigurationElement CreateNewElement()
        {
            return new MailTemplate();
        }

        public override bool IsReadOnly()
        {
            return false;
        }
    }
}
