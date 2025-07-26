using System;
using System.Data;
using Microsoft.Extensions.Configuration;
using Npgsql;


namespace Xcianify.Repository.DbContext
{
    public class DapperDbContext : IDisposable
    {
        private IDbConnection _connection;
        private readonly string _connectionString;

        public DapperDbContext(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("dbPostgreSQLConnection");
        }

        public IDbConnection GetConnection()
        {
            _connection = new NpgsqlConnection(_connectionString);

            if (_connection.State != ConnectionState.Open)
            {
                _connection.Open();
            }
            return _connection;
        }

        public void Dispose()
        {
            if (_connection != null)
            {
                if (_connection.State != ConnectionState.Closed)
                {
                    _connection.Close();
                }
                _connection.Dispose();
            }
        }
    }
}