using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Core.Domain.Services;
using Xcianify.Core.DTOs.ProductGroup;
using Xcianify.Core.Model;
using Xcianify.Core.Exceptions;
using AutoMapper;

namespace Xcianify.Services
{
    public class ProductGroupService : IProductGroupService
    {
        private readonly IProductGroupRepository _productGroupRepository;
        private readonly IMapper _mapper;

        public ProductGroupService(IProductGroupRepository productGroupRepository, IMapper mapper)
        {
            _productGroupRepository = productGroupRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<ProductGroupDto>> GetAllAsync()
        {
            var productGroups = await _productGroupRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<ProductGroupDto>>(productGroups);
        }

        public async Task<ProductGroupDto> GetByIdAsync(int id)
        {
            var productGroup = await _productGroupRepository.GetByIdAsync(id);
            if (productGroup == null)
                throw new NotFoundException($"Product group with ID {id} not found");

            return _mapper.Map<ProductGroupDto>(productGroup);
        }

        public async Task<ProductGroupDto> GetByCodeAsync(string code)
        {
            var productGroup = await _productGroupRepository.GetByCodeAsync(code);
            if (productGroup == null)
                throw new NotFoundException($"Product group with code {code} not found");

            return _mapper.Map<ProductGroupDto>(productGroup);
        }

        public async Task<ProductGroupDto> CreateAsync(CreateProductGroupDto createDto, int userId)
        {
            // Check if product group with the same code already exists
            if (await _productGroupRepository.ExistsByCodeAsync(createDto.Code))
                throw new ValidationException($"A product group with code '{createDto.Code}' already exists");

            var productGroup = _mapper.Map<ProductGroup>(createDto);
            productGroup.CreatedAt = DateTime.UtcNow;
            productGroup.UpdatedAt = DateTime.UtcNow;
            productGroup.UpdatedBy = userId.ToString();
            productGroup.UpdatedTimestamp = DateTime.UtcNow;

            var createdProductGroup = await _productGroupRepository.CreateAsync(productGroup);
            return _mapper.Map<ProductGroupDto>(createdProductGroup);
        }

        public async Task<ProductGroupDto> UpdateAsync(int id, UpdateProductGroupDto updateDto, int userId)
        {
            // Check if product group exists
            if (!await _productGroupRepository.ExistsAsync(id))
                throw new NotFoundException($"Product group with ID {id} not found");

            // Check if product group with the same code already exists (excluding current one)
            if (await _productGroupRepository.ExistsByCodeAsync(updateDto.Code, id))
                throw new ValidationException($"A product group with code '{updateDto.Code}' already exists");

            var productGroup = _mapper.Map<ProductGroup>(updateDto);
            productGroup.Id = id;
            productGroup.UpdatedAt = DateTime.UtcNow;
            productGroup.UpdatedBy = userId.ToString();
            productGroup.UpdatedTimestamp = DateTime.UtcNow;

            var updatedProductGroup = await _productGroupRepository.UpdateAsync(productGroup);
            return _mapper.Map<ProductGroupDto>(updatedProductGroup);
        }

        public async Task DeleteAsync(int id)
        {
            if (!await _productGroupRepository.ExistsAsync(id))
                throw new NotFoundException($"Product group with ID {id} not found");

            await _productGroupRepository.DeleteAsync(id);
        }
    }
} 