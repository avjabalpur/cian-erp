using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using Xcianify.Core.Domain.Services;
using Xcianify.Core.DTOs;
using Xcianify.Core.DTOs.ProductType;

namespace Xcianify.Presentation.Controllers
{
    [Route("api/product-types")]
    public class ProductTypeController : BaseApiController
    {
        private readonly IProductTypeService _productTypeService;

        public ProductTypeController(IProductTypeService productTypeService)
        {
            _productTypeService = productTypeService ?? throw new ArgumentNullException(nameof(productTypeService));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var productType = await _productTypeService.GetByIdAsync(id);
            return Ok(productType);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var productTypes = await _productTypeService.GetAllAsync();
            return Ok(productTypes);
        }

        [HttpGet("active")]
        public async Task<IActionResult> GetActive()
        {
            var productTypes = await _productTypeService.GetActiveAsync();
            return Ok(productTypes);
        }

        [HttpGet("parent-types")]
        public async Task<IActionResult> GetParentTypes()
        {
            var productTypes = await _productTypeService.GetParentTypesAsync();
            return Ok(productTypes);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateProductTypeDto createDto)
        {
            var productType = await _productTypeService.CreateAsync(createDto, CurrentUserId);
            return CreatedAtAction(nameof(GetById), new { id = productType.Id }, productType);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateProductTypeDto updateDto)
        {
            var productType = await _productTypeService.UpdateAsync(id, updateDto, CurrentUserId);
            return Ok(productType);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _productTypeService.DeleteAsync(id);
            return NoContent();
        }
    }
} 