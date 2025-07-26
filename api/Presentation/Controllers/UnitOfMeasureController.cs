using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Xcianify.Core.DTOs.ItemMaster;
using Xcianify.Core.Domain.Services;

namespace Xcianify.Presentation.Controllers
{
    [Route("api/units-of-measure")]
    public class UnitOfMeasureController : BaseApiController
    {
        private readonly IUnitOfMeasureService _unitOfMeasureService;

        public UnitOfMeasureController(
            IUnitOfMeasureService unitOfMeasureService)
        {
            _unitOfMeasureService = unitOfMeasureService;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var uom = await _unitOfMeasureService.GetByIdAsync(id);
            return Ok(uom);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] UnitOfMeasureFilterDto filter)
        {
            var result = await _unitOfMeasureService.GetAllAsync(filter);
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateUnitOfMeasureDto dto)
        {

            var userId = int.Parse(User.FindFirst("userId")?.Value ?? "0");
            if (userId <= 0)
            {
                return Unauthorized(new { message = "Invalid user" });
            }

            var createdUom = await _unitOfMeasureService.CreateAsync(dto, userId);
            return CreatedAtAction(nameof(GetById), new { id = createdUom.Id }, createdUom);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateUnitOfMeasureDto dto)
        {

            var userId = int.Parse(User.FindFirst("userId")?.Value ?? "0");
            if (userId <= 0)
            {
                return Unauthorized(new { message = "Invalid user" });
            }

            var updatedUom = await _unitOfMeasureService.UpdateAsync(id, dto, userId);
            return Ok(updatedUom);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _unitOfMeasureService.DeleteAsync(id);
            if (!result)
            {
                return NotFound(new { message = "Unit of measure not found" });
            }
            return NoContent();
        }
    }
}
