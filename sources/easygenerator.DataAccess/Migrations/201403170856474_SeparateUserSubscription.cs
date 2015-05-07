namespace easygenerator.DataAccess.Migrations
{
    using System.Data.Entity.Migrations;
    
    public partial class SeparateUserSubscription : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Users", "ExpirationTime", c => c.DateTime());

            Sql("UPDATE dbo.Users SET [ExpirationTime] = [AccesTypeExpirationTime]");

            DropColumn("dbo.Users", "AccesTypeExpirationTime");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Users", "AccesTypeExpirationTime", c => c.DateTime());

            Sql("UPDATE dbo.Users SET [AccesTypeExpirationTime] = [ExpirationTime]");

            DropColumn("dbo.Users", "ExpirationTime");
        }
    }
}
