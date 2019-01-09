import { NotificationManager } from 'react-notifications';

export const notify = (type, msg, title, timeout, callback) => {


    switch (type) {
        case 'info':
            NotificationManager.info(msg, title || 'Info', timeout || 3000, callback || null);
            break;
        case 'success':
            NotificationManager.success(msg, title || 'Sucess!', timeout || 3000, callback || null);
            break;
        case 'warning':
            NotificationManager.warning(msg, title || "Warning!", timeout || 3000, callback || null);
            break;
        case 'error':
            NotificationManager.error(msg, title || "Error!", timeout || 3000, callback || null
            );
            break;
        default: break;
    }

}