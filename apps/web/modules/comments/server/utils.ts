export const getCommentPermissions = ({
  commentUserId,
  contentOwnerId,
  currentUserId,
}: {
  commentUserId: string;
  contentOwnerId: string;
  currentUserId: string | undefined;
}): string[] => {
  const permissions: string[] = [];

  if (!currentUserId) return permissions;

  if (currentUserId === commentUserId) {
    // Pembuat komentar
    permissions.push("CAN_EDIT", "CAN_DELETE");
  } else if (currentUserId === contentOwnerId) {
    // Pemilik konten
    permissions.push("CAN_DELETE", "CAN_REPORT");
  } else {
    // User lain
    permissions.push("CAN_REPORT");
  }

  return permissions;
};

export const hasPermission = (permissions: string[], action: string) => {
  if (!permissions || permissions.length === 0) return false;
  return permissions.includes(action);
};
