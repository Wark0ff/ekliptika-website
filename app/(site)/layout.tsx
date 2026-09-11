import Analytics from '@/components/Analytics';
import CookieNotice from '@/components/CookieNotice';
import Header from '@/components/site/Header';
import Footer from '@/components/site/Footer';
import SmoothScroll from '@/components/site/SmoothScroll';
import Reveals from '@/components/site/Reveals';
import { JsonLd, organizationJsonLd, websiteJsonLd } from '@/lib/seo';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="v1">
      <a className="v1-skip" href="#main">Перейти к содержимому</a>
      <Analytics />
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={websiteJsonLd()} />
      <Header />
      <SmoothScroll />
      <Reveals />
      <main id="main">{children}</main>
      <Footer />
      <CookieNotice />
    </div>
  );
}
