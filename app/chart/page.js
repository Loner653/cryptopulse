import CryptoChart from "./CryptoChart"; // Use relative path

export default function ChartPage() {
  return (
    <div>
      <h1 style={{ color: '#ffd700', textAlign: 'center', padding: '20px 0' }}>
        Crypto Price Charts
      </h1>
      <CryptoChart />
    </div>
  );
}