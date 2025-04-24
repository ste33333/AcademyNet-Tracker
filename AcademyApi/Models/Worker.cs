using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace AcademyApi.Models;

public partial class Worker
{
    [Key] 
    [Column(TypeName = "nchar(4)")] 
    [Required]
    public string Enrollement { get; set; } 

    [Required]
    [MaxLength(35)]
    public string FullName { get; set; }

    [Required]
    [MaxLength(50)]
    public string Role { get; set; }

    [Required]
    [MaxLength(50)]
    public string Department { get; set; }

    public short? Age { get; set; } 

    [MaxLength(50)]
    public string? Address { get; set; } 

    [MaxLength(50)]
    public string? City { get; set; }

    [MaxLength(50)]
    public string? Province { get; set; }

    [Column(TypeName = "nchar(5)")]
    public string? CAP { get; set; }

    [MaxLength(50)]
    public string? Phone { get; set; }

    // Proprietà di navigazione per la relazione 1 a molti
    public virtual ICollection<WeekWork>? WeekWorks { get; set; }

}
