'use client'; // Since this component uses client-side scripts

const AdUnit = () => {
  // Ensure the ad script only runs on the client side
  if (typeof window !== 'undefined') {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }

  return (
    <div className="ad-container" style={{ margin: '20px 0', textAlign: 'center' }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-8535596092968633"
        data-ad-slot="9488515776" // Updated with your specific ad slot ID
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default AdUnit;