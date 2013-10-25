namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class RenameLearningObjectsToLearningContents : DbMigration
    {
        public override void Up()
        {
            DropPrimaryKey("dbo.LearningObjects");
            DropForeignKey("dbo.LearningObjects", "Question_Id", "dbo.Questions");

            RenameTable("LearningObjects", "LearningContents");

            AddPrimaryKey("dbo.LearningContents", "Id");
            AddForeignKey("dbo.LearningContents", "Question_Id", "dbo.Questions", "Id", true);
        }
        
        public override void Down()
        {
            DropPrimaryKey("dbo.LearningContents");
            DropForeignKey("dbo.LearningContents", "Question_Id", "dbo.Questions");

            RenameTable("LearningContents", "LearningObjects");

            AddPrimaryKey("dbo.LearningObjects", "Id");
            AddForeignKey("dbo.LearningObjects", "Question_Id", "dbo.Questions", "Id", true);
        }
    }
}
