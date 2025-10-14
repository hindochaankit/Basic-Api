using Microsoft.AspNetCore.Mvc;
using ProjectApi.Models;
using ProjectApi.Services;
using System;

namespace ProjectApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContactsController : ControllerBase
    {
        private readonly ContactService _contactService;

        public ContactsController(ContactService contactService) => _contactService = contactService;

        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                return Ok(_contactService.Get());
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpPost]
public IActionResult Post(Contact contact)
{
    try
    {
        var created = _contactService.Create(contact);
        return Ok(created);
    }
    catch (Exception ex)
    {
        return BadRequest(new { error = ex.Message });
    }
}


        [HttpPut("{id}")]
        public IActionResult Put(string id, Contact updatedContact)
        {
            try
            {
                var contact = _contactService.Update(id, updatedContact);
                if (contact == null) return NotFound("Contact not found");
                return Ok(contact);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(string id)
        {
            try
            {
                _contactService.Delete(id);
                return Ok(new { message = "Contact deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }
}
