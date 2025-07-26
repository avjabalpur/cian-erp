namespace Xcianify.Core.DTOs
{
    public class CurrencyDto
    {
        public int Id { get; set; }
        public string CurrencyCode { get; set; }
        public decimal ExchangeUsd { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}