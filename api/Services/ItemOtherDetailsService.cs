using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Core.Domain.Services;
using Xcianify.Core.DTOs.ItemOtherDetails;
using Xcianify.Core.Exceptions;
using Xcianify.Core.Model;

namespace Xcianify.Services
{
    public class ItemOtherDetailsService : IItemOtherDetailsService
    {
        private readonly IItemOtherDetailsRepository _repository;
        private readonly IMapper _mapper;

        public ItemOtherDetailsService(
            IItemOtherDetailsRepository repository,
            IMapper mapper)
        {
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task<ItemOtherDetailsDto> GetByIdAsync(int id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null)
                throw new NotFoundException("ItemOtherDetails not found");
            return _mapper.Map<ItemOtherDetailsDto>(entity);
        }

        public async Task<IEnumerable<ItemOtherDetailsDto>> GetByItemIdAsync(int itemId)
        {
            var entities = await _repository.GetByItemIdAsync(itemId);
            return _mapper.Map<IEnumerable<ItemOtherDetailsDto>>(entities);
        }

        public async Task<ItemOtherDetailsDto> CreateAsync(CreateItemOtherDetailsDto createDto, int userId)
        {
            var entity = _mapper.Map<ItemOtherDetails>(createDto);
            entity.CreatedBy = userId;
            entity.UpdatedBy = userId;
            entity.CreatedAt = DateTime.UtcNow;
            entity.UpdatedAt = DateTime.UtcNow;
            var id = await _repository.CreateAsync(entity);
            entity.Id = id;
            return _mapper.Map<ItemOtherDetailsDto>(entity);
        }

        public async Task<ItemOtherDetailsDto> UpdateAsync(int id, UpdateItemOtherDetailsDto updateDto, int userId)
        {
            var existing = await _repository.GetByIdAsync(id);
            if (existing == null)
                throw new NotFoundException("ItemOtherDetails not found");
            
            var entity = _mapper.Map<ItemOtherDetails>(updateDto);
            entity.Id = id;
            entity.ItemId = existing.ItemId; // Preserve the original ItemId
            //entity.CreatedBy = existing.CreatedBy; // Preserve original creator
            //entity.CreatedAt = existing.CreatedAt; // Preserve original creation date
            //entity.UpdatedBy = userId;
            //entity.UpdatedAt = DateTime.UtcNow;
            
            await _repository.UpdateAsync(entity);
            return _mapper.Map<ItemOtherDetailsDto>(entity);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            return await _repository.DeleteAsync(id);
        }


    }
}
