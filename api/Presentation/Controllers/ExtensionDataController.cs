using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using Xcianify.Core.Domain.Services;
using Xcianify.Core.DTOs.ExtensionData;

namespace Xcianify.Presentation.Controllers
{
    [Route("api/extension-data")]
    public class ExtensionDataController : BaseApiController
    {
        private readonly IExtensionDataService _extensionDataService;

        public ExtensionDataController(IExtensionDataService extensionDataService)
        {
            _extensionDataService = extensionDataService ?? throw new ArgumentNullException(nameof(extensionDataService));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var extensionData = await _extensionDataService.GetByIdAsync(id);
            return Ok(extensionData);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var extensionDataList = await _extensionDataService.GetAllAsync();
            return Ok(extensionDataList);
        }

        [HttpGet("active")]
        public async Task<IActionResult> GetActive()
        {
            var extensionDataList = await _extensionDataService.GetActiveAsync();
            return Ok(extensionDataList);
        }

        [HttpGet("entity-type/{entityType}")]
        public async Task<IActionResult> GetByEntityType(string entityType)
        {
            var extensionDataList = await _extensionDataService.GetByEntityTypeAsync(entityType);
            return Ok(extensionDataList);
        }

        [HttpGet("entity-type/{entityType}/entity-id/{entityTypeId}")]
        public async Task<IActionResult> GetByEntityTypeAndId(string entityType, int entityTypeId)
        {
            var extensionDataList = await _extensionDataService.GetByEntityTypeAndIdAsync(entityType, entityTypeId);
            return Ok(extensionDataList);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateExtensionDataDto createDto)
        {
            
            var extensionData = await _extensionDataService.CreateAsync(createDto, CurrentUserId);
            return CreatedAtAction(nameof(GetById), new { id = extensionData.Id }, extensionData);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateExtensionDataDto updateDto)
        {
            var extensionData = await _extensionDataService.UpdateAsync(id, updateDto, CurrentUserId);
            return Ok(extensionData);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _extensionDataService.DeleteAsync(id);
            return NoContent();
        }
    }
}
