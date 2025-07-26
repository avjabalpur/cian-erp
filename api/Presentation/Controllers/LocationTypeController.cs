using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Xcianify.Core.DTOs.Organization;
using Xcianify.Core.Domain.Services;

namespace Xcianify.Presentation.Controllers
{
    [Route("api/location-types")]
    public class LocationTypeController : BaseApiController
    {
        private readonly ILocationTypeService _locationTypeService;

        public LocationTypeController(ILocationTypeService locationTypeService)
        {
            _locationTypeService = locationTypeService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<LocationTypeDto>>> GetAll()
        {
            var locationTypes = await _locationTypeService.GetAllLocationTypesAsync();
            return Ok(locationTypes);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<LocationTypeDto>> GetById(int id)
        {
            var locationType = await _locationTypeService.GetLocationTypeByIdAsync(id);
            return Ok(locationType);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<LocationTypeDto>> Create([FromBody] CreateLocationTypeDto dto)
        {
            var createdLocationType = await _locationTypeService.CreateLocationTypeAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = createdLocationType.Id }, createdLocationType);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateLocationTypeDto dto)
        {
            if (id != dto.Id)
            {
                return BadRequest("ID in the URL does not match the ID in the request body.");
            }

            await _locationTypeService.UpdateLocationTypeAsync(dto);
            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            await _locationTypeService.DeleteLocationTypeAsync(id);
            return NoContent();
        }
    }
}
