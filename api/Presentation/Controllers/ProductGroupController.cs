using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xcianify.Core.Domain.Services;
using Xcianify.Core.DTOs.ProductGroup;

namespace Xcianify.Presentation.Controllers
{
    [Route("api/product-groups")]
    public class ProductGroupController : BaseApiController
    {
        private readonly IProductGroupService _productGroupService;

        public ProductGroupController(IProductGroupService productGroupService)
        {
            _productGroupService = productGroupService ?? throw new ArgumentNullException(nameof(productGroupService));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var productGroup = await _productGroupService.GetByIdAsync(id);
            return Ok(productGroup);
        }

        [HttpGet("code/{code}")]
        public async Task<IActionResult> GetByCode(string code)
        {
            var productGroup = await _productGroupService.GetByCodeAsync(code);
            return Ok(productGroup);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var productGroups = await _productGroupService.GetAllAsync();
            return Ok(productGroups);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateProductGroupDto createDto)
        {
            var userId = int.Parse(User.FindFirst("userId")?.Value ?? "0");
            if (userId <= 0)
            {
                return Unauthorized(new { message = "Invalid user" });
            }

            var productGroup = await _productGroupService.CreateAsync(createDto, userId);
            return CreatedAtAction(nameof(GetById), new { id = productGroup.Id }, productGroup);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateProductGroupDto updateDto)
        {
            var userId = int.Parse(User.FindFirst("userId")?.Value ?? "0");
            if (userId <= 0)
            {
                return Unauthorized(new { message = "Invalid user" });
            }

            var productGroup = await _productGroupService.UpdateAsync(id, updateDto, userId);
            return Ok(productGroup);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _productGroupService.DeleteAsync(id);
            return NoContent();
        }
    }
} 