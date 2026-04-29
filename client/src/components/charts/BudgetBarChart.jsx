import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const BudgetBarChart = ({ data }) => (
  <div className="card-surface h-[380px] p-5 text-white">
    <div className="mb-4">
      <p className="kicker">Budget Match</p>
      <h3 className="mt-2 text-2xl font-semibold text-white">Budget vs actual</h3>
    </div>
    <ResponsiveContainer width="100%" height="82%">
      <BarChart data={data}>
        <CartesianGrid stroke="rgba(255, 255, 255, 0.08)" strokeDasharray="4 4" />
        <XAxis dataKey="category" tickLine={false} axisLine={false} tick={{ fill: "rgba(255,255,255,0.56)", fontSize: 12 }} />
        <YAxis tickLine={false} axisLine={false} tick={{ fill: "rgba(255,255,255,0.56)", fontSize: 12 }} />
        <Tooltip
          formatter={(value) => `Rs ${Number(value).toLocaleString("en-IN")}`}
          contentStyle={{
            borderRadius: 18,
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(8, 10, 18, 0.94)",
            color: "#fff",
          }}
        />
        <Legend wrapperStyle={{ color: "rgba(255,255,255,0.72)" }} />
        <Bar dataKey="limit" fill="#61F4C6" radius={[10, 10, 0, 0]} />
        <Bar dataKey="spent" fill="#FF758B" radius={[10, 10, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default BudgetBarChart;
