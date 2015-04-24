namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ConfigureDBIndexes : DbMigration
    {
        private readonly string[] tablesToRemoveCreatedByIndexes =
        {
            "Answers", "BlankAnswers", "Dropspots", "LearningContents", "Questions", "SingleSelectImageAnswers", "TextMatchingAnswers"
        };

        public override void Up()
        {
            CreateIndex("CourseCollaborators", "Email", false, "CourseCollaborators_Email");

            foreach (string tableName in tablesToRemoveCreatedByIndexes)
            {
                DropIndex(tableName, tableName + "_CreatedByIndex");
            }
        }

        public override void Down()
        {
            DropIndex("CourseCollaborators", "CourseCollaborators_Email");

            foreach (string tableName in tablesToRemoveCreatedByIndexes)
            {
                CreateIndex(tableName, "CreatedBy", false, tableName + "_CreatedByIndex");
            }
        }
    }
}
