namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddFieldsToTemplateEntity : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Templates", "Description", c => c.String(nullable: false));
            AddColumn("dbo.Templates", "PreviewUrl", c => c.String());
            Sql(@"UPDATE dbo.Templates
                SET Description = 'Use this when you want a course style like setup.', PreviewUrl = '/Templates/Freestyle learning/'
                WHERE Name = 'Freestyle learning'

                UPDATE dbo.Templates
                SET Description = 'Use this when you want to create an assessment.', PreviewUrl = '/Templates/Quiz/'
                WHERE Name = 'Quiz'");
        }
        
        public override void Down()
        {
            DropColumn("dbo.Templates", "PreviewUrl");
            DropColumn("dbo.Templates", "Description");
        }
    }
}
