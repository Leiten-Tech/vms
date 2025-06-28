using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using VisitorManagementMySQL.ContextHelper;

namespace VisitorManagementMySQL.Services.Master.FileUploadService
{
    public class FileUploadService
    {
        private readonly DbContextHelper dbContext;
        private IWebHostEnvironment _webHostEnvironment;
        private readonly IConfiguration _Configuration;
        public FileUploadService(DbContextHelper DbContextHelper, IWebHostEnvironment webHostEnvironment, IConfiguration Configuration)
        {
            this.dbContext = DbContextHelper;
            _webHostEnvironment = webHostEnvironment; // has ContentRootPath property
            _Configuration = Configuration;
        }
        public async Task UploadFile(IFormFile file, string folder)
        {
            IConfigurationSection section = _Configuration.GetSection("paths");
            string str = section.Value;
            var webRootPath = _webHostEnvironment.ContentRootPath + str + "\\" + folder;
            if (!Directory.Exists(webRootPath))
                Directory.CreateDirectory(webRootPath);
            var formFile = file;
            {
                if (formFile.Length > 0)
                {
                    var filePath = Path.Combine(webRootPath, formFile.FileName);
                    using (var stream = System.IO.File.Create(filePath))
                    {
                        await formFile.CopyToAsync(stream);
                    }
                }
            }
        }


        public async Task UploadFiles(List<IFormFile> files, string folder)
        {
            IConfigurationSection section = _Configuration.GetSection("paths");
            string str = section.Value;
            var webRootPath = _webHostEnvironment.ContentRootPath + str + "\\" + folder;

            if (!Directory.Exists(webRootPath))
                Directory.CreateDirectory(webRootPath);

            //var formFile = file;
            foreach (var formFile in files)
            {
                if (formFile.Length > 0)
                {

                    var filePath = Path.Combine(webRootPath, formFile.FileName);

                    using (var stream = System.IO.File.Create(filePath))
                    {
                        await formFile.CopyToAsync(stream);
                    }
                }
            }
        }

        public bool IsFileExists(string fileName, string folderName)
        {
            IConfigurationSection section = _Configuration.GetSection("paths");
            string str = section.Value;
            var webRootPath = _webHostEnvironment.ContentRootPath + str + "\\" + folderName + "\\" + fileName;
            return File.Exists(webRootPath);
        }
    }
}
