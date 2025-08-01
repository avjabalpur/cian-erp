using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using Xcianify.Core.Domain.Services;
using Xcianify.Core.DTOs;
using Xcianify.Core.DTOs.Dosage;

namespace Xcianify.Presentation.Controllers
{
    [Route("api/dosages")]
    public class DosageController : BaseApiController
    {
        private readonly IDosageService _dosageService;

        public DosageController(IDosageService dosageService)
        {
            _dosageService = dosageService ?? throw new ArgumentNullException(nameof(dosageService));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var dosage = await _dosageService.GetByIdAsync(id);
            return Ok(dosage);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var dosages = await _dosageService.GetAllAsync();
            return Ok(dosages);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateDosageDto createDto)
        {
            var dosage = await _dosageService.CreateAsync(createDto, CurrentUserId);
            return CreatedAtAction(nameof(GetById), new { id = dosage.Id }, dosage);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateDosageDto updateDto)
        {
            var dosage = await _dosageService.UpdateAsync(id, updateDto, CurrentUserId);
            return Ok(dosage);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _dosageService.DeleteAsync(id);
            return NoContent();
        }
    }
} 