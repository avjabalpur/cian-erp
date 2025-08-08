using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.IO;
using Microsoft.AspNetCore.Http;
using AutoMapper;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Core.Domain.Services;
using Xcianify.Core.DTOs.ItemMedia;
using Xcianify.Core.Exceptions;
using Xcianify.Core.Model;

namespace Xcianify.Services
{
    public class ItemMediaService : IItemMediaService
    {
        private readonly IItemMediaRepository _repository;
        private readonly IMapper _mapper;
        private readonly string _uploadPath;

        public ItemMediaService(
            IItemMediaRepository repository,
            IMapper mapper)
        {
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "item-media");
            
            // Ensure upload directory exists
            if (!Directory.Exists(_uploadPath))
            {
                Directory.CreateDirectory(_uploadPath);
            }
        }

        public async Task<ItemMediaDto> GetByIdAsync(int id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null)
                throw new NotFoundException("ItemMedia not found");
            return _mapper.Map<ItemMediaDto>(entity);
        }

        public async Task<IEnumerable<ItemMediaDto>> GetByItemIdAsync(int itemId)
        {
            var entities = await _repository.GetByItemIdAsync(itemId);
            return _mapper.Map<IEnumerable<ItemMediaDto>>(entities);
        }

        public async Task<ItemMediaDto> CreateAsync(CreateItemMediaDto createDto, int userId)
        {
            // Create entity manually instead of using AutoMapper to avoid validation issues
            var entity = new ItemMedia
            {
                ItemId = createDto.ItemId,
                MediaType = createDto.MediaType,
                Description = createDto.Description ?? string.Empty,
                CreatedBy = userId,
                UpdatedBy = userId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            
            // Handle file upload if file is provided
            if (createDto.File != null)
            {
                var fileInfo = await SaveFileAsync(createDto.File);
                entity.FileName = fileInfo.FileName;
                entity.FileExtension = fileInfo.FileExtension;
                entity.FileSizeBytes = fileInfo.FileSizeBytes;
                entity.MimeType = fileInfo.MimeType;
                entity.MediaUrl = fileInfo.MediaUrl;
                entity.MediaType = GetMediaType(fileInfo.FileExtension);
            }
            else
            {
                // Set default values for required fields if no file
                entity.FileName = string.Empty;
                entity.FileExtension = string.Empty;
                entity.MimeType = string.Empty;
                entity.MediaUrl = string.Empty;
                entity.MediaType = createDto.MediaType ?? "other";
            }
            
            var id = await _repository.CreateAsync(entity);
            entity.Id = id;
            return _mapper.Map<ItemMediaDto>(entity);
        }

        public async Task<ItemMediaDto> UpdateAsync(int id, UpdateItemMediaDto updateDto, int userId)
        {
            var existing = await _repository.GetByIdAsync(id);
            if (existing == null)
                throw new NotFoundException("ItemMedia not found");
            
            // Create entity manually instead of using AutoMapper
            var entity = new ItemMedia
            {
                Id = id,
                ItemId = existing.ItemId, // Preserve the original ItemId
                MediaType = updateDto.MediaType ?? existing.MediaType,
                Description = updateDto.Description ?? existing.Description ?? string.Empty,
                CreatedBy = existing.CreatedBy, // Preserve original creator
                CreatedAt = existing.CreatedAt, // Preserve original creation date
                UpdatedBy = userId,
                UpdatedAt = DateTime.UtcNow
            };
            
            // Handle file upload if new file is provided
            if (updateDto.File != null)
            {
                // Delete old file if exists
                if (!string.IsNullOrEmpty(existing.MediaUrl))
                {
                    DeleteFile(existing.MediaUrl);
                }
                
                var fileInfo = await SaveFileAsync(updateDto.File);
                entity.FileName = fileInfo.FileName;
                entity.FileExtension = fileInfo.FileExtension;
                entity.FileSizeBytes = fileInfo.FileSizeBytes;
                entity.MimeType = fileInfo.MimeType;
                entity.MediaUrl = fileInfo.MediaUrl;
                entity.MediaType = GetMediaType(fileInfo.FileExtension);
            }
            else
            {
                // Preserve existing file info if no new file
                entity.FileName = existing.FileName ?? string.Empty;
                entity.FileExtension = existing.FileExtension ?? string.Empty;
                entity.FileSizeBytes = existing.FileSizeBytes;
                entity.MimeType = existing.MimeType ?? string.Empty;
                entity.MediaUrl = existing.MediaUrl ?? string.Empty;
                entity.MediaType = existing.MediaType ?? "other";
            }
                   
            var success = await _repository.UpdateAsync(entity);
            if (!success)
                throw new ApplicationException("Failed to update ItemMedia");
                
            return _mapper.Map<ItemMediaDto>(entity);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var existing = await _repository.GetByIdAsync(id);
            if (existing != null && !string.IsNullOrEmpty(existing.MediaUrl))
            {
                DeleteFile(existing.MediaUrl);
            }
            return await _repository.DeleteAsync(id);
        }

        private async Task<(string FileName, string FileExtension, long FileSizeBytes, string MimeType, string MediaUrl)> SaveFileAsync(IFormFile file)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("File is empty or null");

            // Generate unique filename
            var fileExtension = Path.GetExtension(file.FileName ?? "unknown").ToLowerInvariant();
            var fileName = $"{Guid.NewGuid()}{fileExtension}";
            var filePath = Path.Combine(_uploadPath, fileName);
            
            // Save file to disk
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
            
            // Generate URL (adjust base URL as needed)
            var mediaUrl = $"/uploads/item-media/{fileName}";
            
            return (fileName, fileExtension, file.Length, file.ContentType ?? "application/octet-stream", mediaUrl);
        }

        private void DeleteFile(string? mediaUrl)
        {
            try
            {
                if (!string.IsNullOrEmpty(mediaUrl))
                {
                    var fileName = Path.GetFileName(mediaUrl);
                    if (!string.IsNullOrEmpty(fileName))
                    {
                        var filePath = Path.Combine(_uploadPath, fileName);
                        if (File.Exists(filePath))
                        {
                            File.Delete(filePath);
                        }
                    }
                }
            }
            catch (Exception)
            {
                // Log error but don't throw - file deletion is not critical
            }
        }

        private string GetMediaType(string? fileExtension)
        {
            if (string.IsNullOrEmpty(fileExtension))
                return "other";
                
            return fileExtension.ToLowerInvariant() switch
            {
                ".jpg" or ".jpeg" or ".png" or ".gif" or ".bmp" => "image",
                ".mp4" or ".avi" or ".mov" or ".wmv" => "video",
                ".mp3" or ".wav" or ".aac" => "audio",
                ".pdf" => "document",
                _ => "other"
            };
        }
    }
}
