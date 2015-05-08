using DocumentFormat.OpenXml.Packaging;
using easygenerator.Web.Import.Presentation.Extensions;
using easygenerator.Web.Import.Presentation.Model;
using easygenerator.Web.Import.Presentation.Model.ShapeElements;
using System.Collections.Generic;
using System.Linq;
using Paragraph = DocumentFormat.OpenXml.Drawing.Paragraph;

namespace easygenerator.Web.Import.Presentation.Mappers
{
    public class ParagraphCollectionMapper
    {
        private readonly ParagraphMapper _paragraphMapper;

        public ParagraphCollectionMapper(ParagraphMapper paragraphMapper)
        {
            _paragraphMapper = paragraphMapper;
        }

        public IEnumerable<IShapeElement> Map(SlidePart slidePart, IEnumerable<Paragraph> paragraphs, bool isContentPlaceholder = false)
        {
            var elements = new List<IShapeElement>();
            ListItem listItem = null;

            foreach (var paragraph in paragraphs)
            {
                if (IsListParagraphElement(paragraph, isContentPlaceholder))
                {
                    listItem = MapListElement(slidePart, paragraph, listItem, elements);
                }
                else
                {
                    listItem = null;
                    elements.Add(_paragraphMapper.Map(slidePart, paragraph));
                }
            }

            return elements;
        }

        private ListItem MapListElement(SlidePart slidePart, Paragraph paragraph, ListItem listItem, List<IShapeElement> elements)
        {
            var paragraphModel = _paragraphMapper.Map(slidePart, paragraph);
            var listType = GetListType(paragraph);
            if (listItem == null)
            {
                listItem = AppendRootListItem(listType, paragraphModel, elements);
            }
            else
            {
                var level = paragraph.GetLevel();
                if (level == listItem.List.Level)
                {
                    listItem = AppendListItem(listItem, listType, paragraphModel, elements);
                }
                else if (level > listItem.List.Level)
                {
                    listItem = AppendNestedListItem(listItem, level, listType, paragraphModel);
                }
                else if (level < listItem.List.Level)
                {
                    listItem = AppendParentListItem(listItem, level, listType, paragraphModel, elements);
                }
            }
            return listItem;
        }

        private ListItem AppendParentListItem(ListItem listItem, int level, ListTypes listType, Model.ShapeElements.Paragraph paragraphModel,
            List<IShapeElement> elements)
        {
            var list = listItem.GetParentListByLevel(level);
            var levelListItem = list.Elements.LastOrDefault();
            if (levelListItem != null)
            {
                listItem = AppendListItem(levelListItem, listType, paragraphModel, elements);
            }

            return listItem;
        }

        private static ListItem AppendNestedListItem(ListItem listItem, int level, ListTypes listType, Model.ShapeElements.Paragraph paragraphModel)
        {
            var subList = listItem.AddNestedList(listType, level);
            listItem = subList.AddListItem(paragraphModel);
            return listItem;
        }

        private ListItem AppendListItem(ListItem listItem, ListTypes listType, Model.ShapeElements.Paragraph paragraph, List<IShapeElement> shapeElements)
        {
            if (listType == listItem.List.ListType)
                return listItem.List.AddListItem(paragraph);

            var parentNode = listItem.List.ParentItem;
            if (parentNode == null)
                return AppendRootListItem(listType, paragraph, shapeElements);

            var subList = parentNode.AddNestedList(listType);
            return subList.AddListItem(paragraph);
        }

        private ListItem AppendRootListItem(ListTypes listType, Model.ShapeElements.Paragraph paragraph, List<IShapeElement> shapeElements)
        {
            var list = new List(listType);
            shapeElements.Add(list);
            return list.AddListItem(paragraph);
        }

        private ListTypes GetListType(Paragraph paragraph)
        {
            return paragraph.IsOrderedListElement() ? ListTypes.Ordered : ListTypes.Unordered;
        }

        private bool IsListParagraphElement(Paragraph paragraph, bool isContentPlaceholder = false)
        {
            return paragraph.IsOrderedListElement() || paragraph.IsUnorderedListElement()
                   || (isContentPlaceholder && !paragraph.IsNoBulletElement());
        }
    }
}