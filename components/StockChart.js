import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function StockChart({ products }) {
  const data = products && products.length > 0 
    ? products.slice(0, 10).map(product => ({
        name: product.name.substring(0, 15),
        stock: product.stock,
      }))
    : [];

  return (
    <div style={{ 
      background: '#1a1f3a', 
      padding: '1.5rem', 
      borderRadius: '12px', 
      border: '1px solid #2d3548' 
    }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#fff', marginBottom: '1rem' }}>
        Stock Levels
      </h2>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="name" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip 
              contentStyle={{ 
                background: '#1e293b', 
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#fff'
              }} 
            />
            <Legend />
            <Bar dataKey="stock" fill="#3b82f6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
          No products yet. Add products to see stock levels.
        </div>
      )}
    </div>
  );
}