using FirebaseAdmin;
using FirebaseAdmin.Messaging;
using Google.Apis.Auth.OAuth2;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using VisitorManagementMySQL.Entities;
using FirebaseNotification = FirebaseAdmin.Messaging.Notification;
using FirebaseMessage = FirebaseAdmin.Messaging.Message;
using Newtonsoft.Json.Linq;
using VisitorManagementMySQL.DTOs;

namespace VisitorManagementMySQL.Services.FirebaseService
{
    public class FirebaseService : IFirebaseService
    {
        private static FirebaseApp? _firebaseApp;

        public FirebaseService()
        {
            // Absolute path to your JSON file
            // string path = @"D:\TFS\VisitorManagement\VisitorManagement\General\Android\Dev-branch\VisitorManagementService\Services\serviceAccountKey.json";
            string path = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Services", "serviceAccountKey.json");

            if (_firebaseApp == null)
            {
                _firebaseApp = FirebaseApp.Create(new AppOptions()
                {
                    Credential = GoogleCredential.FromFile(path)
                });
            }
        }

    public async Task SendPushNotificationAsync(FirebaseNotificationDto notification)
{
    var message = new FirebaseMessage()
    {
        Token = notification.Token,
        Data = new Dictionary<string, string>()
        {
            { "title", notification.Title },
            { "message", notification.Body },
             { "navigate_to", "MyNotification" },
            { "ImageUrl ",notification.Image }
        }
        // Do NOT use Notification = new FirebaseNotification {} when sending data-only
    };

    try
    {
        string response = await FirebaseMessaging.DefaultInstance.SendAsync(message);
        Console.WriteLine("Successfully sent message: " + response);
    }
    catch (Exception ex)
    {
        Console.WriteLine("Error sending message: " + ex.Message);
    }
}

    }
}
