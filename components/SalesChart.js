import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#8b5cf6', '#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#14b8a6'];

export default function SalesChart({ products }) {
  const normalizeCategory = (category) => {
    if (!category) return 'Uncategorized';
    const lower = category.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  };

  // Group products by category
  const getCategoryData = () => {
    if (!products || products.length === 0) return [];

    const categoryCount = {};
    products.forEach(product => {
      const rawCategory = product.category || 'Uncategorized';
      const key = rawCategory.toLowerCase();
      categoryCount[key] = (categoryCount[key] || 0) + 1;
    });

    return Object.entries(categoryCount).map(([name, value]) => ({
      name: normalizeCategory(name),
      value
    }));
  };

  const chartData = getCategoryData();

  return (
    <div style={{ 
      background: '#1a1f3a', 
      padding: '1.5rem', 
      borderRadius: '12px', 
      border: '1px solid #2d3548' 
    }}>
      <div style={{ marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#fff', marginBottom: '0.25rem' }}>
          Products by Category
        </h2>
        <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
          Distribution of products across different categories
        </p>
      </div>

      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                background: '#1e293b', 
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#fff'
              }}
              formatter={(value) => [`${value} products`, 'Count']}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
          No products yet. Add products to see category distribution.
        </div>
      )}
    </div>
  );
}