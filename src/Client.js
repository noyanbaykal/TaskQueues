const LOCAL_STORAGE_KEY_QUEUES = 'queues';

class Client {
  setQueues(queues) {
    localStorage.setItem(LOCAL_STORAGE_KEY_QUEUES, JSON.stringify(queues));
  };

  getQueues() {
    const savedQueues = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_QUEUES)) || [];
    return new Promise((resolve, _) => resolve(savedQueues));
  };

  removeQueues() {
    localStorage.removeItem(LOCAL_STORAGE_KEY_QUEUES);
  };
}

export const client = new Client();
