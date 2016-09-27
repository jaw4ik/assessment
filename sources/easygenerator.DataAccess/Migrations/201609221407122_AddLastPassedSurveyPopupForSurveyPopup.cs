namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddLastPassedSurveyPopupForSurveyPopup : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.UserSettings", "LastPassedSurveyPopup", c => c.String(nullable: false, maxLength: 10));
        }
        
        public override void Down()
        {
            DropColumn("dbo.UserSettings", "LastPassedSurveyPopup");
        }
    }
}
