using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Core.Domain.Services;
using Xcianify.Core.DTOs.ItemMedia;
using Xcianify.Core.Exceptions;
using Xcianify.Core.Model;

namespace Xcianify.Services
{
    public class ItemMediaService : IItemMediaService
    {
        private readonly IItemMediaRepository _repository;
        private readonly IMapper _mapper;

        public ItemMediaService(
            IItemMediaRepository repository,
            IMapper mapper)
        {
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task<ItemMediaDto> GetByIdAsync(int id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null)
                throw new NotFoundException("ItemMedia not found");
            return _mapper.Map<ItemMediaDto>(entity);
        }

        public async Task<IEnumerable<ItemMediaDto>> GetByItemIdAsync(int itemId)
        {
            var entities = await _repository.GetByItemIdAsync(itemId);
            return _mapper.Map<IEnumerable<ItemMediaDto>>(entities);
        }

        public async Task<ItemMediaDto> CreateAsync(CreateItemMediaDto createDto, int userId)
        {
            var entity = _mapper.Map<ItemMedia>(createDto);
            entity.CreatedBy = userId;
            entity.UpdatedBy = userId;
            entity.CreatedAt = DateTime.UtcNow;
            entity.UpdatedAt = DateTime.UtcNow;
            var id = await _repository.CreateAsync(entity);
            entity.Id = id;
            return _mapper.Map<ItemMediaDto>(entity);
        }

        public async Task<ItemMediaDto> UpdateAsync(int id, UpdateItemMediaDto updateDto, int userId)
        {
            var existing = await _repository.GetByIdAsync(id);
            if (existing == null)
                throw new NotFoundException("ItemMedia not found");
            var entity = _mapper.Map(updateDto, existing);
            entity.UpdatedBy = userId;
            entity.UpdatedAt = DateTime.UtcNow;
            await _repository.UpdateAsync(entity);
            return _mapper.Map<ItemMediaDto>(entity);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            return await _repository.DeleteAsync(id);
        }


    }
}
