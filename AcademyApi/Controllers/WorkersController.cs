using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AcademyApi.Data; 
using AcademyApi.Models; 
using AcademyApi.Dtos; 
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq; 

namespace AcademyApi.Controllers
{
    [Route("api/[controller]")] 
    [ApiController]
    public class WorkersController : ControllerBase
    {
        private readonly AcademyNet7Context _context;

        public WorkersController(AcademyNet7Context context)
        {
            _context = context;
        }

        // GET: api/workers
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<WorkerDto>>> GetWorkers()
        {
            return await _context.Workers 
                .Select(w => new WorkerDto 
                {
                    Enrollment = w.Enrollement, 
                    FullName = w.FullName,
                    Role = w.Role,
                    Department = w.Department
                })
                .ToListAsync();
        }

        // GET: api/workers/{enrollment}
        [HttpGet("{enrollment}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<WorkerDetailDto>> GetWorkerDetail(string enrollment)
        {
            var worker = await _context.Workers
                .Include(w => w.WeekWorks) 
                .Where(w => w.Enrollement == enrollment) 
                .Select(w => new WorkerDetailDto 
                {
                    Enrollment = w.Enrollement, 
                    FullName = w.FullName,
                    Role = w.Role,
                    Department = w.Department,
                    Age = w.Age,
                    Address = w.Address,
                    City = w.City,
                    Province = w.Province,
                    CAP = w.CAP, 
                    Phone = w.Phone,
                    WeekWorks = w.WeekWorks == null ? new List<WeekWorkDto>() : w.WeekWorks.Select(ww => new WeekWorkDto
                    {
                        Id = ww.Id,
                        WorkDate = ww.WorkDate,
                        Activity = ww.Activity
                    }).ToList()
                })
                .FirstOrDefaultAsync();

            if (worker == null)
            {
                return NotFound(); 
            }

            return worker; 
        }

        // POST: api/workers
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        public async Task<ActionResult<WorkerDetailDto>> PostWorker(CreateWorkerDto createWorkerDto)
        {
            if (await _context.Workers.AnyAsync(w => w.Enrollement == createWorkerDto.Enrollment))
            {
                return Conflict(new { message = $"Enrollment '{createWorkerDto.Enrollment}' already exists." }); 
            }

            var worker = new Worker 
            {
                Enrollement = createWorkerDto.Enrollment, 
                FullName = createWorkerDto.FullName,
                Role = createWorkerDto.Role,
                Department = createWorkerDto.Department,
                Age = createWorkerDto.Age,
                Address = createWorkerDto.Address,
                City = createWorkerDto.City,
                Province = createWorkerDto.Province,
                CAP = createWorkerDto.CAP, 
                Phone = createWorkerDto.Phone,
                WeekWorks = null 
            };

            _context.Workers.Add(worker);
            await _context.SaveChangesAsync();

            var workerDetailDto = new WorkerDetailDto
            {
                Enrollment = worker.Enrollement, 
                FullName = worker.FullName,
                Role = worker.Role,
                Department = worker.Department,
                Age = worker.Age,
                Address = worker.Address,
                City = worker.City,
                Province = worker.Province,
                CAP = worker.CAP,
                Phone = worker.Phone,
                WeekWorks = new List<WeekWorkDto>() 
            };


            return CreatedAtAction(nameof(GetWorkerDetail), new { enrollment = worker.Enrollement }, workerDetailDto);
        }


        // PUT: api/workers/{enrollment}
        [HttpPut("{enrollment}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> PutWorker(string enrollment, UpdateWorkerDto updateWorkerDto)
        {
            var worker = await _context.Workers.FindAsync(enrollment);

            if (worker == null)
            {
                return NotFound(); 
            }

            worker.FullName = updateWorkerDto.FullName;
            worker.Role = updateWorkerDto.Role;
            worker.Department = updateWorkerDto.Department;
            worker.Age = updateWorkerDto.Age;
            worker.Address = updateWorkerDto.Address;
            worker.City = updateWorkerDto.City;
            worker.Province = updateWorkerDto.Province;
            worker.CAP = updateWorkerDto.CAP; 
            worker.Phone = updateWorkerDto.Phone;

            _context.Entry(worker).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await WorkerExists(enrollment)) 
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent(); 
        }

        // DELETE: api/workers/{enrollment}
        [HttpDelete("{enrollment}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteWorker(string enrollment)
        {
            var worker = await _context.Workers
                                    .Include(w => w.WeekWorks) 
                                    .FirstOrDefaultAsync(w => w.Enrollement == enrollment); 

            if (worker == null)
            {
                return NotFound(); 
            }

            if (worker.WeekWorks != null && worker.WeekWorks.Any())
            {
                _context.WeekWorks.RemoveRange(worker.WeekWorks);
            }

            _context.Workers.Remove(worker);
            await _context.SaveChangesAsync();

            return NoContent(); 
        }


        // GET: api/workers/{enrollment}/weekwork
        [HttpGet("{enrollment}/weekwork")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<IEnumerable<WeekWorkDto>>> GetWeekWorksForWorker(string enrollment)
        {
            if (!await WorkerExists(enrollment)) 
            {
                return NotFound(new { message = $"Worker with Enrollment '{enrollment}' not found." });
            }

            // Filtra WeekWork usando la FK, assumendo si chiami 'WorkerEnrollement' nel modello WeekWork.cs
            return await _context.WeekWorks
                .Where(ww => ww.WorkerEnrollement == enrollment) 
                .Select(ww => new WeekWorkDto 
                {
                    Id = ww.Id,
                    WorkDate = ww.WorkDate,
                    Activity = ww.Activity
                })
                .ToListAsync();
        }

        // GET: api/workers/{enrollment}/weekwork/{weekWorkId}
        // Ritorna una specifica WeekWork per un worker specifico
        [HttpGet("{enrollment}/weekwork/{weekWorkId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<WeekWorkDto>> GetWeekWork(string enrollment, int weekWorkId)
        {
            // Filtra per FK ('WorkerEnrollement') e PK ('Id')
            var weekWork = await _context.WeekWorks
               .Where(ww => ww.WorkerEnrollement == enrollment && ww.Id == weekWorkId) 
               .Select(ww => new WeekWorkDto 
               {
                   Id = ww.Id,
                   WorkDate = ww.WorkDate,
                   Activity = ww.Activity
               })
               .FirstOrDefaultAsync();

            if (weekWork == null)
            {
                return NotFound(new { message = $"WeekWork with Id '{weekWorkId}' not found for Worker '{enrollment}'." });
            }
            return weekWork;
        }


        // POST: api/workers/{enrollment}/weekwork
        [HttpPost("{enrollment}/weekwork")] // <-- VERIFICA QUESTO ATTRIBUTO ESATTO
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<WeekWorkDto>> PostWeekWork(string enrollment, [FromBody] CreateWeekWorkDto createWeekWorkDto) // <-- VERIFICA PARAMETRI
        {
            // Verifica se il worker esiste (usa la proprietà corretta 'Enrollement')
            if (!await _context.Workers.AnyAsync(w => w.Enrollement == enrollment))
            {
                return NotFound(new { message = $"Worker with Enrollment '{enrollment}' not found." });
            }

            // Mappa da DTO a Entity
            var weekWork = new WeekWork
            {
                WorkerEnrollement = enrollment, // Usa prop. C# corretta
                WorkDate = createWeekWorkDto.WorkDate,
                Activity = createWeekWorkDto.Activity
            };

            _context.WeekWorks.Add(weekWork);
            await _context.SaveChangesAsync();

            var weekWorkDto = new WeekWorkDto
            {
                Id = weekWork.Id,
                WorkDate = weekWork.WorkDate,
                Activity = weekWork.Activity
            };

            return CreatedAtAction(nameof(WeekWorksController.GetWeekWorkById), "WeekWorks", new { id = weekWork.Id }, weekWorkDto);
        }
        

        // PUT: api/workers/{enrollment}/weekwork/{weekWorkId}
        [HttpPut("{enrollment}/weekwork/{weekWorkId}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> PutWeekWork(string enrollment, int weekWorkId, UpdateWeekWorkDto updateWeekWorkDto)
        {
            var weekWork = await _context.WeekWorks
               .FirstOrDefaultAsync(ww => ww.WorkerEnrollement == enrollment && ww.Id == weekWorkId); 

            if (weekWork == null)
            {
                return NotFound(new { message = $"WeekWork with Id '{weekWorkId}' not found for Worker '{enrollment}'." }); 
            }

            weekWork.WorkDate = updateWeekWorkDto.WorkDate;
            weekWork.Activity = updateWeekWorkDto.Activity;

            _context.Entry(weekWork).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await WeekWorkExists(enrollment, weekWorkId)) 
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent(); 
        }

        // DELETE: api/workers/{enrollment}/weekwork/{weekWorkId}
        [HttpDelete("{enrollment}/weekwork/{weekWorkId}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteWeekWork(string enrollment, int weekWorkId)
        {
            var weekWork = await _context.WeekWorks
               .FirstOrDefaultAsync(ww => ww.WorkerEnrollement == enrollment && ww.Id == weekWorkId); 

            if (weekWork == null)
            {
                return NotFound(new { message = $"WeekWork with Id '{weekWorkId}' not found for Worker '{enrollment}'." }); 
            }

            _context.WeekWorks.Remove(weekWork);
            await _context.SaveChangesAsync();

            return NoContent(); 
        }


        // --- Metodi Helper Privati ---

        private async Task<bool> WorkerExists(string enrollment)
        {
            return await _context.Workers.AnyAsync(e => e.Enrollement == enrollment); 
        }

        private async Task<bool> WeekWorkExists(string enrollment, int weekWorkId)
        { 
            return await _context.WeekWorks.AnyAsync(e => e.Id == weekWorkId && e.WorkerEnrollement == enrollment); 
        }
    }
}