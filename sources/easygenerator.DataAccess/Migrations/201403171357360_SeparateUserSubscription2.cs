namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class SeparateUserSubscription2 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Users", "ExpirationDate", c => c.DateTime());
            DropColumn("dbo.Users", "ExpirationTime");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Users", "ExpirationTime", c => c.DateTime());
            DropColumn("dbo.Users", "ExpirationDate");
        }
    }
}
