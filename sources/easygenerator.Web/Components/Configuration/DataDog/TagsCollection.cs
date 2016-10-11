using System.Configuration;

namespace easygenerator.Web.Components.Configuration.DataDog
{
    public class TagsCollection : ConfigurationElementCollection
    {
        public TagsCollection() { }
        public Tag this[int index]
        {
            get { return (Tag)BaseGet(index); }
            set
            {
                if (BaseGet(index) != null)
                {
                    BaseRemoveAt(index);
                }
                BaseAdd(index, value);
            }
        }

        public void Add(Tag tag)
        {
            BaseAdd(tag);
        }

        public void Clear()
        {
            BaseClear();
        }

        protected override ConfigurationElement CreateNewElement()
        {
            return new Tag();
        }

        protected override object GetElementKey(ConfigurationElement element)
        {
            return ((Tag)element).Name;
        }

        public void Remove(Tag tag)
        {
            BaseRemove(tag.Name);
        }

        public void RemoveAt(int index)
        {
            BaseRemoveAt(index);
        }

        public void Remove(string name)
        {
            BaseRemove(name);
        }
    }
}