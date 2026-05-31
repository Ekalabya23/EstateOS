export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[var(--color-warm-white)] py-20 px-4 font-sans">
      <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-3xl border border-[var(--color-mist)] shadow-[var(--shadow-editorial)]">
        <h1 className="text-3xl font-bold text-[var(--color-charcoal)] mb-6" style={{ fontFamily: 'var(--font-display)' }}>Terms of Service</h1>
        <p className="text-[12px] text-[var(--color-stone)] mb-8 uppercase tracking-widest">Last updated: May 28, 2026</p>
        
        <div className="space-y-6 text-[14px] text-[var(--color-stone)] leading-relaxed">
          <p>
            Welcome to EstateOS! These terms and conditions outline the rules and regulations for the use of EstateOS's Website, located at estateos.com.
          </p>
          <p>
            By accessing this website we assume you accept these terms and conditions. Do not continue to use EstateOS if you do not agree to take all of the terms and conditions stated on this page.
          </p>

          <h2 className="text-xl font-bold text-[var(--color-charcoal)] mt-8 mb-4" style={{ fontFamily: 'var(--font-display)' }}>Cookies</h2>
          <p>
            We employ the use of cookies. By accessing EstateOS, you agreed to use cookies in agreement with the EstateOS's Privacy Policy.
          </p>
          <p>
            Most interactive websites use cookies to let us retrieve the user's details for each visit. Cookies are used by our website to enable the functionality of certain areas to make it easier for people visiting our website.
          </p>

          <h2 className="text-xl font-bold text-[var(--color-charcoal)] mt-8 mb-4" style={{ fontFamily: 'var(--font-display)' }}>License</h2>
          <p>
            Unless otherwise stated, EstateOS and/or its licensors own the intellectual property rights for all material on EstateOS. All intellectual property rights are reserved. You may access this from EstateOS for your own personal use subjected to restrictions set in these terms and conditions.
          </p>

          <h2 className="text-xl font-bold text-[var(--color-charcoal)] mt-8 mb-4" style={{ fontFamily: 'var(--font-display)' }}>User Accounts</h2>
          <p>
            If you create an account on the Website, you are responsible for maintaining the security of your account and you are fully responsible for all activities that occur under the account and any other actions taken in connection with it.
          </p>
        </div>
      </div>
    </div>
  );
}
