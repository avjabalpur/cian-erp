using Dapper;
using Microsoft.Extensions.Configuration;
using Npgsql;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Core.Model;
using Xcianify.Repository.DbContext;

namespace Xcianify.Repository
{
    public class ItemCodeSequenceRepository : IItemCodeSequenceRepository
    {
        private readonly IConfiguration _config;

        private readonly DapperDbContext _dbContext;
       

        public ItemCodeSequenceRepository(DapperDbContext dbContext)
        {
            _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
        }

        public async Task<ItemCodeSequence> CreateAsync(ItemCodeSequence entity)
        {
            const string query = @"
        INSERT INTO item_code_sequences (item_code)
        VALUES (@ItemCode)
        RETURNING id, item_code As ItemCode;"; // Return both columns

            using var connection = _dbContext.GetConnection();
            return await connection.QueryFirstAsync<ItemCodeSequence>(query, entity);
        }

        public async Task<int> GetNextSequenceNumberAsync()
        {
            const string query = @"
        SELECT COALESCE(MAX(
            CAST(REGEXP_REPLACE(item_code, '\D', '', 'g') AS INTEGER)
        ), 0) + 1 
        FROM item_code_sequences;";

            using var connection = _dbContext.GetConnection();
            return await connection.QueryFirstAsync<int>(query);
        }

    }
}
