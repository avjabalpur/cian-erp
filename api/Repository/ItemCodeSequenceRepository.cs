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

        public async Task<int> CreateAsync(ItemCodeSequence entity)
        {
            const string query = @"
                INSERT INTO item_code_sequences (item_code)
                VALUES (@ItemCode)
                RETURNING id;";

            using var connection = _dbContext.GetConnection();
            return await connection.QueryFirstAsync<int>(query, entity);
        }
    }
}
