using System.Collections.Generic;

namespace easygenerator.Web.Import.Presentation.Model.ShapeElements
{
    public class List : IShapeElement
    {
        private List<ListItem> _elements;
        public IEnumerable<ListItem> Elements
        {
            get { return _elements; }
        }

        public ListTypes ListType { get; private set; }

        public ListItem ParentItem { get; private set; }
        public int Level { get; private set; }

        public List(ListTypes listType, int level = 0, ListItem parentItem = null)
        {
            Level = level;
            ParentItem = parentItem;
            ListType = listType;
            _elements = new List<ListItem>();
        }

        public ListItem AddListItem(Paragraph paragraph)
        {
            var listItem = new ListItem(paragraph, this);
            _elements.Add(listItem);

            return listItem;
        }
    }

    public enum ListTypes
    {
        Ordered,
        Unordered
    }
}