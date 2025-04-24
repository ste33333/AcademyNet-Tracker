using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AcademyApi.Data;
using AcademyApi.Models;
using AcademyApi.Dtos;
using System.Threading.Tasks;

namespace AcademyApi.Controllers
{
    [Route("api/[controller]")] 
    [ApiController]
    public class WeekWorksController : ControllerBase 
    {
        private readonly AcademyNet7Context _context;

        public WeekWorksController(AcademyNet7Context context) 
        {
            _context = context;
        }
        // --- METODO GET ALL WEEKWORKS---
        [HttpGet]
        public async Task<ActionResult<IEnumerable<WeekWorkWithWorkerDto>>> GetWeekWorks()
        {
            var weekWorks = await _context.WeekWorks
               .Include(ww => ww.Worker) 
               .OrderByDescending(ww => ww.WorkDate).ThenBy(ww => ww.Worker!.FullName) 
               .Select(ww => new WeekWorkWithWorkerDto 
               {
                   Id = ww.Id,
                   WorkDate = ww.WorkDate,
                   Activity = ww.Activity,
                   WorkerEnrollement = ww.WorkerEnrollement, 
                   WorkerFullName = ww.Worker != null ? ww.Worker.FullName : "N/A"
               })
               .ToListAsync();
            return Ok(weekWorks);
        }

        // GET: api/weekworks/{id} 
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<WeekWorkDto>> GetWeekWorkById(int id) 
        {
            var weekWork = await _context.WeekWorks
                .Where(ww => ww.Id == id)
                .Select(ww => new WeekWorkDto
                {
                    Id = ww.Id,
                    WorkDate = ww.WorkDate,
                    Activity = ww.Activity
                })
                .FirstOrDefaultAsync();

            if (weekWork == null)
            {
                return NotFound();
            }
            return Ok(weekWork);
        }


        // PUT: api/weekworks/{id} 
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> PutWeekWork(int id, UpdateWeekWorkDto updateWeekWorkDto)
        {
            var weekWork = await _context.WeekWorks.FindAsync(id);

            if (weekWork == null)
            {
                return NotFound(new { message = $"WeekWork with Id {id} not found." });
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
                if (!await _context.WeekWorks.AnyAsync(e => e.Id == id)) { return NotFound(); } else { throw; }
            }

            return NoContent();
        }


        // DELETE: api/weekworks/{id} <- La rotta completa non cambia qui
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteWeekWork(int id)
        {
            var weekWork = await _context.WeekWorks.FindAsync(id);
            if (weekWork == null)
            {
                return NotFound(new { message = $"WeekWork with Id {id} not found." });
            }

            _context.WeekWorks.Remove(weekWork);
            await _context.SaveChangesAsync();

            return NoContent();
        }

    }
}