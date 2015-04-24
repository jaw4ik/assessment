using DocumentFormat.OpenXml.Drawing;
using DocumentFormat.OpenXml.Packaging;
using easygenerator.Web.Import.Presentation.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using GraphicFrame = DocumentFormat.OpenXml.Presentation.GraphicFrame;
using Paragraph = DocumentFormat.OpenXml.Drawing.Paragraph;
using Table = DocumentFormat.OpenXml.Drawing.Table;
using TableCell = DocumentFormat.OpenXml.Drawing.TableCell;

namespace easygenerator.Web.Import.Presentation.Mappers
{
    public class TableMapper
    {
        private readonly ShapePositionReceiver _positionReceiver;
        private readonly ParagraphCollectionMapper _paragraphCollectionMapper;

        public TableMapper(ShapePositionReceiver positionReceiver, ParagraphCollectionMapper paragraphCollectionMapper)
        {
            _positionReceiver = positionReceiver;
            _paragraphCollectionMapper = paragraphCollectionMapper;
        }

        public virtual Model.Table Map(SlidePart slidePart, GraphicFrame graphicFrame)
        {
            IEnumerable<Table> tables = graphicFrame.Descendants<Table>();

            if (tables == null || !tables.Any())
                throw new InvalidOperationException("There are no tables in graphic frame.");

            if (tables.Count() > 1)
                throw new InvalidOperationException("Cannot process several tables in one graphic frame.");

            var table = tables.First();
            bool isFirstRowHeader = table.TableProperties.FirstRow != null && table.TableProperties.FirstRow.HasValue && table.TableProperties.FirstRow.Value;
            bool isFirstColumnHeader = table.TableProperties.FirstColumn != null && table.TableProperties.FirstColumn.HasValue && table.TableProperties.FirstColumn.Value;

            int rowCount = table.Descendants<TableRow>().Count();
            int columnCount = table.TableGrid.Descendants<GridColumn>().Count();
            int rowIndex = 0;
            int columnIndex = 0;

            var tableCells = new Model.TableCell[rowCount, columnCount];

            IEnumerable<long> columnsWidth = table.TableGrid.Descendants<GridColumn>().Select(e => (e.Width != null && e.Width.HasValue) ? e.Width.Value : 0);

            foreach (TableRow row in table.Descendants<TableRow>())
            {
                columnIndex = 0;
                foreach (TableCell cell in row.Descendants<TableCell>())
                {
                    // if cell is part of span cell it is already initialized
                    if (tableCells[rowIndex, columnIndex] == null)
                    {
                        tableCells[rowIndex, columnIndex] = new Model.TableCell
                        {
                            Elements = MapCellElements(slidePart, cell),
                            Height = ShapePositionReceiver.ConvertEmuToPx(row.Height),
                            Width = ShapePositionReceiver.ConvertEmuToPx(columnsWidth.ElementAt(columnIndex))
                        };

                        if (cell.GridSpan != null && cell.GridSpan.HasValue)
                        {
                            tableCells[rowIndex, columnIndex].ColSpan = cell.GridSpan.Value;
                            for (int i = 1; i < cell.GridSpan.Value; i++)
                                tableCells[rowIndex, columnIndex + i] = new Model.TableCell { Visible = false };
                        }

                        if (cell.RowSpan != null && cell.RowSpan.HasValue)
                        {
                            tableCells[rowIndex, columnIndex].RowSpan = cell.RowSpan.Value;
                            for (int i = 1; i < cell.RowSpan.Value; i++)
                                tableCells[rowIndex + i, columnIndex] = new Model.TableCell { Visible = false };
                        }
                    }

                    columnIndex++;
                }
                rowIndex++;
            }

            var tableRect = _positionReceiver.GetRectFromGraphicFrame(graphicFrame);
            return new Model.Table(tableRect.Width, tableRect.Height, new Model.Position(tableRect.X, tableRect.Y), tableCells, isFirstRowHeader, isFirstColumnHeader);
        }

        private IEnumerable<IShapeElement> MapCellElements(SlidePart slidePart, TableCell cell)
        {
            return _paragraphCollectionMapper.Map(slidePart, cell.Descendants<Paragraph>());
        }
    }
}