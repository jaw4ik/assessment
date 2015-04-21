namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddGeneralFeedback : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Questions", "Feedback_GeneralText", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Questions", "Feedback_GeneralText");
        }
    }
}
