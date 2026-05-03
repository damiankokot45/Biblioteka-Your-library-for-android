import React, { useMemo } from 'react';
import { Book } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { BookOpen, CheckCircle2, TrendingUp, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslation } from '../lib/i18n';

interface StatsDashboardProps {
  books: Book[];
}

export function StatsDashboard({ books }: StatsDashboardProps) {
  const { t, lang } = useTranslation();
  
  const stats = useMemo(() => {
    const totalBooks = books.length;
    const readBooks = books.filter(b => b.status === 'READ');
    const readingBooks = books.filter(b => b.status === 'READING');
    
    const avgRating = readBooks.length > 0 
      ? (readBooks.reduce((sum, b) => sum + (b.rating || 0), 0) / readBooks.filter(b => b.rating).length).toFixed(1)
      : '0.0';

    // Books by status for PieChart
    const statusData = [
      { name: t('statusToRead'), value: books.filter(b => b.status === 'TO_READ').length, color: 'var(--md-sys-color-primary)' }, // Primary based
      { name: t('statusReading'), value: readingBooks.length, color: 'var(--md-sys-color-tertiary)' }, // Tertiary based
      { name: t('statusRead'), value: readBooks.length, color: 'var(--md-sys-color-secondary)' }, // Secondary based
    ].filter(d => d.value > 0);

    // Books added/read by month (last 6 months)
    const last6Months = Array.from({ length: 6 }).map((_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - (5 - i));
      return {
        month: d.toLocaleString(lang, { month: 'short' }),
        year: d.getFullYear(),
        monthNum: d.getMonth(),
      };
    });

    const monthlyData = last6Months.map(m => {
      const booksInMonth = books.filter(b => {
        const d = new Date(b.addedAt);
        return d.getMonth() === m.monthNum && d.getFullYear() === m.year;
      });

      return {
        name: m.month,
        [t('added')]: booksInMonth.length,
        [t('tabRead')]: booksInMonth.filter(b => b.status === 'READ').length,
      };
    });

    return { totalBooks, readCount: readBooks.length, avgRating, statusData, monthlyData };
  }, [books]);

  if (books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-4">
        <TrendingUp className="w-16 h-16 text-on-surface-variant/50 mb-4" />
        <h2 className="text-xl font-medium text-on-surface mb-2">{t('emptyStatsTitle')}</h2>
        <p className="text-on-surface-variant max-w-sm">
          {t('emptyStatsDesc')}
        </p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6"
    >
      <h2 className="text-2xl font-bold text-on-surface mb-2">{t('statsTitle')}</h2>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-primary-container text-on-primary-container p-4 rounded-3xl flex flex-col items-center justify-center text-center shadow-sm">
          <BookOpen className="w-6 h-6 mb-2 opacity-80" />
          <span className="text-3xl font-bold">{stats.totalBooks}</span>
          <span className="text-sm font-medium opacity-90 mt-1">{t('totalBooks')}</span>
        </div>
        <div className="bg-secondary-container text-on-secondary-container p-4 rounded-3xl flex flex-col items-center justify-center text-center shadow-sm">
          <CheckCircle2 className="w-6 h-6 mb-2 opacity-80" />
          <span className="text-3xl font-bold">{stats.readCount}</span>
          <span className="text-sm font-medium opacity-90 mt-1">{t('booksRead')}</span>
        </div>
        <div className="bg-tertiary-container text-on-tertiary-container p-4 rounded-3xl flex flex-col items-center justify-center text-center shadow-sm">
          <TrendingUp className="w-6 h-6 mb-2 opacity-80" />
          <span className="text-3xl font-bold">
            {stats.monthlyData[stats.monthlyData.length - 1]?.[t('tabRead')] || 0}
          </span>
          <span className="text-sm font-medium opacity-90 mt-1">{t('inThisMonth')}</span>
        </div>
        <div className="bg-surface-variant text-on-surface border border-outline-variant p-4 rounded-3xl flex flex-col items-center justify-center text-center shadow-sm">
          <Star className="w-6 h-6 mb-2 text-primary opacity-80" />
          <span className="text-3xl font-bold">{stats.avgRating === 'NaN' ? '-' : stats.avgRating}</span>
          <span className="text-sm font-medium text-on-surface-variant mt-1">{t('averageRating')}</span>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {/* Bar Chart */}
        <div className="bg-surface border border-outline-variant rounded-3xl p-6 shadow-sm">
          <h3 className="text-lg font-medium text-on-surface mb-6">{t('activityMonths')}</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.monthlyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-outline-variant/50" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'currentColor', fontSize: 12 }} 
                  className="text-on-surface-variant"
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'currentColor', fontSize: 12 }}
                  className="text-on-surface-variant"
                />
                <Tooltip 
                  cursor={{ fill: 'currentColor', opacity: 0.1 }}
                  contentStyle={{ backgroundColor: 'var(--md-sys-color-surface)', borderColor: 'var(--md-sys-color-outline-variant)', borderRadius: '16px', color: 'var(--md-sys-color-on-surface)' }}
                  itemStyle={{ color: 'var(--md-sys-color-on-surface)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey={t('added')} fill="var(--md-sys-color-secondary-container)" stroke="var(--md-sys-color-secondary)" strokeWidth={1} radius={[4, 4, 0, 0]} />
                <Bar dataKey={t('tabRead')} fill="var(--md-sys-color-primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-surface border border-outline-variant rounded-3xl p-6 shadow-sm">
          <h3 className="text-lg font-medium text-on-surface mb-6">{t('statusDistribution')}</h3>
          <div className="h-64 w-full">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {stats.statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--md-sys-color-surface)', borderColor: 'var(--md-sys-color-outline-variant)', borderRadius: '16px', color: 'var(--md-sys-color-on-surface)' }}
                  itemStyle={{ color: 'var(--md-sys-color-on-surface)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
