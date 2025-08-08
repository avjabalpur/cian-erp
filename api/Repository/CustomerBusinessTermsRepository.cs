using Dapper;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Core.Model;
using Xcianify.Core.DTOs.CustomerBusinessTerms;
using Xcianify.Repository.DbContext;

namespace Xcianify.Repository
{
    public class CustomerBusinessTermsRepository : ICustomerBusinessTermsRepository
    {
        private readonly DapperDbContext _context;

        public CustomerBusinessTermsRepository(DapperDbContext context)
        {
            _context = context;
        }

        public async Task<List<CustomerBusinessTerms>> GetByCustomerIdAsync(int customerId)
        {
            using var connection = _context.GetConnection();
            var sql = @"
                SELECT 
                    id, customer_id, destination_code, transport_mode_code, transporter_code,
                    lead_days, customer_distance, freight_indicator, supply_stock_location,
                    allow_consignment_on_booking, customer_account_code, credit_limit,
                    minimum_invoice_amount, customer_scheme_code, customer_broker_code,
                    customer_broker_rate, cash_discount_percentage, misc_charge_percentage,
                    misc_discount_percentage, payment_term_code, credit_period_days,
                    new_party_credit_period_days, is_overdue_check, number_of_bills,
                    outstanding_bill_period_days, outstanding_bill_account_indicator,
                    created_at, updated_at
                FROM customer_business_terms 
                WHERE customer_id = @CustomerId
                ORDER BY created_at DESC";

            var businessTerms = await connection.QueryAsync<CustomerBusinessTerms>(sql, new { CustomerId = customerId });
            return businessTerms.ToList();
        }

        public async Task<CustomerBusinessTerms?> GetByIdAsync(int id)
        {
            using var connection = _context.GetConnection();
            var sql = @"
                SELECT 
                    id, customer_id, destination_code, transport_mode_code, transporter_code,
                    lead_days, customer_distance, freight_indicator, supply_stock_location,
                    allow_consignment_on_booking, customer_account_code, credit_limit,
                    minimum_invoice_amount, customer_scheme_code, customer_broker_code,
                    customer_broker_rate, cash_discount_percentage, misc_charge_percentage,
                    misc_discount_percentage, payment_term_code, credit_period_days,
                    new_party_credit_period_days, is_overdue_check, number_of_bills,
                    outstanding_bill_period_days, outstanding_bill_account_indicator,
                    created_at, updated_at
                FROM customer_business_terms 
                WHERE id = @Id";

            return await connection.QueryFirstOrDefaultAsync<CustomerBusinessTerms>(sql, new { Id = id });
        }

        public async Task<CustomerBusinessTerms> CreateAsync(CustomerBusinessTerms customerBusinessTerms)
        {
            using var connection = _context.GetConnection();
            var sql = @"
                INSERT INTO customer_business_terms (
                    customer_id, destination_code, transport_mode_code, transporter_code,
                    lead_days, customer_distance, freight_indicator, supply_stock_location,
                    allow_consignment_on_booking, customer_account_code, credit_limit,
                    minimum_invoice_amount, customer_scheme_code, customer_broker_code,
                    customer_broker_rate, cash_discount_percentage, misc_charge_percentage,
                    misc_discount_percentage, payment_term_code, credit_period_days,
                    new_party_credit_period_days, is_overdue_check, number_of_bills,
                    outstanding_bill_period_days, outstanding_bill_account_indicator, created_at
                ) VALUES (
                    @CustomerId, @DestinationCode, @TransportModeCode, @TransporterCode,
                    @LeadDays, @CustomerDistance, @FreightIndicator, @SupplyStockLocation,
                    @AllowConsignmentOnBooking, @CustomerAccountCode, @CreditLimit,
                    @MinimumInvoiceAmount, @CustomerSchemeCode, @CustomerBrokerCode,
                    @CustomerBrokerRate, @CashDiscountPercentage, @MiscChargePercentage,
                    @MiscDiscountPercentage, @PaymentTermCode, @CreditPeriodDays,
                    @NewPartyCreditPeriodDays, @IsOverdueCheck, @NumberOfBills,
                    @OutstandingBillPeriodDays, @OutstandingBillAccountIndicator, @CreatedAt
                )
                RETURNING 
                    id, customer_id, destination_code, transport_mode_code, transporter_code,
                    lead_days, customer_distance, freight_indicator, supply_stock_location,
                    allow_consignment_on_booking, customer_account_code, credit_limit,
                    minimum_invoice_amount, customer_scheme_code, customer_broker_code,
                    customer_broker_rate, cash_discount_percentage, misc_charge_percentage,
                    misc_discount_percentage, payment_term_code, credit_period_days,
                    new_party_credit_period_days, is_overdue_check, number_of_bills,
                    outstanding_bill_period_days, outstanding_bill_account_indicator,
                    created_at, updated_at";

            return await connection.QueryFirstAsync<CustomerBusinessTerms>(sql, customerBusinessTerms);
        }

        public async Task<CustomerBusinessTerms> UpdateAsync(CustomerBusinessTerms customerBusinessTerms)
        {
            using var connection = _context.GetConnection();
            var sql = @"
                UPDATE customer_business_terms SET
                    destination_code = @DestinationCode,
                    transport_mode_code = @TransportModeCode,
                    transporter_code = @TransporterCode,
                    lead_days = @LeadDays,
                    customer_distance = @CustomerDistance,
                    freight_indicator = @FreightIndicator,
                    supply_stock_location = @SupplyStockLocation,
                    allow_consignment_on_booking = @AllowConsignmentOnBooking,
                    customer_account_code = @CustomerAccountCode,
                    credit_limit = @CreditLimit,
                    minimum_invoice_amount = @MinimumInvoiceAmount,
                    customer_scheme_code = @CustomerSchemeCode,
                    customer_broker_code = @CustomerBrokerCode,
                    customer_broker_rate = @CustomerBrokerRate,
                    cash_discount_percentage = @CashDiscountPercentage,
                    misc_charge_percentage = @MiscChargePercentage,
                    misc_discount_percentage = @MiscDiscountPercentage,
                    payment_term_code = @PaymentTermCode,
                    credit_period_days = @CreditPeriodDays,
                    new_party_credit_period_days = @NewPartyCreditPeriodDays,
                    is_overdue_check = @IsOverdueCheck,
                    number_of_bills = @NumberOfBills,
                    outstanding_bill_period_days = @OutstandingBillPeriodDays,
                    outstanding_bill_account_indicator = @OutstandingBillAccountIndicator,
                    updated_at = @UpdatedAt
                WHERE id = @Id
                RETURNING 
                    id, customer_id, destination_code, transport_mode_code, transporter_code,
                    lead_days, customer_distance, freight_indicator, supply_stock_location,
                    allow_consignment_on_booking, customer_account_code, credit_limit,
                    minimum_invoice_amount, customer_scheme_code, customer_broker_code,
                    customer_broker_rate, cash_discount_percentage, misc_charge_percentage,
                    misc_discount_percentage, payment_term_code, credit_period_days,
                    new_party_credit_period_days, is_overdue_check, number_of_bills,
                    outstanding_bill_period_days, outstanding_bill_account_indicator,
                    created_at, updated_at";

            return await connection.QueryFirstAsync<CustomerBusinessTerms>(sql, customerBusinessTerms);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            using var connection = _context.GetConnection();
            var sql = "DELETE FROM customer_business_terms WHERE id = @Id";
            var rowsAffected = await connection.ExecuteAsync(sql, new { Id = id });
            return rowsAffected > 0;
        }

        public async Task<bool> ExistsAsync(int id)
        {
            using var connection = _context.GetConnection();
            var sql = "SELECT COUNT(*) FROM customer_business_terms WHERE id = @Id";
            var count = await connection.ExecuteScalarAsync<int>(sql, new { Id = id });
            return count > 0;
        }
    }
} 