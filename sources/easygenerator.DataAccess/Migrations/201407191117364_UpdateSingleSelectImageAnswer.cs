namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class UpdateSingleSelectImageAnswer : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.Questions", "CorrectAnswer_Id", "dbo.SingleSelectImageAnswers");
            DropIndex("dbo.Questions", new[] { "CorrectAnswer_Id" });
            AddColumn("dbo.SingleSelectImageAnswers", "IsCorrect", c => c.Boolean(nullable: false));
            DropColumn("dbo.Questions", "CorrectAnswer_Id");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Questions", "CorrectAnswer_Id", c => c.Guid());
            DropColumn("dbo.SingleSelectImageAnswers", "IsCorrect");
            CreateIndex("dbo.Questions", "CorrectAnswer_Id");
            AddForeignKey("dbo.Questions", "CorrectAnswer_Id", "dbo.SingleSelectImageAnswers", "Id");
        }
    }
}
