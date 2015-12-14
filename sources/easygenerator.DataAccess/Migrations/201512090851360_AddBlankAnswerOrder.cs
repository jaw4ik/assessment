namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddBlankAnswerOrder : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.BlankAnswers", "Order", c => c.Int(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.BlankAnswers", "Order");
        }
    }
}
