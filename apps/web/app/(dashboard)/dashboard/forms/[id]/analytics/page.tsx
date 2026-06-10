'use client';

import { use, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, Users, FileText, TrendingUp, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useForm, useFormAnalytics } from '@/modules/forms/hooks/useForms';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const CHART_COLORS = {
  1: 'oklch(0.67 0.13 245)',
  2: 'oklch(0.72 0.095 308)',
  3: 'oklch(0.62 0.11 148)',
  4: 'oklch(0.76 0.108 82)',
  5: 'oklch(0.68 0.12 352)',
} as const;

const TOOLTIP_STYLE = {
  background: 'oklch(0.23 0.048 270)',
  border: '1px solid oklch(1 0 0 / 11%)',
  borderRadius: '1rem',
  fontSize: '0.875rem',
  color: 'oklch(0.93 0.016 88)',
};

export default function FormAnalyticsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: form, isLoading: formLoading, isError: formError } = useForm(id);
  const { data: stats, isLoading: statsLoading, isError: statsError } = useFormAnalytics(id);

  const isLoading = formLoading || statsLoading;
  const isError = formError || statsError;

  const timeline = stats?.timeline;
  const timelineData = useMemo(() => {
    if (!timeline) return [];
    return (timeline as { day: string; count: number }[]).map((d) => ({
      date: d.day,
      label: new Date(d.day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      submissions: d.count,
    }));
  }, [timeline]);

  const hourlyDistribution = stats?.hourlyDistribution;
  const hourlyData = useMemo(() => {
    if (!hourlyDistribution) return [];
    const hours = Array.from({ length: 24 }, (_, i) => ({
      hour: `${i}:00`,
      submissions: 0,
    }));
    for (const h of hourlyDistribution) {
      if (h.hour >= 0 && h.hour < 24) {
        const slot = hours[h.hour];
        if (slot) slot.submissions = h.count;
      }
    }
    return hours;
  }, [hourlyDistribution]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <Skeleton className="mb-6 h-8 w-48" />
        <div className="mb-6 grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <Skeleton className="mb-6 h-72 w-full rounded-xl" />
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !form || !stats) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center">
        <AlertCircle className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
        <h1 className="font-display text-xl font-light text-foreground">
          Failed to load analytics
        </h1>
        <p className="mt-2 font-body text-sm text-muted-foreground">
          Could not load analytics data. The form may not exist.
        </p>
        <Link href="/dashboard">
          <Button className="mt-6">Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  if (stats.totalSubmissions === 0) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-8 flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon-xs">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="font-heading text-base font-medium text-foreground">{form.title}</h1>
            <p className="font-body text-sm text-muted-foreground">Analytics</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <BarChartIcon className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <h2 className="font-display text-xl font-light text-foreground">No responses yet</h2>
          <p className="mt-2 max-w-xs font-body text-sm text-muted-foreground">
            Analytics will appear once people start submitting responses to your form.
          </p>
        </div>
      </div>
    );
  }

  const peakHour =
    hourlyData.length > 0 && hourlyData[0]
      ? hourlyData.reduce((max, h) => (h.submissions > max.submissions ? h : max), hourlyData[0])
      : { hour: '-', submissions: 0 };
  const today = new Date().toISOString().split('T')[0];
  const todayCount = timelineData.find((d) => d.date === today)?.submissions ?? 0;
  const avgDropOff =
    stats.dropOffRates.length > 0
      ? Math.round(
          stats.dropOffRates.reduce(
            (sum: number, d: { completionRate: number }) => sum + d.completionRate,
            0,
          ) / stats.dropOffRates.length,
        )
      : 100;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 animate-page-enter">
      <div className="mb-8 flex items-center gap-4 animate-fade-up">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon-xs">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="font-heading text-base font-medium text-foreground">{form.title}</h1>
          <p className="font-body text-sm text-muted-foreground">Analytics</p>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="animate-fade-up stagger-1">
          <StatCard icon={FileText} label="Total" value={stats.totalSubmissions} />
        </div>
        <div className="animate-fade-up stagger-2">
          <StatCard icon={Users} label="Unique" value={stats.uniqueRespondents} />
        </div>
        <div className="animate-fade-up stagger-3">
          <StatCard icon={TrendingUp} label="Today" value={todayCount} />
        </div>
        <div className="animate-fade-up stagger-4">
          <StatCard icon={CheckCircleIcon} label="Comp. Rate" value={`${avgDropOff}%`} />
        </div>
      </div>

      <div className="animate-fade-up stagger-2">
        <Card size="sm" className="mb-6">
          <CardHeader>
            <CardTitle className="font-heading text-sm">Submissions Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            {timelineData.length === 0 ? (
              <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
                No timeline data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={256}>
                <AreaChart data={timelineData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={CHART_COLORS[1]} stopOpacity={0.35} />
                      <stop offset="95%" stopColor={CHART_COLORS[1]} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 8%)" />
                  <XAxis
                    dataKey="label"
                    fontSize={12}
                    tick={{ fill: 'oklch(0.67 0.032 288)' }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    fontSize={12}
                    tick={{ fill: 'oklch(0.67 0.032 288)' }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={TOOLTIP_STYLE}
                    cursor={{ stroke: CHART_COLORS[1], strokeWidth: 1, strokeOpacity: 0.4 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="submissions"
                    stroke={CHART_COLORS[1]}
                    fill="url(#colorCount)"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 5, fill: CHART_COLORS[1] }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="animate-fade-up stagger-3">
          <Card size="sm">
            <CardHeader>
              <CardTitle className="font-heading text-sm">Peak Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={hourlyData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="oklch(1 0 0 / 8%)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="hour"
                    fontSize={11}
                    tick={{ fill: 'oklch(0.67 0.032 288)' }}
                    tickLine={false}
                    axisLine={false}
                    interval={3}
                  />
                  <YAxis
                    allowDecimals={false}
                    fontSize={11}
                    tick={{ fill: 'oklch(0.67 0.032 288)' }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: 'oklch(1 0 0 / 5%)' }} />
                  <Bar dataKey="submissions" fill={CHART_COLORS[2]} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <p className="mt-3 text-center font-body text-sm text-muted-foreground">
                Peak: {peakHour?.hour} ({peakHour?.submissions} submissions)
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="animate-fade-up stagger-4">
          <Card size="sm">
            <CardHeader>
              <CardTitle className="font-heading text-sm">Field Completion</CardTitle>
            </CardHeader>
            <CardContent>
              {stats.dropOffRates.length === 0 ? (
                <p className="flex h-32 items-center justify-center font-body text-sm text-muted-foreground">
                  No field data available
                </p>
              ) : (
                <div className="space-y-3">
                  {stats.dropOffRates.map(
                    (field: { fieldId: string; fieldLabel: string; completionRate: number }) => (
                      <div key={field.fieldId} className="space-y-1.5">
                        <div className="flex items-center justify-between font-body text-sm">
                          <span className="truncate text-foreground">{field.fieldLabel}</span>
                          <span
                            className="ml-2 shrink-0 tabular-nums font-medium"
                            style={{ color: CHART_COLORS[2] }}
                          >
                            {field.completionRate}%
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-muted/50">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{
                              width: `${field.completionRate}%`,
                              background: `linear-gradient(to right, ${CHART_COLORS[1]}, ${CHART_COLORS[2]})`,
                            }}
                          />
                        </div>
                      </div>
                    ),
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {stats.fieldDistributions.length > 0 && (
        <div className="animate-fade-up stagger-4">
          <Card size="sm" className="mb-6">
            <CardHeader>
              <CardTitle className="font-heading text-sm">Answer Distribution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {stats.fieldDistributions.map(
                (dist: {
                  fieldId: string;
                  fieldLabel: string;
                  fieldType: string;
                  values: { label: string; count: number }[];
                }) => (
                  <div key={dist.fieldId} className="space-y-2">
                    <p className="font-body text-sm font-medium text-foreground">
                      {dist.fieldLabel}
                    </p>
                    <ResponsiveContainer
                      width="100%"
                      height={Math.max(dist.values.length * 36, 80)}
                    >
                      <BarChart
                        data={dist.values}
                        layout="vertical"
                        margin={{ top: 0, right: 8, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="oklch(1 0 0 / 8%)"
                          horizontal={false}
                        />
                        <XAxis
                          type="number"
                          allowDecimals={false}
                          fontSize={11}
                          tick={{ fill: 'oklch(0.67 0.032 288)' }}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          type="category"
                          dataKey="label"
                          fontSize={12}
                          tick={{ fill: 'oklch(0.93 0.016 88)' }}
                          tickLine={false}
                          axisLine={false}
                          width={110}
                        />
                        <Tooltip
                          contentStyle={TOOLTIP_STYLE}
                          cursor={{ fill: 'oklch(1 0 0 / 5%)' }}
                        />
                        <Bar dataKey="count" fill={CHART_COLORS[3]} radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ),
              )}
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 animate-fade-up stagger-5">
        <Card size="sm">
          <CardHeader>
            <CardTitle className="font-heading text-sm">Timeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 font-body text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">First submission</span>
              <span className="text-foreground">
                {stats.firstSubmissionAt ? new Date(stats.firstSubmissionAt).toLocaleString() : '-'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last submission</span>
              <span className="text-foreground">
                {stats.lastSubmissionAt ? new Date(stats.lastSubmissionAt).toLocaleString() : '-'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Peak day</span>
              <span className="text-foreground">
                {timelineData.length > 0
                  ? timelineData.reduce((max, d) => (d.submissions > max.submissions ? d : max))
                      .date
                  : '-'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number | string;
}) {
  return (
    <Card size="sm">
      <CardHeader className="flex flex-row items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <div>
          <p className="font-heading text-lg font-medium tabular-nums text-foreground">{value}</p>
          <p className="font-body text-xs text-muted-foreground">{label}</p>
        </div>
      </CardHeader>
    </Card>
  );
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function BarChartIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 3v18h18" />
      <path d="M7 16h2" />
      <path d="M11 11h2" />
      <path d="M15 7h2" />
    </svg>
  );
}
