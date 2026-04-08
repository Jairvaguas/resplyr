# SOP: Soporte Billing Anual

## Objetivo
Implementar el soporte de ciclos de facturación (mensual y anual) en el plan de pago con Mercado Pago para los tres planes de la aplicación.

## Entradas
- En `app/page.tsx`: 
  Toggle de "Mensual / Anual".
- En `app/api/billing/create-subscription/route.ts`:
  `plan`: "starter" | "growth" | "business"
  `billing_cycle`: "monthly" | "annual"

## Salidas
1. Modificación de los enlaces en el pricing para enviar a `/sign-up?plan=X&cycle=Y`.
2. Lógica backend que elige el `transaction_amount` correcto en base a:
   `monthly: { starter: 19, growth: 39, business: 79 }`
   `annual: { starter: 192, annual_growth: 396, business: 804 }`
3. Ajuste de MercadoPago `auto_recurring`: `frequency_type` a "years" si cycle es "annual".
4. Texto descriptivo `reason` ajustado para reflejar ciclo, ej. "Resplyr Plan Growth - Anual".

## Trampas Identificadas
- Mercado Pago requiere `frequency_type: "years"` y `frequency: 1` para cobros anuales. En vez del string estático "months".
- Cuidar que el default `billing_cycle` no envíe `annual_growth` cuando se espera `growth` para obtener el objeto. Uso seguro de ternarios/switch para extraer los IDs `plan`.
- La prop del botón en `page.tsx` debe actualizar dinámicamente el `href`. Usar template literals o cambiar de `<Link>` a usar algo dinámico.
