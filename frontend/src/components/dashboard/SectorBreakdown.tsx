import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { name: "Roads & Transport", value: 42, color: "hsl(215, 70%, 50%)" },
  { name: "Health", value: 23, color: "hsl(142, 60%, 45%)" },
  { name: "Education", value: 18, color: "hsl(38, 90%, 50%)" },
  { name: "Water & Sanitation", value: 12, color: "hsl(280, 60%, 50%)" },
  { name: "Energy", value: 5, color: "hsl(0, 70%, 55%)" },
];

export function SectorBreakdown() {
  return (
    <div className="glass-panel p-5 animate-fade-in">
      <h3 className="section-header">Sector Distribution</h3>

      <div className="flex items-center gap-6">
        <div className="w-32 h-32">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={35}
                outerRadius={50}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(222, 47%, 10%)',
                  border: '1px solid hsl(220, 25%, 25%)',
                  borderRadius: '6px',
                  fontSize: '12px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 space-y-2">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div 
                  className="w-2.5 h-2.5 rounded-sm" 
                  style={{ backgroundColor: item.color }} 
                />
                <span className="text-muted-foreground">{item.name}</span>
              </div>
              <span className="font-mono font-medium">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
