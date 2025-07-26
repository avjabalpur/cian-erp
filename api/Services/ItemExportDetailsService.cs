using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Core.Domain.Services;
using Xcianify.Core.DTOs.ItemExportDetails;
using Xcianify.Core.Exceptions;
using Xcianify.Core.Model;

namespace Xcianify.Services
{
    public class ItemExportDetailsService : IItemExportDetailsService
    {
        private readonly IItemExportDetailsRepository _repository;
        private readonly IMapper _mapper;

        public ItemExportDetailsService(
            IItemExportDetailsRepository repository,
            IMapper mapper)
        {
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task<ItemExportDetailsDto> GetByIdAsync(int id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null)
                throw new NotFoundException("ItemExportDetails not found");
            return _mapper.Map<ItemExportDetailsDto>(entity);
        }

        public async Task<IEnumerable<ItemExportDetailsDto>> GetByItemIdAsync(int itemId)
        {
            var entities = await _repository.GetByItemIdAsync(itemId);
            return _mapper.Map<IEnumerable<ItemExportDetailsDto>>(entities);
        }

        public async Task<ItemExportDetailsDto> CreateAsync(CreateItemExportDetailsDto createDto, int userId)
        {
            var entity = _mapper.Map<ItemExportDetails>(createDto);
            entity.CreatedBy = userId;
            entity.UpdatedBy = userId;
            entity.CreatedAt = DateTime.UtcNow;
            entity.UpdatedAt = DateTime.UtcNow;
            var id = await _repository.CreateAsync(entity);
            entity.Id = id;
            return _mapper.Map<ItemExportDetailsDto>(entity);
        }

        public async Task<ItemExportDetailsDto> UpdateAsync(int id, UpdateItemExportDetailsDto updateDto, int userId)
        {
            var existing = await _repository.GetByIdAsync(id);
            if (existing == null)
                throw new NotFoundException("ItemExportDetails not found");
            var entity = _mapper.Map(updateDto, existing);
            entity.UpdatedBy = userId;
            entity.UpdatedAt = DateTime.UtcNow;
            await _repository.UpdateAsync(entity);
            return _mapper.Map<ItemExportDetailsDto>(entity);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            return await _repository.DeleteAsync(id);
        }


    }
}
