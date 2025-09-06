import messaging from '@react-native-firebase/messaging';
import notifee, { EventType } from '@notifee/react-native';

// Tạo channel trước
async function createDefaultChannel() {
  await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    importance: 4,
  });
}
createDefaultChannel();

// Background messages với modular API
export const firebaseBackgroundHandler = async (remoteMessage) => {
  console.log('Message handled in the background!', remoteMessage);

  await notifee.displayNotification({
    title: remoteMessage.notification?.title || 'Thông báo mới',
    body: remoteMessage.notification?.body || '',
    android: {
      channelId: 'default',
      smallIcon: 'ic_stat',
    },
  });
};

// Đây là cú pháp mới cho RN Firebase >= v22
messaging().setBackgroundMessageHandler(firebaseBackgroundHandler);


// Background events Notifee
notifee.onBackgroundEvent(async ({ type, detail }) => {
      if (!type || !detail) return; // tránh lỗi undefined

  const { notification, pressAction } = detail;

  if (type === EventType.DELIVERED) {
    console.log('Notification delivered in background:', notification);
  }

  if (type === EventType.PRESS) {
    console.log('User pressed notification:', notification);
    // Bạn có thể điều hướng hoặc xử lý deep link ở đây
  }
});