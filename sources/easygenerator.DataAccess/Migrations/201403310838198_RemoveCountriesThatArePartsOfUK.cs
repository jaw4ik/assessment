namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class RemoveCountriesThatArePartsOfUK : DbMigration
    {
        public override void Up()
        {
            Sql("UPDATE dbo.Users " +
                "SET Country = 'United Kingdom' " +
                "WHERE Country = 'England' OR Country = 'Scotland' OR Country = 'Wales'");
            Sql("UPDATE dbo.Users " +
                "SET Country = 'Serbija' " +
                "WHERE Country = 'Kosovo' ");
        }
        
        public override void Down()
        {
        }
    }
}
