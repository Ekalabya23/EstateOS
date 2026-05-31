import { useState, useEffect } from 'react';
import { Calculator, TrendingUp, DollarSign, Clock, ArrowRight, Info } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ROICalculatorProps {
  initialPrice?: number;
}

export default function ROICalculator({ initialPrice = 10000000 }: ROICalculatorProps) {
  const [price, setPrice] = useState(initialPrice);
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenureYears] = useState(20);
  const [expectedRent, setExpectedRent] = useState(price * 0.003); // Approx 0.3% per month
  const [appreciationRate, setAppreciationRate] = useState(5);
  const [maintenanceCost, setMaintenanceCost] = useState(price * 0.001); // Approx 0.1% per month

  // Outputs
  const [emi, setEmi] = useState(0);
  const [cashFlow, setCashFlow] = useState(0);
  const [rentalYield, setRentalYield] = useState(0);
  const [tenYearReturn, setTenYearReturn] = useState(0);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    // EMI Calculation: P * r * (1 + r)^n / ((1 + r)^n - 1)
    const P = price * (1 - downPaymentPct / 100);
    const r = (interestRate / 100) / 12;
    const n = tenureYears * 12;
    
    let calculatedEmi = 0;
    if (r > 0 && n > 0) {
      calculatedEmi = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    }
    
    setEmi(calculatedEmi);
    setCashFlow(expectedRent - calculatedEmi - maintenanceCost);
    
    const annualRent = expectedRent * 12;
    setRentalYield((annualRent / price) * 100);

    // 10 Year Projection
    const futureValue = price * Math.pow(1 + appreciationRate / 100, 10);
    const totalRent10Y = expectedRent * 12 * 10; // Simplification (not accounting for rent appreciation)
    const totalEmi10Y = calculatedEmi * 12 * 10;
    const totalMaintenance10Y = maintenanceCost * 12 * 10;
    
    // Remaining Principal after 10 years
    const remainingPrincipal = P * (Math.pow(1 + r, n) - Math.pow(1 + r, 10 * 12)) / (Math.pow(1 + r, n) - 1);
    const equityBuilt = P - remainingPrincipal;
    
    const totalReturn = (futureValue - price) + (totalRent10Y - totalMaintenance10Y - totalEmi10Y) + equityBuilt;
    setTenYearReturn(totalReturn);

    // Chart Data (Comparing with FD at 7% and Nifty at 12%)
    const downPaymentAmount = price * (downPaymentPct / 100);
    const fdValue = downPaymentAmount * Math.pow(1 + 0.07, 10) - downPaymentAmount;
    const niftyValue = downPaymentAmount * Math.pow(1 + 0.12, 10) - downPaymentAmount;

    setChartData([
      { name: 'Fixed Deposit (7%)', value: fdValue, color: '#e2e8f0' },
      { name: 'Nifty 50 (12%)', value: niftyValue, color: '#cbd5e1' },
      { name: 'Real Estate', value: totalReturn, color: 'var(--color-charcoal)' },
    ]);

  }, [price, downPaymentPct, interestRate, tenureYears, expectedRent, appreciationRate, maintenanceCost]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="bg-white rounded-3xl border border-[var(--color-mist)] p-6 md:p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-[var(--color-cream)] flex items-center justify-center text-[var(--color-champagne-dark)]">
          <Calculator className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[var(--color-charcoal)]" style={{ fontFamily: 'var(--font-display)' }}>
            Investment ROI Calculator
          </h2>
          <p className="text-sm text-[var(--color-stone)]">Project your returns and cash flow over 10 years.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left: Inputs */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <label className="flex items-center justify-between text-sm font-bold text-[var(--color-stone)] mb-2">
              <span>Property Price</span>
              <span className="text-[var(--color-charcoal)]">{formatCurrency(price)}</span>
            </label>
            <input 
              type="range" min="1000000" max="100000000" step="100000"
              value={price} onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full accent-[var(--color-champagne-dark)]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[var(--color-stone)] mb-1">Down Payment (%)</label>
              <div className="relative">
                <input 
                  type="number" value={downPaymentPct} onChange={(e) => setDownPaymentPct(Number(e.target.value))}
                  className="w-full p-2.5 bg-[var(--color-warm-white)] border border-[var(--color-mist)] rounded-lg text-sm font-semibold pr-8"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[var(--color-stone)]">%</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-[var(--color-stone)] mb-1">Interest Rate (%)</label>
              <div className="relative">
                <input 
                  type="number" step="0.1" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full p-2.5 bg-[var(--color-warm-white)] border border-[var(--color-mist)] rounded-lg text-sm font-semibold pr-8"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[var(--color-stone)]">%</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[var(--color-stone)] mb-1">Expected Rent (₹/mo)</label>
              <input 
                type="number" value={expectedRent} onChange={(e) => setExpectedRent(Number(e.target.value))}
                className="w-full p-2.5 bg-[var(--color-warm-white)] border border-[var(--color-mist)] rounded-lg text-sm font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[var(--color-stone)] mb-1">Maintenance (₹/mo)</label>
              <input 
                type="number" value={maintenanceCost} onChange={(e) => setMaintenanceCost(Number(e.target.value))}
                className="w-full p-2.5 bg-[var(--color-warm-white)] border border-[var(--color-mist)] rounded-lg text-sm font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center justify-between text-sm font-bold text-[var(--color-stone)] mb-2">
              <span>Annual Appreciation</span>
              <span className="text-[var(--color-charcoal)]">{appreciationRate}%</span>
            </label>
            <input 
              type="range" min="0" max="15" step="0.5"
              value={appreciationRate} onChange={(e) => setAppreciationRate(Number(e.target.value))}
              className="w-full accent-[var(--color-champagne-dark)]"
            />
          </div>
        </div>

        {/* Right: Outputs */}
        <div className="lg:col-span-7">
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-[var(--color-warm-white)] p-4 rounded-2xl border border-[var(--color-mist)]">
              <div className="flex items-center gap-2 text-sm text-[var(--color-stone)] mb-1">
                <DollarSign className="w-4 h-4" /> Monthly EMI
              </div>
              <div className="text-2xl font-bold text-[var(--color-charcoal)]">{formatCurrency(emi)}</div>
            </div>
            <div className={`p-4 rounded-2xl border ${cashFlow >= 0 ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
              <div className="flex items-center gap-2 text-sm mb-1 text-[var(--color-charcoal)] opacity-70">
                <TrendingUp className="w-4 h-4" /> Monthly Cash Flow
              </div>
              <div className={`text-2xl font-bold ${cashFlow >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                {cashFlow >= 0 ? '+' : ''}{formatCurrency(cashFlow)}
              </div>
            </div>
            <div className="bg-[var(--color-warm-white)] p-4 rounded-2xl border border-[var(--color-mist)]">
              <div className="flex items-center gap-2 text-sm text-[var(--color-stone)] mb-1">
                <Clock className="w-4 h-4" /> Gross Rental Yield
              </div>
              <div className="text-2xl font-bold text-[var(--color-charcoal)]">{rentalYield.toFixed(2)}%</div>
            </div>
            <div className="bg-[var(--color-charcoal)] p-4 rounded-2xl text-white shadow-lg">
              <div className="flex items-center gap-2 text-sm text-white/70 mb-1">
                <ArrowRight className="w-4 h-4" /> Est. 10Y Return
              </div>
              <div className="text-2xl font-bold text-[var(--color-champagne)]">{formatCurrency(tenYearReturn)}</div>
            </div>
          </div>

          <div className="bg-white border border-[var(--color-mist)] rounded-2xl p-5 relative overflow-hidden">
            {chartData[2]?.value > chartData[1]?.value && (
              <div className="absolute top-4 right-4 px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Beats Nifty 50
              </div>
            )}
            
            <h3 className="text-sm font-bold text-[var(--color-stone)] mb-6 flex items-center gap-2">
              <Info className="w-4 h-4" /> 10-Year Profit Comparison (vs Alternatives)
            </h3>
            
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#8b8b8b' }} />
                  <YAxis tickFormatter={(val) => `₹${(val/100000).toFixed(0)}L`} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#8b8b8b' }} />
                  <Tooltip 
                    formatter={(value: any) => [formatCurrency(Number(value)), 'Profit']}
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
