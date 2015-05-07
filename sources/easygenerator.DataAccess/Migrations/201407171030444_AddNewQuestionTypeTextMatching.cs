namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddNewQuestionTypeTextMatching : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.TextMatchingAnswers",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        Key = c.String(nullable: false, maxLength: 255),
                        Value = c.String(nullable: false, maxLength: 255),
                        CreatedBy = c.String(nullable: false, maxLength: 254),
                        CreatedOn = c.DateTime(nullable: false),
                        ModifiedBy = c.String(nullable: false, maxLength: 254),
                        ModifiedOn = c.DateTime(nullable: false),
                        Question_Id = c.Guid(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Questions", t => t.Question_Id, cascadeDelete: true)
                .Index(t => t.Question_Id);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.TextMatchingAnswers", "Question_Id", "dbo.Questions");
            DropIndex("dbo.TextMatchingAnswers", new[] { "Question_Id" });
            DropTable("dbo.TextMatchingAnswers");
        }
    }
}
