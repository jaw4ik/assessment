namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddIsSurveyPropertyToTheQuestion : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Questions", "IsSurvey", c => c.Boolean(defaultValue: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Questions", "IsSurvey");
        }
    }
}
