1:"$Sreact.fragment"
2:I[45678,["/_next/static/chunks/ab51c5fc6d310dce.js"],"default"]
3:I[39756,["/_next/static/chunks/ff1a16fafef87110.js","/_next/static/chunks/7dd66bdf8a7e5707.js"],"default"]
4:I[37457,["/_next/static/chunks/ff1a16fafef87110.js","/_next/static/chunks/7dd66bdf8a7e5707.js"],"default"]
a:I[68027,["/_next/static/chunks/ab51c5fc6d310dce.js"],"default"]
:HL["/_next/static/chunks/a0799417731c984e.css","style"]
:HL["/_next/static/media/797e433ab948586e-s.p.dbea232f.woff2","font",{"crossOrigin":"","type":"font/woff2"}]
:HL["/_next/static/media/caa3a2e1cccd8315-s.p.853070df.woff2","font",{"crossOrigin":"","type":"font/woff2"}]
5:T938,
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
            0:{"P":null,"b":"6v7kUs0IGoUcv29eEZxO9","p":"","c":["","compatibility"],"i":false,"f":[[["",{"children":["compatibility",{"children":["__PAGE__",{}]}]},"$undefined","$undefined",true],["",["$","$1","c",{"children":[[["$","link","0",{"rel":"stylesheet","href":"/_next/static/chunks/a0799417731c984e.css","precedence":"next","crossOrigin":"$undefined","nonce":"$undefined"}],["$","script","script-0",{"src":"/_next/static/chunks/ab51c5fc6d310dce.js","async":true,"nonce":"$undefined"}]],["$","html",null,{"lang":"en","children":[["$","head",null,{"children":[["$","meta",null,{"name":"viewport","content":"width=device-width, initial-scale=1, viewport-fit=cover"}],["$","meta",null,{"name":"theme-color","media":"(prefers-color-scheme: light)","content":"#ffffff"}],["$","meta",null,{"name":"theme-color","media":"(prefers-color-scheme: dark)","content":"#0a0a0a"}],["$","meta",null,{"name":"apple-mobile-web-app-capable","content":"yes"}],["$","meta",null,{"name":"apple-mobile-web-app-status-bar-style","content":"black-translucent"}],["$","link",null,{"rel":"apple-touch-icon","href":"/apple-touch-icon.png"}],["$","link",null,{"rel":"icon","type":"image/png","sizes":"32x32","href":"/favicon-32x32.png"}],["$","link",null,{"rel":"icon","type":"image/png","sizes":"16x16","href":"/favicon-16x16.png"}],["$","link",null,{"rel":"manifest","href":"/manifest.webmanifest"}],["$","script",null,{"defer":true,"src":"https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js","crossOrigin":"anonymous"}],["$","script",null,{"dangerouslySetInnerHTML":{"__html":"window.__KAKAO_API_KEY__ = '';"}}]]}],["$","body",null,{"className":"geist_a71539c9-module__T19VSG__variable geist_mono_8d43a2aa-module__8Li5zG__variable antialiased","style":{"paddingTop":"env(safe-area-inset-top)","paddingBottom":"env(safe-area-inset-bottom)","paddingLeft":"env(safe-area-inset-left)","paddingRight":"env(safe-area-inset-right)"},"children":[["$","$L2",null,{}],["$","$L3",null,{"parallelRouterKey":"children","error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$L4",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":[[["$","title",null,{"children":"404: This page could not be found."}],["$","div",null,{"style":{"fontFamily":"system-ui,\"Segoe UI\",Roboto,Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\"","height":"100vh","textAlign":"center","display":"flex","flexDirection":"column","alignItems":"center","justifyContent":"center"},"children":["$","div",null,{"children":[["$","style",null,{"dangerouslySetInnerHTML":{"__html":"body{color:#000;background:#fff;margin:0}.next-error-h1{border-right:1px solid rgba(0,0,0,.3)}@media (prefers-color-scheme:dark){body{color:#fff;background:#000}.next-error-h1{border-right:1px solid rgba(255,255,255,.3)}}"}}],["$","h1",null,{"className":"next-error-h1","style":{"display":"inline-block","margin":"0 20px 0 0","padding":"0 23px 0 0","fontSize":24,"fontWeight":500,"verticalAlign":"top","lineHeight":"49px"},"children":404}],["$","div",null,{"style":{"display":"inline-block"},"children":["$","h2",null,{"style":{"fontSize":14,"fontWeight":400,"lineHeight":"49px","margin":0},"children":"This page could not be found."}]}]]}]}]],[]],"forbidden":"$undefined","unauthorized":"$undefined"}],["$","script",null,{"dangerouslySetInnerHTML":{"__html":"(function(){try{var w=window as any; if(w.Kakao && !w.Kakao.isInitialized?.() && w.__KAKAO_API_KEY__){w.Kakao.init(w.__KAKAO_API_KEY__);} }catch(e){}})();"}}],["$","script",null,{"dangerouslySetInnerHTML":{"__html":"$5"}}],"$L6"]}]]}]]}],{"children":["compatibility","$L7",{"children":["__PAGE__","$L8",{},null,false]},null,false]},null,false],"$L9",false]],"m":"$undefined","G":["$a",["$Lb"]],"s":false,"S":true}
c:I[47257,["/_next/static/chunks/ff1a16fafef87110.js","/_next/static/chunks/7dd66bdf8a7e5707.js"],"ClientPageRoot"]
d:I[85528,["/_next/static/chunks/ab51c5fc6d310dce.js","/_next/static/chunks/f1f355a2c51fbc41.js"],"default"]
10:I[97367,["/_next/static/chunks/ff1a16fafef87110.js","/_next/static/chunks/7dd66bdf8a7e5707.js"],"OutletBoundary"]
12:I[11533,["/_next/static/chunks/ff1a16fafef87110.js","/_next/static/chunks/7dd66bdf8a7e5707.js"],"AsyncMetadataOutlet"]
14:I[97367,["/_next/static/chunks/ff1a16fafef87110.js","/_next/static/chunks/7dd66bdf8a7e5707.js"],"ViewportBoundary"]
16:I[97367,["/_next/static/chunks/ff1a16fafef87110.js","/_next/static/chunks/7dd66bdf8a7e5707.js"],"MetadataBoundary"]
17:"$Sreact.suspense"
6:["$","script",null,{"dangerouslySetInnerHTML":{"__html":"if('serviceWorker' in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('/sw.js').catch(function(){})})}"}}]
7:["$","$1","c",{"children":[null,["$","$L3",null,{"parallelRouterKey":"children","error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$L4",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":"$undefined","forbidden":"$undefined","unauthorized":"$undefined"}]]}]
8:["$","$1","c",{"children":[["$","$Lc",null,{"Component":"$d","searchParams":{},"params":{},"promises":["$@e","$@f"]}],[["$","script","script-0",{"src":"/_next/static/chunks/f1f355a2c51fbc41.js","async":true,"nonce":"$undefined"}]],["$","$L10",null,{"children":["$L11",["$","$L12",null,{"promise":"$@13"}]]}]]}]
9:["$","$1","h",{"children":[null,[["$","$L14",null,{"children":"$L15"}],["$","meta",null,{"name":"next-size-adjust","content":""}]],["$","$L16",null,{"children":["$","div",null,{"hidden":true,"children":["$","$17",null,{"fallback":null,"children":"$L18"}]}]}]]}]
b:["$","link","0",{"rel":"stylesheet","href":"/_next/static/chunks/a0799417731c984e.css","precedence":"next","crossOrigin":"$undefined","nonce":"$undefined"}]
e:{}
f:"$8:props:children:0:props:params"
15:[["$","meta","0",{"charSet":"utf-8"}],["$","meta","1",{"name":"viewport","content":"width=device-width, initial-scale=1"}]]
11:null
19:I[27201,["/_next/static/chunks/ff1a16fafef87110.js","/_next/static/chunks/7dd66bdf8a7e5707.js"],"IconMark"]
13:{"metadata":[["$","title","0",{"children":"PawStars - 강아지 사주와 궁합"}],["$","meta","1",{"name":"description","content":"강아지의 사주와 견주와의 궁합을 AI로 분석해보세요"}],["$","link","2",{"rel":"icon","href":"/favicon.ico?favicon.e5039915.ico","sizes":"32x32","type":"image/x-icon"}],["$","$L19","3",{}]],"error":null,"digest":"$undefined"}
18:"$13:metadata"
