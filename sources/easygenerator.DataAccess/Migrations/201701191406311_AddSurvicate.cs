namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddSurvicate : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.UserSettings", "IsSurvicateAnswered", c => c.Boolean());
        }
        
        public override void Down()
        {
            DropColumn("dbo.UserSettings", "IsSurvicateAnswered");
        }
    }
}
