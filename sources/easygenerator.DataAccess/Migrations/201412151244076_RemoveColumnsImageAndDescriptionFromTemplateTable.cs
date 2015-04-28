namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class RemoveColumnsImageAndDescriptionFromTemplateTable : DbMigration
    {
        public override void Up()
        {
            DropColumn("dbo.Templates", "Image");
            DropColumn("dbo.Templates", "Description");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Templates", "Description", c => c.String(nullable: false));
            AddColumn("dbo.Templates", "Image", c => c.String(nullable: false, maxLength: 255));
        }
    }
}
