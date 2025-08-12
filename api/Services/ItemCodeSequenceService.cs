using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Core.Domain.Services;
using Xcianify.Core.DTOs.ItemMaster;
using Xcianify.Core.Model;

namespace Xcianify.Services
{
    public class ItemCodeSequenceService : IItemCodeSequenceService
    {
        private readonly IItemCodeSequenceRepository _repository;

        public ItemCodeSequenceService(IItemCodeSequenceRepository repository)
        {
            _repository = repository;
        }

        public async Task<ItemCodeSequence> CreateAsync(CreateItemCodeSequenceDto dto)
        {
            // 1. Get next integer
            int nextNumber = await _repository.GetNextSequenceNumberAsync(); // starts at 1

            // 2. Build final code
            string finalItemCode = $"{dto.ItemCode}{nextNumber}";

            // 3. Create entity
            var entity = new ItemCodeSequence
            {
                ItemCode = finalItemCode
            };
            var result= await _repository.CreateAsync(entity);
            // 4. Save
            return result;
        }
    }
}
