namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class SetDefaultAccessPlanForNuvola : DbMigration
    {
        public override void Up()
        {
            Sql(@"
                    UPDATE ConsumerToolSettings SET AccessType = 100, ExpirationPeriodDays = 14
                    WHERE Id IN (SELECT Id FROM ConsumerTools WHERE Title = 'Nuvola')
                ");
        }
        
        public override void Down()
        {
            Sql(@"
                    UPDATE ConsumerToolSettings SET AccessType = NULL, ExpirationPeriodDays = NULL
                    WHERE Id IN (SELECT Id FROM ConsumerTools WHERE Title = 'Nuvola')
                ");
        }
    }
}
