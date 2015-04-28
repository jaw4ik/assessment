using System;
using System.Collections.Generic;

namespace easygenerator.Web.Import.Presentation.Model.ShapeElements
{
    public class ListItem
    {
        public Paragraph Paragraph { get; private set; }
        public List<List> NestedLists { get; private set; }
        public List List { get; private set; }

        public ListItem(Paragraph paragraph, List list)
        {
            Paragraph = paragraph;
            List = list;
            NestedLists = new List<List>();
        }

        public List AddNestedList(ListTypes listType, int level = -1)
        {
            if (level == -1)
                level = List.Level + 1;

            var nestedList = new List(listType, level, this);
            NestedLists.Add(nestedList);

            return nestedList;
        }

        public List GetParentListByLevel(int level)
        {
            if (List.Level < level)
                throw new ArgumentException("List level has invalid value", "level");

            if (List.Level == level)
                return List;


            var parent = List;
            while (parent.Level != level)
            {
                if (parent.ParentItem == null)
                    return parent;

                parent = parent.ParentItem.List;
            }

            return parent;
        }
    }
}