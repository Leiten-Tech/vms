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
using VisitorManagementService.Services.VisitorReportScheduler.JobCheckinCheckoutService;


namespace VisitorManagementService.Services.VisitorReportScheduler
{
    public class VisitorReportHostedJob: IHostedService, IDisposable
{
    private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<VisitorReportHostedJob> _logger;
        private Timer _timer;

    public VisitorReportHostedJob(ILogger<VisitorReportHostedJob> logger,
            IServiceProvider serviceProvider)
    {
        _logger = logger;
            _serviceProvider = serviceProvider;
    }

    public Task StartAsync(CancellationToken cancellationToken)
        {
        _logger.LogInformation("Report Check Service started.");

            _timer = new Timer(
                RunCheckForReport,
                null,
                TimeSpan.Zero,
                TimeSpan.FromMinutes(2)
            );

            return Task.CompletedTask;
    }

    private void RunCheckForReport(object state)
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                var service = scope.ServiceProvider.GetRequiredService<IJobCheckinCheckoutService>();
                try
                {
                    service
                        .SearchInitialize(null)
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
