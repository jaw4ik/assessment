namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddBlankAnswersTable : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.BlankAnswers",
                c => new
                {
                    Id = c.Guid(nullable: false),
                    Text = c.String(nullable: false),
                    IsCorrect = c.Boolean(nullable: false),
                    GroupId = c.Guid(nullable: false),
                    CreatedBy = c.String(nullable: false, maxLength: 254),
                    CreatedOn = c.DateTime(nullable: false),
                    ModifiedBy = c.String(nullable: false, maxLength: 254),
                    ModifiedOn = c.DateTime(nullable: false),
                    Question_Id = c.Guid(nullable: false),
                })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Questions", t => t.Question_Id, cascadeDelete: true)
                .Index(t => t.Question_Id);

            Sql("INSERT INTO dbo.BlankAnswers (Id, Text, IsCorrect, GroupId, CreatedBy, CreatedOn, ModifiedBy, ModifiedOn, Question_Id) SELECT Id, Text, IsCorrect, [Group], CreatedBy, CreatedOn, ModifiedBy, ModifiedOn, Question_Id FROM dbo.Answers WHERE [Group] <> N'00000000-0000-0000-0000-000000000000'");
            Sql("DELETE FROM dbo.Answers WHERE [Group] <> N'00000000-0000-0000-0000-000000000000'");
        }
        
        public override void Down()
        {
            Sql("INSERT INTO dbo.Answers (Id, Text, IsCorrect, [Group], CreatedBy, CreatedOn, ModifiedBy, ModifiedOn, Question_Id) SELECT Id, Text, IsCorrect, GroupId, CreatedBy, CreatedOn, ModifiedBy, ModifiedOn, Question_Id FROM dbo.BlankAnswers");

            DropForeignKey("dbo.BlankAnswers", "Question_Id", "dbo.Questions");
            DropIndex("dbo.BlankAnswers", new[] { "Question_Id" });
            DropTable("dbo.BlankAnswers");
        }
    }
}
