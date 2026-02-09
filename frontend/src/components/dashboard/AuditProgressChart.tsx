import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { month: "Jul", disbursed: 12.4, verified: 11.2 },
  { month: "Aug", disbursed: 18.7, verified: 15.8 },
  { month: "Sep", disbursed: 24.3, verified: 20.1 },
  { month: "Oct", disbursed: 31.2, verified: 26.4 },
  { month: "Nov", disbursed: 38.6, verified: 32.8 },
  { month: "Dec", disbursed: 45.2, verified: 38.9 },
  { month: "Jan", disbursed: 52.8, verified: 44.2 },
];

export function AuditProgressChart() {
  return (
    <div className="glass-panel p-5 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="section-header mb-0">Financial vs Verified Progress</h3>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-chart-1" />
            <span className="text-muted-foreground">Disbursed (KES Bn)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-chart-2" />
            <span className="text-muted-foreground">Verified (KES Bn)</span>
          </div>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorDisbursed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(215, 70%, 50%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(215, 70%, 50%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorVerified" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(142, 60%, 45%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(142, 60%, 45%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 25%, 18%)" />
            <XAxis 
              dataKey="month" 
              tick={{ fill: 'hsl(215, 15%, 55%)', fontSize: 11 }}
              axisLine={{ stroke: 'hsl(220, 25%, 18%)' }}
              tickLine={false}
            />
            <YAxis 
              tick={{ fill: 'hsl(215, 15%, 55%)', fontSize: 11 }}
              axisLine={{ stroke: 'hsl(220, 25%, 18%)' }}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(222, 47%, 10%)',
                border: '1px solid hsl(220, 25%, 25%)',
                borderRadius: '6px',
                fontSize: '12px',
              }}
              labelStyle={{ color: 'hsl(210, 20%, 95%)' }}
            />
            <Area
              type="monotone"
              dataKey="disbursed"
              stroke="hsl(215, 70%, 50%)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorDisbursed)"
            />
            <Area
              type="monotone"
              dataKey="verified"
              stroke="hsl(142, 60%, 45%)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorVerified)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
