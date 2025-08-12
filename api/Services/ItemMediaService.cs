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
using System.Linq;

namespace Xcianify.Services
{
    public class ItemMediaService : IItemMediaService
    {
        private readonly IItemMediaRepository _repository;
        private readonly IItemMasterRepository _itemMasterRepository;
        private readonly IMapper _mapper;
        private readonly string _uploadPath;

        public ItemMediaService(
            IItemMediaRepository repository,
            IItemMasterRepository itemMasterRepository,
            IMapper mapper)
        {
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
            _itemMasterRepository = itemMasterRepository ?? throw new ArgumentNullException(nameof(itemMasterRepository));
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
            // Validate that the item exists
            try
            {
                //var item = await _itemMasterRepository.GetItemByIdAsync(createDto.ItemId);
                //if (item == null)
                //    throw new NotFoundException($"Item with ID {createDto.ItemId} not found");
            }
            catch (NotFoundException)
            {
                throw new NotFoundException($"Item with ID {createDto.ItemId} not found");
            }

            // Validate file
            if (createDto.File == null || createDto.File.Length == 0)
                throw new ArgumentException("File is required and cannot be empty");

            // Validate file size (e.g., 10MB limit)
            const long maxFileSize = 10 * 1024 * 1024; // 10MB
            if (createDto.File.Length > maxFileSize)
                throw new ArgumentException($"File size cannot exceed {maxFileSize / (1024 * 1024)}MB");

            // Validate file type
            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp", ".mp4", ".avi", ".mov", ".wmv", ".mp3", ".wav", ".aac", ".pdf", ".doc", ".docx", ".txt" };
            var fileExtension = Path.GetExtension(createDto.File.FileName).ToLowerInvariant();
            if (!allowedExtensions.Contains(fileExtension))
                throw new ArgumentException($"File type {fileExtension} is not allowed");

            var entity = new ItemMedia
            {
                ItemId = createDto.ItemId,
                Description = createDto.Description,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = userId,
                IsDeleted = false
            };
            
            // Handle file upload if file is provided
            if (createDto.File != null)
            {
                var fileInfo = await SaveFileAsync(createDto.File);
                entity.FileName = fileInfo.FileName;
                entity.FileExtension = fileInfo.FileExtension;
                entity.FileSizeBytes = (int?)fileInfo.FileSizeBytes;
                entity.MimeType = fileInfo.MimeType;
                entity.MediaUrl = fileInfo.MediaUrl;
                entity.MediaType = GetMediaType(fileInfo.FileExtension);
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
            
            var entity = new ItemMedia
            {
                Id = id,
                ItemId = existing.ItemId, // Preserve the original ItemId
                Description = updateDto.Description,
                UpdatedAt = DateTime.UtcNow,
                UpdatedBy = userId,
                IsDeleted = false
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
                entity.FileSizeBytes = (int?)fileInfo.FileSizeBytes;
                entity.MimeType = fileInfo.MimeType;
                entity.MediaUrl = fileInfo.MediaUrl;
                entity.MediaType = GetMediaType(fileInfo.FileExtension);
            }
            else
            {
                // Preserve existing file info if no new file
                entity.FileName = existing.FileName;
                entity.FileExtension = existing.FileExtension;
                entity.FileSizeBytes = existing.FileSizeBytes;
                entity.MimeType = existing.MimeType;
                entity.MediaUrl = existing.MediaUrl;
                entity.MediaType = existing.MediaType;
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

            // Use original filename with timestamp to ensure uniqueness
            var originalFileName = Path.GetFileNameWithoutExtension(file.FileName);
            var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
            var timestamp = DateTime.UtcNow.ToString("yyyyMMdd_HHmmss");
            var fileName = $"{originalFileName}_{timestamp}{fileExtension}";
            
            // Ensure filename is safe for file system
            fileName = MakeSafeFileName(fileName);
            
            var filePath = Path.Combine(_uploadPath, fileName);
            
            // Save file to disk
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
            
            // Generate URL (adjust base URL as needed)
            var mediaUrl = $"/uploads/item-media/{fileName}";
            
            return (fileName, fileExtension, file.Length, file.ContentType, mediaUrl);
        }

        private void DeleteFile(string mediaUrl)
        {
            try
            {
                if (!string.IsNullOrEmpty(mediaUrl))
                {
                    var fileName = Path.GetFileName(mediaUrl);
                    var filePath = Path.Combine(_uploadPath, fileName);
                    if (File.Exists(filePath))
                    {
                        File.Delete(filePath);
                    }
                }
            }
            catch (Exception)
            {
                // Log error but don't throw - file deletion is not critical
            }
        }

        private string GetMediaType(string fileExtension)
        {
            return fileExtension.ToLowerInvariant() switch
            {
                ".jpg" or ".jpeg" or ".png" or ".gif" or ".bmp" => "image",
                ".mp4" or ".avi" or ".mov" or ".wmv" => "video",
                ".mp3" or ".wav" or ".aac" => "audio",
                ".pdf" => "document",
                _ => "other"
            };
        }

        private string MakeSafeFileName(string fileName)
        {
            // Remove or replace invalid characters for file system
            var invalidChars = Path.GetInvalidFileNameChars();
            var safeFileName = fileName;
            
            foreach (var invalidChar in invalidChars)
            {
                safeFileName = safeFileName.Replace(invalidChar, '_');
            }
            
            // Remove any double underscores that might have been created
            while (safeFileName.Contains("__"))
            {
                safeFileName = safeFileName.Replace("__", "_");
            }
            
            // Trim underscores from start and end
            safeFileName = safeFileName.Trim('_');
            
            // Ensure the filename is not too long (Windows has a 255 character limit for the full path)
            if (safeFileName.Length > 200) // Leave some room for path
            {
                var extension = Path.GetExtension(safeFileName);
                var nameWithoutExtension = Path.GetFileNameWithoutExtension(safeFileName);
                safeFileName = nameWithoutExtension.Substring(0, 200 - extension.Length) + extension;
            }
            
            return safeFileName;
        }
    }
}
