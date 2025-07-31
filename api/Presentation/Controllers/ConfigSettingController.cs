using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Xcianify.Core.DTOs.ConfigSetting;
using Xcianify.Core.Domain.Services;

namespace Xcianify.Presentation.Controllers
{
    [Route("api/config-settings")]
    public class ConfigSettingController : BaseApiController
    {
        private readonly IConfigSettingService _configSettingService;

        public ConfigSettingController(IConfigSettingService configSettingService)
        {
            _configSettingService = configSettingService;
        }

        [HttpGet]
        public async Task<ActionResult<PaginatedConfigSettingResultDto>> GetAll(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string searchTerm = null,
            [FromQuery] bool? isActive = null,
            [FromQuery] string sortBy = null,
            [FromQuery] bool sortDescending = false)
        {
            var filter = new ConfigSettingFilterDto
            {
                PageNumber = pageNumber,
                PageSize = pageSize,
                SearchTerm = searchTerm,
                IsActive = isActive
            };

            var result = await _configSettingService.GetConfigSettingsAsync(filter);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ConfigSettingDto>> GetById(int id)
        {
            var configSetting = await _configSettingService.GetConfigSettingByIdAsync(id);
            return Ok(configSetting);
        }

        [HttpGet("key/{settingKey}")]
        public async Task<ActionResult<ConfigSettingDto>> GetByKey(string settingKey)
        {
            var configSetting = await _configSettingService.GetConfigSettingByKeyAsync(settingKey);
            return Ok(configSetting);
        }

        [HttpPost]
        public async Task<ActionResult<ConfigSettingDto>> Create([FromBody] CreateConfigSettingDto dto)
        {
            var createdConfigSetting = await _configSettingService.CreateConfigSettingAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = createdConfigSetting.Id }, createdConfigSetting);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateConfigSettingDto dto)
        {
            if (id != dto.Id)
            {
                return BadRequest("ID in the URL does not match the ID in the request body.");
            }

            await _configSettingService.UpdateConfigSettingAsync(dto);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _configSettingService.DeleteConfigSettingAsync(id);
            return NoContent();
        }
    }
} 