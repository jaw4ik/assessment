namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddPackageAndPublicationLinksToLearningPath : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.LearningPaths", "PackageUrl", c => c.String(maxLength: 255));
            AddColumn("dbo.LearningPaths", "PublicationUrl", c => c.String(maxLength: 255));
        }
        
        public override void Down()
        {
            DropColumn("dbo.LearningPaths", "PublicationUrl");
            DropColumn("dbo.LearningPaths", "PackageUrl");
        }
    }
}
