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

        public async Task<int> CreateAsync(CreateItemCodeSequenceDto dto)
        {
            var entity = new ItemCodeSequence
            {
                ItemCode = dto.ItemCode
            };

            return await _repository.CreateAsync(entity);
        }
    }
}
