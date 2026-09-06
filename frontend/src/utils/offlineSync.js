// MemoMate Offline Queue & Connectivity Sync Manager

export const getOfflineQueue = () => {
  try {
    const queue = localStorage.getItem('memomate_offline_queue');
    return queue ? JSON.parse(queue) : [];
  } catch (e) {
    return [];
  }
};

export const saveOfflineSession = (sessionData) => {
  const queue = getOfflineQueue();
  const newEntry = {
    ...sessionData,
    queuedAt: new Date().toISOString(),
    id: 'offline_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4)
  };
  queue.push(newEntry);
  localStorage.setItem('memomate_offline_queue', JSON.stringify(queue));
  window.dispatchEvent(new Event('memomate_offline_queue_changed'));
  return newEntry;
};

export const clearOfflineQueue = () => {
  localStorage.removeItem('memomate_offline_queue');
  window.dispatchEvent(new Event('memomate_offline_queue_changed'));
};

export const syncOfflineData = async (syncCallback) => {
  const queue = getOfflineQueue();
  if (!queue || queue.length === 0) return { syncedCount: 0 };

  window.dispatchEvent(new CustomEvent('memomate_sync_status', { detail: 'SYNCING' }));

  let syncedCount = 0;
  for (const session of queue) {
    try {
      if (syncCallback) {
        await syncCallback(session);
      }
      syncedCount++;
    } catch (e) {
      console.warn("Failed to sync item", session, e);
    }
  }

  clearOfflineQueue();
  window.dispatchEvent(new CustomEvent('memomate_sync_status', { detail: 'ONLINE' }));
  return { syncedCount };
};
