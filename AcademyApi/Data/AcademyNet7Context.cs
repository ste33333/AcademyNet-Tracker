using System;
using System.Collections.Generic;
using AcademyApi.Models;
using Microsoft.EntityFrameworkCore;

namespace AcademyApi.Data;

public partial class AcademyNet7Context : DbContext
{
    public AcademyNet7Context()
    {
    }

    public AcademyNet7Context(DbContextOptions<AcademyNet7Context> options)
        : base(options)
    {
    }

    public virtual DbSet<Employee> Employees { get; set; }

    public virtual DbSet<ViewWorkerHistory> ViewWorkerHistories { get; set; }

    public virtual DbSet<WeekWork> WeekWorks { get; set; }

    public virtual DbSet<Worker> Workers { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    { 
        // (configurazione di Employee, ViewWorkerHistory, WeekWork, Worker)
        modelBuilder.Entity<Employee>(entity =>
        {
            entity.HasKey(e => e.Enrollment);

            entity.Property(e => e.Enrollment).HasMaxLength(50);
            entity.Property(e => e.Address).HasMaxLength(50);
            entity.Property(e => e.City).HasMaxLength(50);
            entity.Property(e => e.Department).HasMaxLength(50);
            entity.Property(e => e.FullName).HasMaxLength(50);
            entity.Property(e => e.Province).HasMaxLength(50);
            entity.Property(e => e.Role).HasMaxLength(50);
        });

        modelBuilder.Entity<ViewWorkerHistory>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("viewWorkerHistory");

            entity.Property(e => e.Activity).HasMaxLength(50);
            entity.Property(e => e.Department).HasMaxLength(50);
            entity.Property(e => e.Enrollement)
                .HasMaxLength(4)
                .IsFixedLength();
            entity.Property(e => e.FullName).HasMaxLength(35);
            entity.Property(e => e.Role).HasMaxLength(50);
        });

        modelBuilder.Entity<WeekWork>(entity =>
        {
            entity
                //.HasNoKey() ID E' PK!!
                .ToTable("WeekWork");
            entity.HasKey(e => e.Id); // <<< AGGIUNGI QUESTO SE Id è PK
            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            entity.Property(e => e.Activity).HasMaxLength(50);
            entity.Property(e => e.WorkerEnrollement)
                .HasMaxLength(4)
                .IsFixedLength()
                .HasColumnName("EnrollmentFather");
            //entity.Property(e => e.Id).ValueGeneratedOnAdd();

            entity.HasOne(d => d.Worker).WithMany(p => p.WeekWorks) 
            //la WeekWork ha un worker.. relazione.. poi ho definito virtual class in weekworks 
                .HasForeignKey(d => d.WorkerEnrollement)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_WeekWork_Worker");
        });

        modelBuilder.Entity<Worker>(entity =>
        {
            entity.HasKey(e => e.Enrollement);

            entity.ToTable("Worker");

            entity.Property(e => e.Enrollement)
                .HasMaxLength(4)
                .IsFixedLength();
            entity.Property(e => e.Address).HasMaxLength(50);
            entity.Property(e => e.CAP)
                .HasMaxLength(5)
                .IsFixedLength()
                .HasColumnName("CAP");
            entity.Property(e => e.City).HasMaxLength(50);
            entity.Property(e => e.Department).HasMaxLength(50);
            entity.Property(e => e.FullName).HasMaxLength(35);
            entity.Property(e => e.Phone).HasMaxLength(50);
            entity.Property(e => e.Province).HasMaxLength(50);
            entity.Property(e => e.Role).HasMaxLength(50);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
