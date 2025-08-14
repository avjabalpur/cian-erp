# Dosage Management Feature

This document describes the complete implementation of the Dosage management feature for the CIAN ERP system.

## Overview

The Dosage management feature allows administrators to create, read, update, and delete dosage forms used in pharmaceutical products. This feature is integrated into the administration section of the application.

## Features

- **CRUD Operations**: Full Create, Read, Update, Delete functionality for dosage records
- **Search & Filter**: Filter dosages by name and status
- **Sorting**: Sort by name, creation date, or status
- **Pagination**: Efficient data loading with configurable page sizes
- **Form Validation**: Client-side and server-side validation
- **Soft Delete**: Records are marked as deleted rather than physically removed
- **Audit Trail**: Track creation and modification details





## Database Schema

### Table: `dosage`

```sql
CREATE TABLE dosage (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  register_date VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER,
  updated_by INTEGER,
  is_deleted BOOLEAN DEFAULT FALSE
);
```

### Indexes

- `idx_dosage_name` - For efficient name-based searches
- `idx_dosage_is_active` - For filtering active/inactive records
- `idx_dosage_is_deleted` - For soft delete functionality

## Backend Implementation

### 1. Model (`api/Core/Model/Dosage.cs`)
- Entity class with proper attributes and validation
- Inherits from `BaseModel` for common fields

### 2. DTOs (`api/Core/DTOs/Dosage/`)
- `DosageDto.cs` - Response DTO
- `CreateDosageDto.cs` - Create request DTO with validation
- `UpdateDosageDto.cs` - Update request DTO
- `DosageFilterDto.cs` - Filter parameters DTO

### 3. Repository (`api/Core/Domain/Repositories/IDosageRepository.cs`)
- Interface defining data access contracts
- Implementation in `api/Repository/DosageRepository.cs` using Dapper

### 4. Service (`api/Core/Domain/Services/IDosageService.cs`)
- Business logic interface
- Implementation in `api/Services/DosageService.cs`

### 5. Controller (`api/Presentation/Controllers/DosageController.cs`)
- RESTful API endpoints
- Proper error handling and validation

### 6. Mapper (`api/Core/Mappers/DosageMapper.cs`)
- AutoMapper configuration for object mapping

## Frontend Implementation

### 1. Types (`ui/src/types/dosage.ts`)
- TypeScript interfaces for type safety

### 2. Hooks (`ui/src/hooks/use-dosages.ts`)
- React Query hooks for API communication
- Caching and state management

### 3. Validation (`ui/src/validations/dosage.ts`)
- Zod schemas for form validation

### 4. Components (`ui/src/components/dosages/`)
- `dosage-table.tsx` - Main table component with CRUD operations
- `dosage-filter.tsx` - Search and filter functionality
- `dosage-drawer.tsx` - Create/Edit form in a drawer

### 5. Page (`ui/src/app/(auth)/dosages/page.tsx`)
- Main dosage management page

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dosages` | Get paginated list with filters |
| GET | `/api/dosages/all` | Get all dosages (for dropdowns) |
| GET | `/api/dosages/{id}` | Get single dosage by ID |
| POST | `/api/dosages` | Create new dosage |
| PUT | `/api/dosages/{id}` | Update existing dosage |
| DELETE | `/api/dosages/{id}` | Soft delete dosage |

## Menu Integration

The dosage feature is accessible through:
- **Administration** → **Dosages**
- Available to users with `SUPER_ADMIN` or `ADMIN` roles

## Sample Data

The migration includes sample dosage forms:
- Tablet
- Capsule
- Syrup
- Injection
- Cream
- Ointment
- Gel
- Suspension
- Drops
- Powder

## Usage

### For Administrators

1. Navigate to **Administration** → **Dosages**
2. View existing dosage forms in the table
3. Use search and filters to find specific dosages
4. Click **Add Dosage** to create new records
5. Use the actions menu to edit or delete dosages

### For Developers

#### Adding New Dosage Types

1. Use the web interface to add new dosage forms
2. Or insert directly into the database:

```sql
INSERT INTO dosage (name, register_date, is_active) 
VALUES ('New Dosage Form', '2024-01-01', true);
```

#### Integration with Other Features

The dosage data can be referenced in:
- Item Master records
- Sales Orders
- Product specifications

## Security

- **Authentication**: Required for all endpoints
- **Authorization**: Limited to admin roles
- **Input Validation**: Both client and server-side validation
- **SQL Injection Protection**: Parameterized queries with Dapper

## Performance Considerations

- Database indexes for efficient queries
- Pagination to handle large datasets
- React Query caching for better UX
- Soft deletes to maintain data integrity

## Future Enhancements

Potential improvements:
- Bulk import/export functionality
- Dosage form categories
- Integration with regulatory databases
- Audit log for changes
- Multi-language support

## Troubleshooting

### Common Issues

1. **Permission Denied**: Ensure user has admin role
2. **Validation Errors**: Check required fields and format
3. **Database Connection**: Verify connection string
4. **Migration Issues**: Run the dosage migration script

### Debug Steps

1. Check browser console for frontend errors
2. Review API logs for backend errors
3. Verify database table exists and has correct schema
4. Test API endpoints directly with Postman or similar tool

## Dependencies

### Backend
- .NET 8
- Dapper (data access)
- AutoMapper (object mapping)
- FluentValidation (validation)

### Frontend
- Next.js 14
- React Query (data fetching)
- Zod (validation)
- Shadcn/ui (components)
- Lucide React (icons)

## Files Created/Modified

### New Files
- `api/Core/Model/Dosage.cs`
- `api/Core/DTOs/Dosage/*.cs`
- `api/Core/Domain/Repositories/IDosageRepository.cs`
- `api/Core/Domain/Services/IDosageService.cs`
- `api/Core/Mappers/DosageMapper.cs`
- `api/Repository/DosageRepository.cs`
- `api/Services/DosageService.cs`
- `api/Presentation/Controllers/DosageController.cs`
- `api/Migrations/20240709_Add_Dosage_Table.sql`
- `ui/src/types/dosage.ts`
- `ui/src/hooks/use-dosages.ts`
- `ui/src/validations/dosage.ts`
- `ui/src/components/dosages/*.tsx`
- `ui/src/app/(auth)/dosages/page.tsx`

### Modified Files
- `api/migration/table.up.sql`
- `api/Presentation/Program.cs`
- `ui/src/hooks/use-menu.ts` 