namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Templates_DeleteIsCustomColumn : DbMigration
    {
        public override void Up()
        {
            DropColumn("dbo.Templates", "IsCustom");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Templates", "IsCustom", c => c.Boolean(nullable: false));
        }
    }
}
