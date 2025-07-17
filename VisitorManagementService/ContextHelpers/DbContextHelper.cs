using System;
using System.Data.Common;
using VisitorManagementMySQL.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.Options;

namespace VisitorManagementMySQL.ContextHelper
{
    public class DbContextHelper : vms_webContext
    {
        private readonly string _connectionString;
        public DbContextHelper(IOptions<DbConnectionInfo> dbConnectionInfo)
        {
            _connectionString = dbConnectionInfo.Value.VisitorManagementCon;
        }

        public DbContextHelper(DbContextOptions<vms_webContext> options)
            : base(options)
        {
            this.Database.SetCommandTimeout(180);
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseMySQL(_connectionString).EnableSensitiveDataLogging();
            }
        }

        public IDbContextTransaction GetTransaction()
        {
            IDbContextTransaction transaction;
            if (this.Database.CurrentTransaction == null)
                transaction = this.Database.BeginTransaction();
            else
                transaction = this.Database.CurrentTransaction;

            return transaction;
        }

        public DbTransaction GetDbTransaction()
        {
            DbTransaction transaction;
            if (this.Database.CurrentTransaction == null)
                transaction = this.Database.BeginTransaction().GetDbTransaction();
            else
                transaction = this.Database.CurrentTransaction.GetDbTransaction();

            return transaction;
        }
    }

}

public class DbConnectionInfo
{
    public string VisitorManagementCon { get; set; }
}