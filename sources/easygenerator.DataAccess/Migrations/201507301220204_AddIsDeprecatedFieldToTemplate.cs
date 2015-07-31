namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddIsDeprecatedFieldToTemplate : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Templates", "IsDeprecated", c => c.Int(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Templates", "IsDeprecated");
        }
    }
}
