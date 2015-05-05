namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddQuestionFeedbackFields : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Questions", "Feedback_CorrectText", c => c.String());
            AddColumn("dbo.Questions", "Feedback_IncorrectText", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Questions", "Feedback_IncorrectText");
            DropColumn("dbo.Questions", "Feedback_CorrectText");
        }
    }
}
