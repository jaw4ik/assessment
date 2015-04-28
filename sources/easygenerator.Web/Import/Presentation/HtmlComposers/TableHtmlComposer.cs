using easygenerator.Web.Import.Presentation.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Xml.Linq;

namespace easygenerator.Web.Import.Presentation.HtmlComposers
{
    public class TableHtmlComposer
    {
        private readonly ShapeHtmlComposer _shapeHtmlComposer;
        public TableHtmlComposer(ShapeHtmlComposer shapeHtmlComposer)
        {
            _shapeHtmlComposer = shapeHtmlComposer;
        }

        public virtual string ComposeHtml(Table tableModel)
        {
            var table = new XElement("table", new XAttribute("border", 1), new XAttribute("cellspacing", 1), new XAttribute("cellpadding", 1));
            var tbody = new XElement("tbody");

            for (int i = 0; i < tableModel.Cells.GetLength(0); i++)
            {
                XElement thead = null;
                if (i == 0 && tableModel.IsFirstRowHeader)
                {
                    thead = new XElement("thead");
                }

                XElement row = new XElement("tr");
                for (int j = 0; j < tableModel.Cells.GetLength(1); j++)
                {
                    if (tableModel.Cells[i, j].Visible)
                    {
                        var cellContent = _shapeHtmlComposer.ComposeShapeElementsHtml(ShapeTypes.Normal, tableModel.Cells[i, j].Elements);
                        var isHeadingCell = (i == 0 && tableModel.IsFirstRowHeader) || (j == 0 && tableModel.IsFirstColumnHeader);
                        XElement cell = isHeadingCell ? XElement.Parse("<th>" + cellContent + "</th>") : XElement.Parse("<td>" + cellContent + "</td>");

                        if (tableModel.Cells[i, j].ColSpan > 0)
                            cell.Add(new XAttribute("colspan", tableModel.Cells[i, j].ColSpan));

                        if (tableModel.Cells[i, j].RowSpan > 0)
                            cell.Add(new XAttribute("rowspan", tableModel.Cells[i, j].RowSpan));

                        cell.Add
                            (
                                new XAttribute("width", tableModel.Cells[i, j].Width),
                                new XAttribute("height", tableModel.Cells[i, j].Height)
                            );

                        row.Add(cell);
                    }
                }
                if (thead != null)
                {
                    thead.Add(row);
                    table.Add(thead);
                }
                else
                    tbody.Add(row);
            }
            table.Add(tbody);

            return table.ToString();
        }
    }
}