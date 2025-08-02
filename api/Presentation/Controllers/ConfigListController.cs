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
            var result = await _configListService.GetAllAsync(filter);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ConfigListDto>> GetById(int id)
        {
            var result = await _configListService.GetByIdAsync(id);
            if (result == null)
                return NotFound(new { message = "Config list not found" });

            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<ConfigListDto>> Create(CreateConfigListDto createDto)
        {
            if (await _configListService.ExistsByCodeAsync(createDto.ListCode))
                return BadRequest(new { message = "A config list with this code already exists" });

            var result = await _configListService.CreateAsync(createDto);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ConfigListDto>> Update(int id, UpdateConfigListDto updateDto)
        {
            if (!await _configListService.ExistsAsync(id))
                return NotFound(new { message = "Config list not found" });

            if (await _configListService.ExistsByCodeAsync(updateDto.ListCode, id))
                return BadRequest(new { message = "A config list with this code already exists" });

            var result = await _configListService.UpdateAsync(id, updateDto);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            if (!await _configListService.ExistsAsync(id))
                return NotFound(new { message = "Config list not found" });

            await _configListService.DeleteAsync(id);
            return NoContent();
        }

        [HttpGet("{listId}/values")]
        public async Task<ActionResult> GetValues(int listId)
        {
            var result = await _configListValueService.GetByListIdAsync(listId);
            return Ok(result);
        }

        [HttpGet("values/{id}")]
        public async Task<ActionResult<ConfigListValueDto>> GetValueById(int id)
        {
            var result = await _configListValueService.GetByIdAsync(id);
            if (result == null)
                return NotFound(new { message = "Config list value not found" });

            return Ok(result);
        }

        [HttpGet("{listCode}/code/values")]
        public async Task<ActionResult> GetValuesByListCode(string listCode)
        {
            // First get the config list by code
            var configList = await _configListService.GetByCodeAsync(listCode);
            if (configList == null)
                return NotFound(new { message = $"Config list with code '{listCode}' not found" });
            
            var result = await _configListValueService.GetByListIdAsync(configList.Id);
            return Ok(result);
        }

        [HttpPost("values")]
        public async Task<ActionResult<ConfigListValueDto>> CreateValue(CreateConfigListValueDto createDto)
        {
            if (await _configListValueService.ExistsByCodeAsync(createDto.ListId, createDto.ValueCode))
                return BadRequest(new { message = "A config list value with this code already exists for this list" });

            var result = await _configListValueService.CreateAsync(createDto);
            return CreatedAtAction(nameof(GetValueById), new { id = result.Id }, result);
        }

        [HttpPut("values/{id}")]
        public async Task<ActionResult<ConfigListValueDto>> UpdateValue(int id, UpdateConfigListValueDto updateDto)
        {
            if (!await _configListValueService.ExistsAsync(id))
                return NotFound(new { message = "Config list value not found" });

            if (await _configListValueService.ExistsByCodeAsync(updateDto.ListId, updateDto.ValueCode, id))
                return BadRequest(new { message = "A config list value with this code already exists for this list" });

            var result = await _configListValueService.UpdateAsync(id, updateDto);
            return Ok(result);

        }

        [HttpDelete("values/{id}")]
        public async Task<ActionResult> DeleteValue(int id)
        {
            if (!await _configListValueService.ExistsAsync(id))
                return NotFound(new { message = "Config list value not found" });

            await _configListValueService.DeleteAsync(id);
            return NoContent();
        }
    }
} 