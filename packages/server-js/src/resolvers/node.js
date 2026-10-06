export const nodeInterfaceResolver = {
  __resolveType(obj) {
    if (obj.title) return 'Event';
    if (obj.name) return 'User';
    return null;
  }
};
