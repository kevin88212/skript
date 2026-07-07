export async function requestNotificationPermission() {
  if (!('Notification' in window)) return false;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

export function isNotificationsGranted() {
  return typeof Notification !== 'undefined' && Notification.permission === 'granted';
}

export function scheduleChallengeReminder(hourStr = '18:00') {
  if (!isNotificationsGranted()) return;
  localStorage.setItem('notification_reminder_time', hourStr);
  // Show immediate confirmation
  new Notification('Mut 🔥', {
    body: `Erinnerung gesetzt für ${hourStr} Uhr täglich.`,
    icon: '/skript/icons/icon-192.png',
  });
}

export function triggerMotivationNotification() {
  if (!isNotificationsGranted()) return;
  const msgs = [
    'Zeit für deine Mut-Challenge heute! 🔥',
    'Du bist einen Schritt entfernt von Level Up! ⚡',
    'Dein Streak wartet auf dich! 💪',
    'Ein kleiner Schritt aus der Komfortzone reicht schon! 🚀',
  ];
  const msg = msgs[Math.floor(Math.random() * msgs.length)];
  new Notification('Mut', { body: msg, icon: '/skript/icons/icon-192.png' });
}
