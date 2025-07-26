using Microsoft.EntityFrameworkCore;
using Xcianify.Core.Domain.Models;

namespace Xcianify.Infrastructure.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<ItemMaster> ItemMasters { get; set; }
        public DbSet<ItemSpecification> ItemSpecifications { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure ItemMaster entity
            modelBuilder.Entity<ItemMaster>(entity =>
            {
                entity.ToTable("item_master");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.ItemCode).IsRequired().HasMaxLength(50);
                entity.HasIndex(e => e.ItemCode).IsUnique();
                
                // Configure one-to-one relationship with ItemSpecification
                entity.HasOne(e => e.Specification)
                    .WithOne(s => s.ItemMaster)
                    .HasForeignKey<ItemSpecification>(s => s.ItemCode)
                    .HasPrincipalKey<ItemMaster>(i => i.ItemCode)
                    .OnDelete(DeleteBehavior.Cascade);

                // Configure foreign key to item_type
                entity.HasOne<ItemType>()
                    .WithMany()
                    .HasForeignKey(e => e.ItemTypeId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Configure ItemSpecification entity
            modelBuilder.Entity<ItemSpecification>(entity =>
            {
                entity.ToTable("item_specifications");
                entity.HasKey(e => e.Id);
                
                // Configure foreign key to item_master
                entity.HasOne(e => e.ItemMaster)
                    .WithOne(i => i.Specification)
                    .HasForeignKey<ItemSpecification>(e => e.ItemCode)
                    .HasPrincipalKey<ItemMaster>(i => i.ItemCode)
                    .OnDelete(DeleteBehavior.Cascade);

                // Configure self-referential relationship for substitute items
                entity.HasOne<ItemMaster>()
                    .WithMany()
                    .HasForeignKey(e => e.SubstituteForItemCode)
                    .HasPrincipalKey<ItemMaster>(i => i.ItemCode)
                    .OnDelete(DeleteBehavior.SetNull);
            });
        }
    }
}
