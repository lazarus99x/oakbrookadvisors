"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

export function SmartsuppChat() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      <Script id="smartsupp-chat" strategy="afterInteractive">
        {`
          var _smartsupp = window._smartsupp || {};
          _smartsupp.key = 'b9703d92995ac0881c6bb8830c1b7a0929733400';
          window._smartsupp = _smartsupp;
          window.smartsupp||(function(d) {
            var s,c,o=smartsupp=function(){ o._.push(arguments)};o._=[];
            s=d.getElementsByTagName('script')[0];c=d.createElement('script');
            c.type='text/javascript';c.charset='utf-8';c.async=true;
            c.src='https://www.smartsuppchat.com/loader.js?';s.parentNode.insertBefore(c,s);
          })(document);
        `}
      </Script>
      <noscript>
        Powered by{" "}
        <a href="https://www.smartsupp.com" target="_blank" rel="noreferrer">
          Smartsupp
        </a>
      </noscript>
    </>
  );
}
