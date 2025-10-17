module.exports=[89578,a=>{a.v({className:"geist_a71539c9-module__T19VSG__className",variable:"geist_a71539c9-module__T19VSG__variable"})},35214,a=>{a.v({className:"geist_mono_8d43a2aa-module__8Li5zG__className",variable:"geist_mono_8d43a2aa-module__8Li5zG__variable"})},31959,a=>{"use strict";a.s(["default",()=>b]);let b=(0,a.i(11857).registerClientReference)(function(){throw Error("Attempted to call the default export of [project]/src/components/Navbar.tsx <module evaluation> from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/src/components/Navbar.tsx <module evaluation>","default")},57779,a=>{"use strict";a.s(["default",()=>b]);let b=(0,a.i(11857).registerClientReference)(function(){throw Error("Attempted to call the default export of [project]/src/components/Navbar.tsx from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/src/components/Navbar.tsx","default")},10356,a=>{"use strict";a.i(31959);var b=a.i(57779);a.n(b)},27572,a=>{"use strict";a.s(["default",()=>i,"metadata",()=>h],27572);var b=a.i(7997),c=a.i(89578);let d={className:c.default.className,style:{fontFamily:"'Geist', 'Geist Fallback'",fontStyle:"normal"}};null!=c.default.variable&&(d.variable=c.default.variable);var e=a.i(35214);let f={className:e.default.className,style:{fontFamily:"'Geist Mono', 'Geist Mono Fallback'",fontStyle:"normal"}};null!=e.default.variable&&(f.variable=e.default.variable);var g=a.i(10356);let h={title:"PawStars - 강아지 사주와 궁합",description:"강아지의 사주와 견주와의 궁합을 AI로 분석해보세요"};function i({children:a}){return(0,b.jsxs)("html",{lang:"en",children:[(0,b.jsxs)("head",{children:[(0,b.jsx)("meta",{name:"viewport",content:"width=device-width, initial-scale=1, viewport-fit=cover"}),(0,b.jsx)("meta",{name:"theme-color",media:"(prefers-color-scheme: light)",content:"#ffffff"}),(0,b.jsx)("meta",{name:"theme-color",media:"(prefers-color-scheme: dark)",content:"#0a0a0a"}),(0,b.jsx)("meta",{name:"apple-mobile-web-app-capable",content:"yes"}),(0,b.jsx)("meta",{name:"apple-mobile-web-app-status-bar-style",content:"black-translucent"}),(0,b.jsx)("link",{rel:"apple-touch-icon",href:"/apple-touch-icon.png"}),(0,b.jsx)("link",{rel:"icon",type:"image/png",sizes:"32x32",href:"/favicon-32x32.png"}),(0,b.jsx)("link",{rel:"icon",type:"image/png",sizes:"16x16",href:"/favicon-16x16.png"}),(0,b.jsx)("link",{rel:"manifest",href:"/manifest.webmanifest"}),(0,b.jsx)("script",{defer:!0,src:"https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js",crossOrigin:"anonymous"}),(0,b.jsx)("script",{dangerouslySetInnerHTML:{__html:`window.__KAKAO_API_KEY__ = '${process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY??""}';`}})]}),(0,b.jsxs)("body",{className:`${d.variable} ${f.variable} antialiased`,style:{paddingTop:"env(safe-area-inset-top)",paddingBottom:"env(safe-area-inset-bottom)",paddingLeft:"env(safe-area-inset-left)",paddingRight:"env(safe-area-inset-right)"},children:[(0,b.jsx)(g.default,{}),a,(0,b.jsx)("script",{dangerouslySetInnerHTML:{__html:"(function(){try{var w=window as any; if(w.Kakao && !w.Kakao.isInitialized?.() && w.__KAKAO_API_KEY__){w.Kakao.init(w.__KAKAO_API_KEY__);} }catch(e){}})();"}}),(0,b.jsx)("script",{dangerouslySetInnerHTML:{__html:`
              (function() {
                try {
                  if ('AmbientLightSensor' in window) {
                    const sensor = new AmbientLightSensor({ frequency: 1 });
                    sensor.addEventListener('reading', () => {
                      const lux = sensor.illuminance;
                      const html = document.documentElement;
                      if (lux < 10) {
                        html.classList.add('dark');
                        html.style.colorScheme = 'dark';
                      } else if (lux > 50) {
                        html.classList.remove('dark');
                        html.style.colorScheme = 'light';
                      }
                    });
                    sensor.start();
                  } else {
                    // Fallback: use system preference
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
                    const updateTheme = (e) => {
                      const html = document.documentElement;
                      if (e.matches) {
                        html.classList.add('dark');
                        html.style.colorScheme = 'dark';
                      } else {
                        html.classList.remove('dark');
                        html.style.colorScheme = 'light';
                      }
                    };
                    updateTheme(prefersDark);
                    prefersDark.addEventListener('change', updateTheme);
                  }
                } catch (e) {
                  // Fallback to system preference
                  try {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
                    const updateTheme = (e) => {
                      const html = document.documentElement;
                      if (e.matches) {
                        html.classList.add('dark');
                        html.style.colorScheme = 'dark';
                      } else {
                        html.classList.remove('dark');
                        html.style.colorScheme = 'light';
                      }
                    };
                    updateTheme(prefersDark);
                    prefersDark.addEventListener('change', updateTheme);
                  } catch (e2) {}
                }
              })();
            `}}),(0,b.jsx)("script",{dangerouslySetInnerHTML:{__html:"if('serviceWorker' in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('/sw.js').catch(function(){})})}"}})]})]})}}];

//# sourceMappingURL=%5Broot-of-the-server%5D__2d10a56d._.js.map