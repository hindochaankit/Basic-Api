using Microsoft.AspNetCore.Mvc;
using ProjectApi.Models;
using ProjectApi.Services;
using System;

namespace ProjectApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ItemsController : ControllerBase
    {
        private readonly ItemService _itemService;

        public ItemsController(ItemService itemService) => _itemService = itemService;

        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                return Ok(_itemService.Get());
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpPost]
        public IActionResult Post(Item item)
        {
            try
            {
                _itemService.Create(item);
                return Ok(item);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public IActionResult Put(string id, Item updatedItem)
        {
            try
            {
                var item = _itemService.Update(id, updatedItem);
                if (item == null) return NotFound("Item not found");
                return Ok(item);
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
                _itemService.Delete(id);
                return Ok(new { message = "Item deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }
}