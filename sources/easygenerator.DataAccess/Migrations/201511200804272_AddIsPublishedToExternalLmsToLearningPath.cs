namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddIsPublishedToExternalLmsToLearningPath : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.LearningPaths", "IsPublishedToExternalLms", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.LearningPaths", "IsPublishedToExternalLms");
        }
    }
}
