'use client';

import Link from 'next/link';
import {
  Droplets, Zap, Trash2, Route, Heart, GraduationCap,
  ArrowRight, Shield, MessageSquare, BarChart3, Clock,
  CheckCircle, ChevronRight, Sparkles, AlertCircle, TrendingUp
} from 'lucide-react';
import { DEPARTMENTS } from '@/constants/departments';
import { cn } from '@/lib/utils/cn';
import styles from './LandingPage.module.css';

const iconMap: Record<string, React.ElementType> = {
  Droplets, Zap, Trash2, Route, Heart, GraduationCap,
};

const stats = [
  { label: 'Complaints Resolved', value: '15,000+', icon: CheckCircle, color: '#10b981' },
  { label: 'Active Departments', value: '6', icon: BarChart3, color: '#3b82f6' },
  { label: 'Avg Resolution Time', value: '3 Days', icon: Clock, color: '#7c3aed' },
  { label: 'Citizen Satisfaction', value: '95%', icon: Sparkles, color: '#f59e0b' },
];

export default function LandingPage() {
  return (
    <div className={styles.container}>
      {/* Navbar with Government Stripe */}
      <div className={styles.bgGrid} />
      <nav className={styles.navbar}>
        <div className={styles.govtHeaderStripe} />
        <div className={styles.navContainer}>
          <Link href="/" className={styles.logoLink}>
            <img
              src="/tn-emblem.png"
              alt="Tamil Nadu Government"
              className={styles.logoImage}
            />
            <div className={styles.logoTextContainer}>
              <h1 className={styles.logoTitle}>
                Tamil Nadu Government
              </h1>
              <p className={styles.logoSubtitle}>Pollachi Municipal Corporation</p>
            </div>
          </Link>

          <div className={styles.navLinks}>
            <Link href="/login" className={styles.signInLink}>
              Sign In
            </Link>
            <Link href="/register" className="btn-premium text-sm">
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={cn(styles.heroContent, "fade-in")}>
          <div className={styles.govtBadge}>
            <Shield size={14} />
            Government of Tamil Nadu
          </div>

          <h1 className={styles.heroTitle}>
            Citizens Grievance Portal
            <br />
            <span className={styles.textGradient}>Pollachi Municipal Corporation</span>
          </h1>

          <p className={styles.heroDescription}>
            An official platform for registering and tracking civic complaints.
            Transparent, efficient, and accountable governance for all citizens.
          </p>

          <div className={styles.heroButtons}>
            <Link href="/register" className="btn-premium text-base px-8 py-4">
              Register Grievance <ArrowRight size={18} className="ml-2" />
            </Link>
            <Link href="/login" className={styles.trackButton}>
              Track Status
            </Link>
          </div>

          {/* Stats Bar */}
          <div className={cn(styles.statsGrid, "fade-in")}>
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className={cn("glass-card", styles.statCard)}>
                  <div className={styles.statIconWrapper}>
                    <Icon size={20} />
                  </div>
                  <p className={styles.statValue}>{stat.value}</p>
                  <p className={styles.statLabel}>{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className={styles.section}>
        <div className={styles.sectionContent}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Key Features</h2>
            <div className={styles.sectionUnderscore} />
          </div>

          <div className={styles.featuresGrid}>
            {[
              { icon: Sparkles, title: "AI-Powered", desc: "Automated categorization and prioritization of grievances using advanced AI technology.", color: "tn-navy" },
              { icon: Shield, title: "Secure System", desc: "End-to-end encrypted submissions with role-based access control for complete privacy.", color: "tn-navy" },
              { icon: Clock, title: "Time-Bound", desc: "Automated SLA tracking ensures timely resolution within specified service standards", color: "tn-navy" }
            ].map((f, i) => (
              <div key={f.title} className={cn("glass-card", styles.featureCard)}>
                <f.icon className={styles.featureIcon} size={36} />
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Departments Preview */}
      <section id="departments" className={styles.deptSection}>
        <div className={styles.sectionContent}>
          <div className={styles.deptHeader}>
            <div className={styles.deptTitleBlock}>
              <span className={styles.deptLabel}>Our Departments</span>
              <h2 className={styles.sectionTitle}>Comprehensive Civic Services</h2>
            </div>
            <p className={styles.deptDesc}>Connect with the right officials for water, sanitation, roads, and more.</p>
          </div>

          <div className={styles.deptGrid}>
            {DEPARTMENTS.slice(0, 6).map((dept) => {
              const Icon = iconMap[dept.icon] || Shield;
              return (
                <div key={dept.id} className={cn("glass-card", styles.deptCard)}>
                  <Icon className={styles.deptIcon} size={32} />
                  <h3 className={styles.deptName}>{dept.label}</h3>
                  <div className={styles.deptTags}>
                    {dept.subCategories.slice(0, 2).map(sub => (
                      <span key={sub.id} className={styles.deptTag}>
                        {sub.label}
                      </span>
                    ))}
                  </div>
                  <Link href="/register" className={styles.deptLink}>
                    REPORT ISSUE <ArrowRight size={14} />
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.section}>
        <div className={styles.ctaCard}>
          <h2 className={styles.ctaTitle}>Ready to Register a Grievance?</h2>
          <p className={styles.ctaText}>Join thousands of citizens in Pollachi in building transparent and accountable governance.</p>
          <div className={styles.ctaButtons}>
            <Link href="/register" className={styles.ctaRegisterBtn}>Register Now</Link>
            <Link href="/login" className={styles.ctaLoginBtn}>Login to Portal</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerGrid}>
          <div className={styles.footerBrandCol}>
            <div className={styles.footerLogo}>
              <img src="/tn-emblem.png" alt="Tamil Nadu Government" className={styles.footerLogoImg} />
              <h4 className={styles.footerTitle}>Tamil Nadu Government</h4>
            </div>
            <p className={styles.footerDesc}>
              Official grievance redressal portal of Pollachi Municipal Corporation, committed to excellence in civic services and citizen welfare.
            </p>
          </div>
          <div>
            <h5 className={styles.footerHeading}>Quick Links</h5>
            <ul className={styles.footerLinks}>
              <li><Link href="/dashboard" className={styles.footerLink}>Public Dashboard</Link></li>
              <li><Link href="#departments" className={styles.footerLink}>Department List</Link></li>
              <li><Link href="#" className={styles.footerLink}>SLA Guidelines</Link></li>
            </ul>
          </div>
          <div>
            <h5 className={styles.footerHeading}>Support</h5>
            <ul className={styles.footerLinks}>
              <li><Link href="/help" className={styles.footerLink}>Help Center</Link></li>
              <li><Link href="/privacy" className={styles.footerLink}>Privacy Policy</Link></li>
              <li><Link href="/contact" className={styles.footerLink}>Contact Us</Link></li>
            </ul>
          </div>
        </div>
        <div className={styles.copyright}>
          <p className={styles.copyrightText}>© 2025 Tamil Nadu Government. All Rights Reserved.</p>
          <p className={styles.copyrightSub}>Pollachi Municipal Corporation</p>
        </div>
      </footer>
    </div >
  );
}
