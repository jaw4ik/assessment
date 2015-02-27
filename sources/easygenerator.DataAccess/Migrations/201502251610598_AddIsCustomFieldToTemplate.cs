namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddIsCustomFieldToTemplate : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Templates", "IsCustom", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Templates", "IsCustom");
        }
    }
}
