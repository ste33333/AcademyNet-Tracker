using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace AcademyApi.Models;

[Table("WeekWork")] 
public class WeekWork
{
    [Key] 
    public int Id { get; set; }

    [Required]
    [Column("EnrollmentFather", TypeName = "nchar(4)")]
    public string WorkerEnrollement { get; set; } // FK

    [Required]
    public DateTime WorkDate { get; set; } 

    [MaxLength(50)]
    public string? Activity { get; set; }

    // Proprietà di navigazione per la relazione molti-1
    [ForeignKey("WorkerEnrollement")]
    public virtual Worker? Worker { get; set; }
}