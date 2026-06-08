// Shared defaults for merchant-demo (local + Vercel)
window.PAYMENTSGATE_DEFAULTS = {
    apiUrl: 'https://lol-production-14ea.up.railway.app/api/v1',
    apiKey: '',
    casinoId: '918cb745-6b24-404e-814b-9c69b96f4671'
};

window.loadPaymentsGateConfig = function () {
    const saved = JSON.parse(localStorage.getItem('paymentsgate_config') || '{}');
    const defaults = window.PAYMENTSGATE_DEFAULTS;
    const isHosted = !['localhost', '127.0.0.1'].includes(window.location.hostname);

    let apiUrl = saved.apiUrl || defaults.apiUrl;
    if (isHosted && /localhost|127\.0\.0\.1/.test(apiUrl)) {
        apiUrl = defaults.apiUrl;
    }

    return {
        apiUrl: apiUrl,
        apiKey: saved.apiKey || defaults.apiKey,
        casinoId: saved.casinoId || defaults.casinoId
    };
};
