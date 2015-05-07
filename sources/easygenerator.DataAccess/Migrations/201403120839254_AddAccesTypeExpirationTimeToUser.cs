namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddAccesTypeExpirationTimeToUser : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Users", "AccesTypeExpirationTime", c => c.DateTime());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Users", "AccesTypeExpirationTime");
        }
    }
}
