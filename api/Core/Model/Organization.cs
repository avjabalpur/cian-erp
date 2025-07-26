using System;

namespace Xcianify.Core.Model
{
    public class Organization : BaseModel
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public int LocationTypeId { get; set; }
        public string Name { get; set; }
        public string ContactPerson { get; set; }
        public string Address1 { get; set; }
        public string Address2 { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Country { get; set; }
        public string Zip { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public string Website { get; set; }
        public string GstinNumber { get; set; }
        public string TdsCycle { get; set; }
        public string EmploymentStatusCode { get; set; }
        public string EsiOfficeCode { get; set; }
        public string ExcReginCode { get; set; }
        public string StRegnCode { get; set; }
        public string CinNumber { get; set; }
        public string InterfaceCode { get; set; }
        public string LicenseNumber { get; set; }
        public string EccNumber { get; set; }
        public string Range { get; set; }
        public string Division { get; set; }
        public string Collectorat { get; set; }
        public string DrugLicenseNumber1 { get; set; }
        public string DrugLicenseNumber2 { get; set; }
        public string FoodLicenseNumber { get; set; }
        public string CstRegnNumber { get; set; }
        public string VatTinNumber { get; set; }
        public string PanNumber { get; set; }
    }
}
