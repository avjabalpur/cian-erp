using Microsoft.AspNetCore.Mvc;
using Xcianify.Services;
using Xcianify.Core.DTOs.ConfigList;
using Xcianify.Core.DTOs;
using Xcianify.Core.Domain.Services;

namespace Xcianify.Presentation.Controllers
{
    [ApiController]
    [Route("api/config-list")]
    public class ConfigListController : ControllerBase
    {
        private readonly IConfigListService _configListService;
        private readonly IConfigListValueService _configListValueService;

        public ConfigListController(IConfigListService configListService, IConfigListValueService configListValueService)
        {
            _configListService = configListService;
            _configListValueService = configListValueService;
        }

        [HttpGet]
        public async Task<ActionResult> GetAll([FromQuery] ConfigListFilterDto filter)
        {
            try
            {
                var result = await _configListService.GetAllAsync(filter);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving config lists", error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ConfigListDto>> GetById(int id)
        {
            try
            {
                var result = await _configListService.GetByIdAsync(id);
                if (result == null)
                    return NotFound(new { message = "Config list not found" });

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving config list", error = ex.Message });
            }
        }

        [HttpPost]
        public async Task<ActionResult<ConfigListDto>> Create(CreateConfigListDto createDto)
        {
            try
            {
                if (await _configListService.ExistsByCodeAsync(createDto.ListCode))
                    return BadRequest(new { message = "A config list with this code already exists" });

                var result = await _configListService.CreateAsync(createDto);
                return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while creating config list", error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ConfigListDto>> Update(int id, UpdateConfigListDto updateDto)
        {
            try
            {
                if (!await _configListService.ExistsAsync(id))
                    return NotFound(new { message = "Config list not found" });

                if (await _configListService.ExistsByCodeAsync(updateDto.ListCode, id))
                    return BadRequest(new { message = "A config list with this code already exists" });

                var result = await _configListService.UpdateAsync(id, updateDto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating config list", error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            try
            {
                if (!await _configListService.ExistsAsync(id))
                    return NotFound(new { message = "Config list not found" });

                await _configListService.DeleteAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting config list", error = ex.Message });
            }
        }

        // Config List Values endpoints
        [HttpGet("{listId}/values")]
        public async Task<ActionResult> GetValues(int listId, [FromQuery] ConfigListValueFilterDto filter)
        {
            try
            {
                filter.ListId = listId;
                var result = await _configListValueService.GetAllAsync(filter);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving config list values", error = ex.Message });
            }
        }

        [HttpGet("{listId}/values/all")]
        public async Task<ActionResult<List<ConfigListValueDto>>> GetAllValues(int listId)
        {
            try
            {
                var result = await _configListValueService.GetByListIdAsync(listId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving config list values", error = ex.Message });
            }
        }

        [HttpGet("values/{id}")]
        public async Task<ActionResult<ConfigListValueDto>> GetValueById(int id)
        {
            try
            {
                var result = await _configListValueService.GetByIdAsync(id);
                if (result == null)
                    return NotFound(new { message = "Config list value not found" });

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving config list value", error = ex.Message });
            }
        }

        [HttpGet("{listCode}/values")]
        public async Task<ActionResult> GetValuesByListCode(string listCode)
        {
            try
            {
                // First get the config list by code
                var configList = await _configListService.GetByCodeAsync(listCode);
                if (configList == null)
                    return NotFound(new { message = $"Config list with code '{listCode}' not found" });

                // Then get all values for this list
                var filter = new ConfigListValueFilterDto
                {
                    ListId = configList.Id,
                    IsActive = true, // Only active values
                    PageNumber = 1,
                    PageSize = 1000 // Get all values
                };

                var result = await _configListValueService.GetAllAsync(filter);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving config list values", error = ex.Message });
            }
        }

        [HttpPost("values")]
        public async Task<ActionResult<ConfigListValueDto>> CreateValue(CreateConfigListValueDto createDto)
        {
            try
            {
                if (await _configListValueService.ExistsByCodeAsync(createDto.ListId, createDto.ValueCode))
                    return BadRequest(new { message = "A config list value with this code already exists for this list" });

                var result = await _configListValueService.CreateAsync(createDto);
                return CreatedAtAction(nameof(GetValueById), new { id = result.Id }, result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while creating config list value", error = ex.Message });
            }
        }

        [HttpPut("values/{id}")]
        public async Task<ActionResult<ConfigListValueDto>> UpdateValue(int id, UpdateConfigListValueDto updateDto)
        {
            try
            {
                if (!await _configListValueService.ExistsAsync(id))
                    return NotFound(new { message = "Config list value not found" });

                if (await _configListValueService.ExistsByCodeAsync(updateDto.ListId, updateDto.ValueCode, id))
                    return BadRequest(new { message = "A config list value with this code already exists for this list" });

                var result = await _configListValueService.UpdateAsync(id, updateDto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating config list value", error = ex.Message });
            }
        }

        [HttpDelete("values/{id}")]
        public async Task<ActionResult> DeleteValue(int id)
        {
            try
            {
                if (!await _configListValueService.ExistsAsync(id))
                    return NotFound(new { message = "Config list value not found" });

                await _configListValueService.DeleteAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting config list value", error = ex.Message });
            }
        }
    }
} 