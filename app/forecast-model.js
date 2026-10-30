(function (global) {
  'use strict';
  const dayMs = 86400000;
  const addDays = (date, days) => new Date(Date.parse(date + 'T00:00:00Z') + days * dayMs).toISOString().slice(0, 10);
  const difference = (a, b) => Math.round((Date.parse(a + 'T00:00:00Z') - Date.parse(b + 'T00:00:00Z')) / dayMs);
  const defaults = Object.freeze({ horizon: 30, demand: 100, stock: 100, delay: 0, scrap: 5, safety: 3, material: 'all' });
  const presets = Object.freeze({
    basis: { ...defaults },
    rush: { ...defaults, demand: 150 },
    delay: { ...defaults, delay: 14 },
    shortage: { ...defaults, stock: 25 },
    relief: { ...defaults, demand: 80, stock: 150 }
  });
  function calculate(data, input = {}) {
    const options = { ...defaults, ...input };
    for (const [key, min, max] of [['demand', 0, 300], ['stock', 0, 300], ['delay', 0, 90], ['scrap', 0, 100], ['safety', 0, 100]]) {
      if (!Number.isFinite(options[key]) || options[key] < min || options[key] > max) throw new Error('Ungültiger Szenariowert: ' + key);
    }
    if (![30, 60, 90].includes(options.horizon)) throw new Error('Zeitraum muss 30, 60 oder 90 Tage sein.');
    if (options.material !== 'all' && !data.materials.some(m => m.id === options.material)) throw new Error('Unbekanntes Material.');
    const start = addDays(data.forecast.source.history_end, 1);
    const dates = Array.from({ length: options.horizon }, (_, i) => addDays(start, i));
    const productsById = new Map(data.products.map(p => [p.id, p]));
    const materials = data.materials.filter(m => options.material === 'all' || m.id === options.material).map(m => ({
      ...m, startingKg: (m.warehouseKg + m.printerKg) * options.stock / 100,
      dailyKg: Array(options.horizon).fill(0), dailyUnits: Array(options.horizon).fill(0),
      dailyReceipts: Array(options.horizon).fill(0), overdueKg: 0, scheduledKg: 0, units: 0
    }));
    const byId = new Map(materials.map(m => [m.id, m]));
    const products = data.products.filter(p => byId.has(p.materialId)).map(p => ({ ...p, units: 0, baseUnits: 0, kg: 0 }));
    const productResults = new Map(products.map(p => [p.id, p]));
    for (const row of data.forecast.daily_forecasts) {
      const index = difference(row.date, start);
      if (index < 0 || index >= options.horizon || !byId.has(row.material_id)) continue;
      const p = productsById.get(row.product_id), product = productResults.get(row.product_id);
      if (!p || p.materialId !== row.material_id || !Number.isFinite(row.predicted_demand_units) || row.predicted_demand_units < 0) throw new Error('Inkonsistente Prognosedaten.');
      // Round once per product/day, then derive every aggregate from these same units.
      const units = Math.round(row.predicted_demand_units * options.demand / 100);
      const kg = units * p.gramsPerUnit * (1 + options.scrap / 100) / 1000;
      const material = byId.get(row.material_id);
      material.dailyUnits[index] += units;
      material.dailyKg[index] += kg;
      material.units += units;
      product.units += units;
      product.baseUnits += row.predicted_demand_units;
      product.kg += kg;
    }
    for (const order of data.orders) {
      const m = byId.get(order.materialId);
      if (!m) continue;
      // Already overdue at the snapshot: do not fabricate an arrival date.
      if (order.date < start) { m.overdueKg += order.kg; continue; }
      const arrival = addDays(order.date, options.delay), index = difference(arrival, start);
      if (index < options.horizon) { m.dailyReceipts[index] += order.kg; m.scheduledKg += order.kg; }
    }
    for (const m of materials) {
      let balance = m.startingKg;
      m.daily = dates.map((date, i) => {
        balance += m.dailyReceipts[i] - m.dailyKg[i];
        return { date, kg: m.dailyKg[i], units: m.dailyUnits[i], receiptKg: m.dailyReceipts[i], balanceKg: balance };
      });
      m.needKg = m.dailyKg.reduce((a, b) => a + b, 0);
      m.endKg = balance;
      m.minKg = Math.min(...m.daily.map(d => d.balanceKg));
      m.breach = m.daily.find(d => d.balanceKg < options.safety - 1e-9)?.date || null;
      m.shortage = m.daily.find(d => d.balanceKg < -1e-9)?.date || null;
      m.extraKg = Math.ceil(Math.max(0, options.safety - m.minKg) - 1e-9);
      m.extraKg = Math.max(0, m.extraKg);
      m.orderBy = m.breach ? addDays(m.breach, -m.leadDays - options.delay) : null;
      m.urgent = m.orderBy !== null && m.orderBy < start;
    }
    const daily = dates.map((date, i) => ({ date,
      kg: materials.reduce((sum, m) => sum + m.daily[i].kg, 0),
      units: materials.reduce((sum, m) => sum + m.daily[i].units, 0),
      receiptKg: materials.reduce((sum, m) => sum + m.daily[i].receiptKg, 0),
      balanceKg: materials.reduce((sum, m) => sum + m.daily[i].balanceKg, 0)
    }));
    return { options, start, end: dates.at(-1), materials, products, daily,
      units: products.reduce((sum, p) => sum + p.units, 0),
      needKg: materials.reduce((sum, m) => sum + m.needKg, 0),
      extraKg: materials.reduce((sum, m) => sum + m.extraKg, 0),
      critical: materials.filter(m => m.shortage).length,
      overdueKg: materials.reduce((sum, m) => sum + m.overdueKg, 0),
      firstBreach: materials.map(m => m.breach).filter(Boolean).sort()[0] || null
    };
  }
  global.PrintPilotForecast = Object.freeze({ calculate, defaults, presets, addDays });
})(globalThis);
