const { zohoRequest } = require('./zohoService');

const ORG = () => process.env.ZOHO_BOOKS_ORG_ID;

async function getRevenueSummary(period = 'this_month') {
  const periodMap = {
    today:      { filter_by: 'Date.Today' },
    this_week:  { filter_by: 'Date.ThisWeek' },
    this_month: { filter_by: 'Date.ThisMonth' },
    last_month: { filter_by: 'Date.LastMonth' },
    this_year:  { filter_by: 'Date.ThisFiscalYear' },
  };
  const filter = periodMap[period] || periodMap.this_month;

  const [invoices, payments] = await Promise.all([
    zohoRequest('GET', `/books/v3/invoices?organization_id=${ORG()}&${filter.filter_by}&status=paid&per_page=200`),
    zohoRequest('GET', `/books/v3/customerpayments?organization_id=${ORG()}&${filter.filter_by}&per_page=200`),
  ]);

  const totalInvoiced = invoices.invoices?.reduce((s, i) => s + (i.total || 0), 0) || 0;
  const totalReceived = payments.customerpayments?.reduce((s, p) => s + (p.amount || 0), 0) || 0;

  return {
    period,
    total_invoiced: totalInvoiced,
    total_received: totalReceived,
    invoice_count:  invoices.invoices?.length || 0,
    payment_count:  payments.customerpayments?.length || 0,
    currency: 'COP',
  };
}

async function createInvoiceForOrder(order) {
  const lineItems = order.items.map((item) => ({
    name:        item.name,
    description: item.sku,
    rate:        item.unit_price,
    quantity:    item.quantity,
  }));

  return zohoRequest('POST', `/books/v3/invoices?organization_id=${ORG()}`, {
    customer_id:  order.zoho_contact_id,
    reference_number: order.order_number,
    line_items:   lineItems,
    notes:        `Orden Mocana Motors #${order.order_number}`,
  });
}

module.exports = { getRevenueSummary, createInvoiceForOrder };
