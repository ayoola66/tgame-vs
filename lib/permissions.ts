import { AdminRole } from '@prisma/client'

export const ADMIN_PERMISSIONS = {
  SUPER_ADMIN: [
    'users.read', 'users.write', 'users.delete',
    'admins.read', 'admins.write', 'admins.delete',
    'games.read', 'games.write', 'games.delete',
    'categories.read', 'categories.write', 'categories.delete',
    'questions.read', 'questions.write', 'questions.delete',
    'products.read', 'products.write', 'products.delete',
    'orders.read', 'orders.write', 'orders.delete',
    'music.read', 'music.write', 'music.delete',
    'coupons.read', 'coupons.write', 'coupons.delete',
    'analytics.read', 'system.read', 'system.write'
  ],
  DEV_ADMIN: [
    'games.read', 'games.write', 'games.delete',
    'categories.read', 'categories.write', 'categories.delete',
    'questions.read', 'questions.write', 'questions.delete',
    'admins.read', 'admins.write',
    'system.read', 'analytics.read'
  ],
  SHOP_ADMIN: [
    'products.read', 'products.write', 'products.delete',
    'orders.read', 'orders.write',
    'coupons.read', 'coupons.write', 'coupons.delete',
    'analytics.read'
  ],
  CONTENT_ADMIN: [
    'categories.read', 'categories.write', 'categories.delete',
    'questions.read', 'questions.write', 'questions.delete',
    'music.read', 'music.write', 'music.delete'
  ],
  CUSTOMER_ADMIN: [
    'users.read', 'users.write',
    'orders.read',
    'analytics.read'
  ]
}

export function hasPermission(adminRole: AdminRole | null, permission: string): boolean {
  if (!adminRole) return false
  return ADMIN_PERMISSIONS[adminRole]?.includes(permission) || false
}

export function checkPermissions(adminRole: AdminRole | null, permissions: string[]): boolean {
  return permissions.every(permission => hasPermission(adminRole, permission))
}