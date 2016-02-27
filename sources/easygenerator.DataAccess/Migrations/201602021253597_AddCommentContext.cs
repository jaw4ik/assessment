namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddCommentContext : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Comments", "Context", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Comments", "Context");
        }
    }
}
