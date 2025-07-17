using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Linq;
using VisitorManagementMySQL.ContextHelper;
using VisitorManagementMySQL.Services.Common;
using Microsoft.Extensions.DependencyInjection;

namespace VisitorManagementMySQL.Services.Notification
{
    public class NotificationCheckService : IHostedService, IDisposable
    {
        // private readonly ICommonService CommonService;
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<NotificationCheckService> _logger;
        private Timer _timer;

        public NotificationCheckService(
            ILogger<NotificationCheckService> logger,
            IServiceProvider serviceProvider
        )
        {
            _logger = logger;
            _serviceProvider = serviceProvider;
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("Notification Check Service started.");

            _timer = new Timer(
                RunCheckForUnsentNotifications,
                null,
                TimeSpan.Zero,
                TimeSpan.FromMinutes(10)
            );

            return Task.CompletedTask;
        }

        private void RunCheckForUnsentNotifications(object state)
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                var commonService = scope.ServiceProvider.GetRequiredService<ICommonService>();
                try
                {
                    commonService
                        .CheckForUnsentNotifications(null)
                        .ConfigureAwait(false)
                        .GetAwaiter()
                        .GetResult();
                }
                catch (Exception ex)
                {
                    _logger.LogError(
                        ex,
                        "An error occurred while checking for unsent notifications."
                    );
                }
            }
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            _timer?.Change(Timeout.Infinite, 0);
            _logger.LogInformation("Notification Check Service stopped.");
            return Task.CompletedTask;
        }

        public void Dispose()
        {
            _timer?.Dispose();
        }
    }
}
