import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient';

const DEFAULT_RATES = {
  baseRate: '295',
  cleaningFee: '180',
  taxRate: '8'
};

const AdminRateManagement = () => {
  const [rates, setRates] = useState(DEFAULT_RATES);
  const { toast } = useToast();

  
  useEffect(() => {
    const fetchRates = async () => {
      const { data, error } = await supabase
        .from('rates')
        .select('base_rate, cleaning_fee, tax_rate')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      if (data) {
        setRates({
          baseRate: String(data.base_rate),
          cleaningFee: String(data.cleaning_fee),
          taxRate: String(data.tax_rate)
        });
      }
    };
    fetchRates();
  }, []);

  const handleRateChange = (field: keyof typeof rates, value: string) => {
    setRates(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveRates = async () => {
    const { baseRate, cleaningFee, taxRate } = rates;
    const { error } = await supabase.from('rates').insert([
      {
        base_rate: Number(baseRate),
        cleaning_fee: Number(cleaningFee),
        tax_rate: Number(taxRate)
      }
    ]);
    if (!error) {
      toast({
        title: "Rates Updated",
        description: `Base: $${baseRate}, Cleaning: $${cleaningFee}, Tax: ${taxRate}%`,
      });
    } else {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleResetRates = () => {
    setRates(DEFAULT_RATES);
    toast({
      title: "Rates Reset",
      description: "Rates have been reset to default values",
    });
  };

  return (
    <Card className="p-6 bg-gradient-card border-border/50 shadow-luxury">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold">Rate Management</h3>
        <div className="text-sm text-muted-foreground">
          Admin Only
        </div>
      </div>
      
      <div className="space-y-6">
        {/* Current Rates Display */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-muted/20 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">${rates.baseRate}</div>
            <div className="text-sm text-muted-foreground">Per Night</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-secondary">${rates.cleaningFee}</div>
            <div className="text-sm text-muted-foreground">Cleaning Fee</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">{rates.taxRate}%</div>
            <div className="text-sm text-muted-foreground">Tax Rate</div>
          </div>
        </div>

        {/* Rate Adjustment Form */}
        <div className="space-y-4">
          <h4 className="font-semibold">Adjust Rates</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="baseRate" className="block text-sm font-medium mb-2">
                Base Rate ($/night)
              </label>
              <Input
                id="baseRate"
                type="number"
                min="0"
                step="1"
                value={rates.baseRate}
                onChange={(e) => handleRateChange('baseRate', e.target.value)}
                placeholder="295"
              />
            </div>
            
            <div>
              <label htmlFor="cleaningFee" className="block text-sm font-medium mb-2">
                Cleaning Fee ($)
              </label>
              <Input
                id="cleaningFee"
                type="number"
                min="0"
                step="1"
                value={rates.cleaningFee}
                onChange={(e) => handleRateChange('cleaningFee', e.target.value)}
                placeholder="180"
              />
            </div>
            
            <div>
              <label htmlFor="taxRate" className="block text-sm font-medium mb-2">
                Tax Rate (%)
              </label>
              <Input
                id="taxRate"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={rates.taxRate}
                onChange={(e) => handleRateChange('taxRate', e.target.value)}
                placeholder="8"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              variant="hero" 
              onClick={handleSaveRates}
              className="flex-1"
            >
              Save Changes
            </Button>
            <Button 
              variant="outline" 
              onClick={handleResetRates}
            >
              Reset to Default
            </Button>
          </div>
        </div>

        {/* Rate History (Future Enhancement) */}
        <div className="pt-6 border-t border-border/20">
          <h4 className="font-semibold mb-3">Rate History</h4>
          <div className="text-sm text-muted-foreground">
            Rate change history will appear here once backend is connected.
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AdminRateManagement;