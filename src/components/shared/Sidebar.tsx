'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import {
  LayoutDashboard,
  FileText,
  FilePlus,
  User,
  BarChart3,
  Users,
  Settings,
  Building2,
  LogOut,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';
import { useState } from 'react';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils/cn';
import styles from './Sidebar.module.css';

const publicLinks = [
  { href: ROUTES.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
  { href: ROUTES.COMPLAINTS, label: 'My Complaints', icon: FileText },
  { href: ROUTES.NEW_COMPLAINT, label: 'New Complaint', icon: FilePlus },
  { href: ROUTES.PROFILE, label: 'Profile', icon: User },
];

const deptLinks = [
  { href: ROUTES.DEPT_DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
  { href: ROUTES.DEPT_COMPLAINTS, label: 'Complaints', icon: FileText },
  { href: ROUTES.DEPT_ANALYTICS, label: 'Analytics', icon: BarChart3 },
  { href: ROUTES.DEPT_TEAM, label: 'Team', icon: Users },
];

const adminLinks = [
  { href: ROUTES.ADMIN_DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
  { href: ROUTES.ADMIN_COMPLAINTS, label: 'All Complaints', icon: FileText },
  { href: ROUTES.ADMIN_DEPARTMENTS, label: 'Departments', icon: Building2 },
  { href: ROUTES.ADMIN_USERS, label: 'Users', icon: Users },
  { href: ROUTES.ADMIN_REPORTS, label: 'Reports', icon: BarChart3 },
  { href: ROUTES.ADMIN_SETTINGS, label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const { userData, logout } = useAuth();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const links =
    userData?.role === 'admin'
      ? adminLinks
      : userData?.role === 'department_head'
        ? deptLinks
        : publicLinks;

  const roleLabel =
    userData?.role === 'admin'
      ? 'Administrator'
      : userData?.role === 'department_head'
        ? 'Department Head'
        : 'Citizen';

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={styles.mobileToggle}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className={styles.overlay}
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          styles.sidebar,
          isOpen ? styles.sidebarOpen : ""
        )}
      >
        {/* Logo area */}
        <div className={styles.logoArea}>
          <img
            src="/tn-emblem.png"
            alt="Tamil Nadu Government"
            className={styles.logoImage}
          />
          <div className={styles.logoText}>
            <h1>
              Tamil Nadu Government
            </h1>
            <p className={styles.logoSubtext}>
              Pollachi Municipal Corporation
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className={styles.nav}>
          <p className={styles.navLabel}>
            Main Navigation
          </p>
          <ul className={styles.navList}>
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      styles.navLink,
                      isActive ? styles.navLinkActive : ""
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon size={20} className={styles.navIcon} />
                    <span>{link.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User section */}
        <div className={styles.userSection}>
          <div className={styles.userMenuWrapper}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className={styles.userButton}
            >
              <div className={styles.avatar}>
                {userData?.name?.charAt(0) || 'U'}
              </div>
              <div className={styles.userInfo}>
                <p className={styles.userName}>
                  {userData?.name || 'User'}
                </p>
                <p className={styles.userRole}>
                  {roleLabel}
                </p>
              </div>
              <ChevronDown size={14} className="text-muted-foreground" />
            </button>

            {showUserMenu && (
              <div className={styles.userMenu}>
                <button
                  onClick={logout}
                  className={styles.signOutBtn}
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

