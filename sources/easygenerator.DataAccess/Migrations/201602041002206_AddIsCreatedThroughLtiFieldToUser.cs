namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddIsCreatedThroughLtiFieldToUser : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Users", "IsCreatedThroughLti", c => c.Boolean(nullable: false));
            Sql("UPDATE Users SET [IsCreatedThroughLti]=0");
            Sql("UPDATE Users SET [IsCreatedThroughLti]=1 where Users.Id in (SELECT User_Id from LtiUserInfoes)");
        }
        
        public override void Down()
        {
            DropColumn("dbo.Users", "IsCreatedThroughLti");
        }
    }
}
