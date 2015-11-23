namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddNewEditor : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Users", "NewEditor", c => c.Boolean());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Users", "NewEditor");
        }
    }
}
