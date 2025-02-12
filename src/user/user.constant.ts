export const userRoles = [
  'admin',
  'author',
  'organizer',
  'director',
  'viewer',
] as const;

export const userStatus = ['active', 'inactive', 'banned'] as const;

export type TUserRole = (typeof userRoles)[number];
export type TUserStatus = (typeof userStatus)[number];
