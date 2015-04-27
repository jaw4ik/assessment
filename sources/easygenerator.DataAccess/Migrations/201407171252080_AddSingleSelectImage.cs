namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddSingleSelectImage : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.SingleSelectImageAnswers",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        Image = c.String(nullable: false),
                        CreatedBy = c.String(nullable: false, maxLength: 254),
                        CreatedOn = c.DateTime(nullable: false),
                        ModifiedBy = c.String(nullable: false, maxLength: 254),
                        ModifiedOn = c.DateTime(nullable: false),
                        Question_Id = c.Guid(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Questions", t => t.Question_Id, cascadeDelete: true)
                .Index(t => t.Question_Id);
            
            AddColumn("dbo.Questions", "CorrectAnswer_Id", c => c.Guid());
            CreateIndex("dbo.Questions", "CorrectAnswer_Id");
            AddForeignKey("dbo.Questions", "CorrectAnswer_Id", "dbo.SingleSelectImageAnswers", "Id");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Questions", "CorrectAnswer_Id", "dbo.SingleSelectImageAnswers");
            DropForeignKey("dbo.SingleSelectImageAnswers", "Question_Id", "dbo.Questions");
            DropIndex("dbo.SingleSelectImageAnswers", new[] { "Question_Id" });
            DropIndex("dbo.Questions", new[] { "CorrectAnswer_Id" });
            DropColumn("dbo.Questions", "CorrectAnswer_Id");
            DropTable("dbo.SingleSelectImageAnswers");
        }
    }
}
