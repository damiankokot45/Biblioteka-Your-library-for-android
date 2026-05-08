import React, { useMemo } from 'react';
import { Book } from '../types';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslation } from '../lib/i18n';

interface StatsDashboardProps {
  books: Book[];
}

export function StatsDashboard({ books }: StatsDashboardProps) {
  const { t, lang } = useTranslation();
  
  const stats = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const yearStart = new Date(currentYear, 0, 1).getTime();
    const yearEnd = new Date(currentYear + 1, 0, 1).getTime();

    const readThisYear = books.filter(b => b.finishedAt && b.finishedAt >= yearStart && b.finishedAt < yearEnd);
    const addedThisYear = books.filter(b => b.addedAt >= yearStart && b.addedAt < yearEnd);
    
    // Pages calculation (estimate if totalPages missing, or use currentPage)
    // For now use a simple heuristic
    const pagesFromReadBooks = readThisYear.length * 320; 
    const pagesFromCurrent = books
      .filter(b => b.status === 'READING')
      .reduce((sum, b) => sum + (b.currentPage || 0), 0);
    
    const pagesRead = pagesFromReadBooks + pagesFromCurrent;
    const timeSpentH = Math.round(pagesRead / 45); 

    // Books read by month for current year
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyData = monthNames.map((name, i) => {
      const mStart = new Date(currentYear, i, 1).getTime();
      const mEnd = new Date(currentYear, i + 1, 1).getTime();
      const count = books.filter(b => b.finishedAt && b.finishedAt >= mStart && b.finishedAt < mEnd).length;
      return { name, value: count };
    });

    return { 
      readCount: readThisYear.length, 
      addedCount: addedThisYear.length,
      pagesRead, 
      timeSpentH, 
      monthlyData 
    };
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-6"
    >

      {/* This Year Summary */}
      <motion.div variants={itemVariants} className="bg-surface-variant/20 border border-outline-variant/30 rounded-3xl p-6">
        <h3 className="text-[0.85rem] font-medium text-on-surface-variant mb-6">{t('thisYear')}</h3>
        <div className="grid grid-cols-2 gap-y-6 gap-x-4">
          <motion.div variants={itemVariants}>
            <span className="text-2xl font-medium block text-on-surface">{stats.readCount}</span>
            <span className="text-[0.85rem] text-on-surface-variant mt-1 block">{t('booksRead')}</span>
          </motion.div>
          <motion.div variants={itemVariants}>
            <span className="text-2xl font-medium block text-on-surface">{stats.addedCount}</span>
            <span className="text-[0.85rem] text-on-surface-variant mt-1 block">{t('booksAdded')}</span>
          </motion.div>
          <motion.div variants={itemVariants}>
            <span className="text-2xl font-medium block text-on-surface">{stats.pagesRead.toLocaleString()}</span>
            <span className="text-[0.85rem] text-on-surface-variant mt-1 block">{t('pagesRead')}</span>
          </motion.div>
          <motion.div variants={itemVariants}>
            <span className="text-2xl font-medium block text-on-surface">{stats.timeSpentH}h</span>
            <span className="text-[0.85rem] text-on-surface-variant mt-1 block">{t('timeSpent')}</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Reading Progress Line Chart */}
      <motion.div variants={itemVariants} className="bg-surface-variant/20 border border-outline-variant/30 rounded-3xl p-6">
        <h3 className="text-[0.9rem] font-medium text-on-surface mb-6">{t('readingProgress')}</h3>
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats.monthlyData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'var(--md-sys-color-on-surface-variant)', fontSize: 11 }} 
                dy={10}
              />
              <Tooltip 
                cursor={{ stroke: 'var(--md-sys-color-outline-variant)', strokeWidth: 1, strokeDasharray: '4 4' }}
                contentStyle={{ backgroundColor: 'var(--md-sys-color-surface)', borderColor: 'var(--md-sys-color-outline-variant)', borderRadius: '12px', color: 'var(--md-sys-color-on-surface)', fontSize: '12px' }}
                itemStyle={{ color: 'var(--md-sys-color-primary)' }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#e09b69" 
                strokeWidth={2.5} 
                dot={{ r: 4, fill: '#e09b69', strokeWidth: 0 }} 
                activeDot={{ r: 6, fill: '#e09b69' }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </motion.div>
  );
}
