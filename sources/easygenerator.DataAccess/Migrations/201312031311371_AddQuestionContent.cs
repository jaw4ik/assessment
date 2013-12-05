namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddQuestionContent : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Questions", "Content", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Questions", "Content");
        }
    }
}
