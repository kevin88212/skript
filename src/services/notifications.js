export async function requestNotificationPermission() {
  if (!('Notification' in window)) return false;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

export function isNotificationsGranted() {
  return typeof Notification !== 'undefined' && Notification.permission === 'granted';
}

export function scheduleWorkoutReminder(hourStr = '18:00') {
  if (!isNotificationsGranted()) return;
  localStorage.setItem('notification_reminder_time', hourStr);
  // Show immediate confirmation
  new Notification('FitQuest ⚔️', {
    body: `Erinnerung gesetzt für ${hourStr} Uhr täglich.`,
    icon: '/skript/icons/icon-192.png',
  });
}

export function triggerMotivationNotification() {
  if (!isNotificationsGranted()) return;
  const msgs = [
    'Zeit zu trainieren, Krieger! ⚔️',
    'Du bist einen Schritt entfernt von Level Up! 🔥',
    'Dein Streak wartet auf dich! 💪',
    'Andere ruhen – du wächst! 🏆',
  ];
  const msg = msgs[Math.floor(Math.random() * msgs.length)];
  new Notification('FitQuest', { body: msg, icon: '/skript/icons/icon-192.png' });
}
