using System;

namespace Xcianify.Core.DTOs
{
    public class CreateCurrencyDto
    {
        public string? CurrencyCode { get; set; }
        public decimal ExchangeUsd { get; set; }
        public bool IsActive { get; set; }
    }
} 