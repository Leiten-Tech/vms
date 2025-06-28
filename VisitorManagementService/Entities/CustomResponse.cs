using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Entities
{
    public class CustomResponse
    {
        public CustomResponse()
        {
            IsSuccess = false;
            StatusCode = StatusCodes.Status200OK;
        }
        public CustomResponse(bool _isSuccess,object _data,string _title,string _message)
        {
            IsSuccess = _isSuccess;
            Data = _data;
            Title = _title;
            Message = _message;
        }
        public bool IsSuccess { get; set; }
        public object Data { get; set; }
        public string Title { get; set; }
        public string Message { get; set; }
        public int StatusCode { get; set; }
        public override string ToString()
        {
            return JsonSerializer.Serialize(this);
        }
        public void SetContent(bool _isSuccess, object _data, string _title, string _message)
        {
            IsSuccess = _isSuccess;
            Data = _data;
            Title = _title;
            Message = _message;
        }

    }
}
