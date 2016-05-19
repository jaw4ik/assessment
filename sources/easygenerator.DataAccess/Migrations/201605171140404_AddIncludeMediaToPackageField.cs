namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddIncludeMediaToPackageField : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.UserSettings", "IncludeMediaToPackage", c => c.Boolean(nullable: false, defaultValue: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.UserSettings", "IncludeMediaToPackage");
        }
    }
}
