namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;

    public partial class AddIndexesToDB : DbMigration
    {
        private readonly string[] tablesToAddCreatedByIndexes =
        {
            "Answers", "BlankAnswers", "CourseCollaborators", "Courses", "Dropspots", "ImageFiles", "LearningContents", "Objectives", "Questions", "SingleSelectImageAnswers", "TextMatchingAnswers"
        };

        private string GetIndexName(string tableName)
        {
            return string.Format("{0}_CreatedByIndex", tableName);
        }

        public override void Up()
        {
            foreach (string tableName in tablesToAddCreatedByIndexes)
            {
                CreateIndex(tableName, "CreatedBy", false, GetIndexName(tableName));
            }
        }

        public override void Down()
        {
            foreach (string tableName in tablesToAddCreatedByIndexes)
            {
                DropIndex(tableName, GetIndexName(tableName));
            }
        }
    }
}
