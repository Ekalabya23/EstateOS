export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[var(--color-warm-white)] py-20 px-4 font-sans">
      <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-3xl border border-[var(--color-mist)] shadow-[var(--shadow-editorial)]">
        <h1 className="text-3xl font-bold text-[var(--color-charcoal)] mb-6" style={{ fontFamily: 'var(--font-display)' }}>Privacy Policy</h1>
        <p className="text-[12px] text-[var(--color-stone)] mb-8 uppercase tracking-widest">Last updated: May 28, 2026</p>
        
        <div className="space-y-6 text-[14px] text-[var(--color-stone)] leading-relaxed">
          <p>
            At EstateOS, we take your privacy seriously. This Privacy Policy describes how your personal information is collected, used, and shared when you visit or make a purchase from estateos.com (the "Site").
          </p>

          <h2 className="text-xl font-bold text-[var(--color-charcoal)] mt-8 mb-4" style={{ fontFamily: 'var(--font-display)' }}>Personal Information We Collect</h2>
          <p>
            When you visit the Site, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device.
          </p>
          <p>
            Additionally, when you make a purchase or attempt to make a purchase through the Site, we collect certain information from you, including your name, billing address, shipping address, payment information (including credit card numbers), email address, and phone number.
          </p>

          <h2 className="text-xl font-bold text-[var(--color-charcoal)] mt-8 mb-4" style={{ fontFamily: 'var(--font-display)' }}>How Do We Use Your Personal Information?</h2>
          <p>
            We use the Order Information that we collect generally to fulfill any orders placed through the Site (including processing your payment information, arranging for shipping, and providing you with invoices and/or order confirmations).
          </p>

          <h2 className="text-xl font-bold text-[var(--color-charcoal)] mt-8 mb-4" style={{ fontFamily: 'var(--font-display)' }}>Data Retention</h2>
          <p>
            When you place an order through the Site, we will maintain your Order Information for our records unless and until you ask us to delete this information.
          </p>
        </div>
      </div>
    </div>
  );
}
