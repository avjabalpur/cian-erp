using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Xcianify.Core.DTOs.Organization;
using Xcianify.Core.Domain.Services;
using Core.DTOs.Organization;

namespace Xcianify.Presentation.Controllers
{
    [Route("api/organizations")]
    public class OrganizationController : BaseApiController
    {
        private readonly IOrganizationService _organizationService;

        public OrganizationController(IOrganizationService organizationService)
        {
            _organizationService = organizationService;
        }

        [HttpGet]
        public async Task<ActionResult<PaginatedOrganizationResultDto>> GetAll(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string search = null,
            [FromQuery] bool? isActive = null,
            [FromQuery] int? locationTypeId = null,
            [FromQuery] string sortBy = null,
            [FromQuery] bool sortDescending = false)
        {
            var filter = new OrganizationFilterDto
            {
                PageNumber = pageNumber,
                PageSize = pageSize,
                Search = search,
                IsActive = isActive,
                LocationTypeId = locationTypeId
            };

            var result = await _organizationService.GetOrganizationsAsync(filter);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<OrganizationDto>> GetById(int id)
        {
            var organization = await _organizationService.GetOrganizationByIdAsync(id);
            return Ok(organization);
        }

        [HttpGet("code/{code}")]
        public async Task<ActionResult<OrganizationDto>> GetByCode(string code)
        {
            var organization = await _organizationService.GetOrganizationByCodeAsync(code);
            return Ok(organization);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<OrganizationDto>> Create([FromBody] CreateOrganizationDto dto)
        {
            var createdOrganization = await _organizationService.CreateOrganizationAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = createdOrganization.Id }, createdOrganization);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateOrganizationDto dto)
        {
            if (id != dto.Id)
            {
                return BadRequest("ID in the URL does not match the ID in the request body.");
            }

            await _organizationService.UpdateOrganizationAsync(dto);
            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            await _organizationService.DeleteOrganizationAsync(id);
            return NoContent();
        }
    }
}
