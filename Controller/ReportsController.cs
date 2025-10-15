using Microsoft.AspNetCore.Mvc;
using ProjectApi.Models;
using ProjectApi.Services;

namespace ProjectApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReportsController : ControllerBase
    {
        private readonly ItemService _itemService;
        private readonly ContactService _contactService;

        public ReportsController(ItemService itemService, ContactService contactService)
        {
            _itemService = itemService;
            _contactService = contactService;
        }

        [HttpGet("daily")]
        public IActionResult DailyReport()
        {
            var itemsAdded = _itemService.GetItemsAddedToday();
            var contactsAdded = _contactService.GetContactsAddedToday();
            return Ok(new { itemsAdded, contactsAdded });
        }

        [HttpGet("monthly")]
        public IActionResult MonthlyReport()
        {
            var itemsAdded = _itemService.GetItemsAddedThisMonth();
            var contactsAdded = _contactService.GetContactsAddedThisMonth();
            return Ok(new { itemsAdded, contactsAdded });
        }

        [HttpGet("annual")]
        public IActionResult AnnualReport()
        {
            var itemsAdded = _itemService.GetItemsAddedThisYear();
            var contactsAdded = _contactService.GetContactsAddedThisYear();
            return Ok(new { itemsAdded, contactsAdded });
        }
    }
}
