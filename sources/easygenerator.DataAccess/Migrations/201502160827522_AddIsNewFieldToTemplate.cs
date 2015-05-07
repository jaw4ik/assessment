namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddIsNewFieldToTemplate : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Templates", "IsNew", c => c.Int(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Templates", "IsNew");
        }
    }
}
