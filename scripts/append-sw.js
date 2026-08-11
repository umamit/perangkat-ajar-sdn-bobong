const fs = require('fs');
const path = require('path');

const swPath = path.join(__dirname, '..', 'public', 'sw.js');

const pushCode = `
// Web Push Notifications Listener
self.addEventListener('push', function(event) {
  if (event.data) {
    try {
      const data = JSON.parse(event.data.text());
      const options = {
        body: data.body,
        icon: data.icon || '/assets/logo-sdn-bobong.png',
        badge: '/assets/logo-sdn-bobong.png',
        vibrate: [100, 50, 100],
        data: {
          dateOfArrival: Date.now(),
          primaryKey: '1'
        }
      };
      event.waitUntil(
        self.registration.showNotification(data.title, options)
      );
    } catch (err) {
      console.error('Error showing push notification:', err);
    }
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});
`;

if (fs.existsSync(swPath)) {
  let content = fs.readFileSync(swPath, 'utf8');
  if (!content.includes('Web Push Notifications Listener')) {
    content += pushCode;
    fs.writeFileSync(swPath, content, 'utf8');
    console.log('Successfully appended custom Web Push listener to sw.js');
  } else {
    console.log('Web Push listener already exists in sw.js');
  }
} else {
  console.warn('sw.js not found in public directory. Skipping sw.js append.');
}
