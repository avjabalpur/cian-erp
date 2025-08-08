using AutoMapper;
using Xcianify.Core.Model;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Core.Domain.Services;
using Xcianify.Core.DTOs.ProductType;

namespace Xcianify.Core.Domain.Services
{
    public class ProductTypeService : IProductTypeService
    {
        private readonly IProductTypeRepository _productTypeRepository;
        private readonly IMapper _mapper;

        public ProductTypeService(IProductTypeRepository productTypeRepository, IMapper mapper)
        {
            _productTypeRepository = productTypeRepository;
            _mapper = mapper;
        }

        public async Task<ProductTypeDto> GetByIdAsync(int id)
        {
            var productType = await _productTypeRepository.GetByIdAsync(id);
            if (productType == null)
                throw new KeyNotFoundException($"Product type with ID {id} not found.");

            return _mapper.Map<ProductTypeDto>(productType);
        }

        public async Task<IEnumerable<ProductTypeDto>> GetAllAsync()
        {
            var productTypes = await _productTypeRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<ProductTypeDto>>(productTypes);
        }

        public async Task<IEnumerable<ProductTypeDto>> GetActiveAsync()
        {
            var productTypes = await _productTypeRepository.GetActiveAsync();
            return _mapper.Map<IEnumerable<ProductTypeDto>>(productTypes);
        }

        public async Task<IEnumerable<ProductTypeDto>> GetParentTypesAsync()
        {
            var productTypes = await _productTypeRepository.GetParentTypesAsync();
            return _mapper.Map<IEnumerable<ProductTypeDto>>(productTypes);
        }

        public async Task<ProductTypeDto> CreateAsync(CreateProductTypeDto createDto, int userId)
        {
            // Check if code already exists
            if (await _productTypeRepository.CodeExistsAsync(createDto.Code))
                throw new InvalidOperationException($"Product type with code '{createDto.Code}' already exists.");

            var productType = _mapper.Map<ProductType>(createDto);
            productType.CreatedBy = userId;
            productType.UpdatedBy = userId;

            var createdProductType = await _productTypeRepository.AddAsync(productType);
            return _mapper.Map<ProductTypeDto>(createdProductType);
        }

        public async Task<ProductTypeDto> UpdateAsync(int id, UpdateProductTypeDto updateDto, int userId)
        {
            var productType = await _productTypeRepository.GetByIdAsync(id);
            if (productType == null)
                throw new KeyNotFoundException($"Product type with ID {id} not found.");

            // Check if code already exists (excluding current record)
            if (await _productTypeRepository.CodeExistsAsync(updateDto.Code, id))
                throw new InvalidOperationException($"Product type with code '{updateDto.Code}' already exists.");

            _mapper.Map(updateDto, productType);
            productType.UpdatedBy = userId;
            productType.UpdatedAt = DateTime.UtcNow;

            var updatedProductType = await _productTypeRepository.UpdateAsync(productType);
            return _mapper.Map<ProductTypeDto>(updatedProductType);
        }

        public async Task DeleteAsync(int id)
        {
            var productType = await _productTypeRepository.GetByIdAsync(id);
            if (productType == null)
                throw new KeyNotFoundException($"Product type with ID {id} not found.");

            await _productTypeRepository.DeleteAsync(productType);
        }
    }
} 