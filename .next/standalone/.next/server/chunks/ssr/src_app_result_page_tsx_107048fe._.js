module.exports=[68270,a=>{"use strict";a.s(["default",()=>f]);var b=a.i(87924),c=a.i(72131),d=a.i(50944);function e(){let a=(0,d.useSearchParams)(),e=(0,d.useRouter)(),[f,g]=(0,c.useState)(null),[h,i]=(0,c.useState)(null),j=(0,c.useMemo)(()=>f?`🐶 PawStars 결과
이름: ${f.dog.name}
견종: ${f.dog.breed}
${f.dog.birth?`생일: ${f.dog.birth}
`:""}${"unknown"!==f.dog.sex?`성별: ${"male"===f.dog.sex?"수컷":"암컷"}${!0===f.dog.neutered?" (중성화)":!1===f.dog.neutered?" (미중성화)":""}
`:""}${f.owner?.name?`주인: ${f.owner.name}
`:""}${f.owner?.earthlyBranch?`주인 12지지: ${f.owner.earthlyBranch}
`:""}${f.fortune?`
오늘의 운세: 
${f.fortune}
`:""}${f.compatibility?`
🐾 궁합: 
${f.compatibility}`:""}`:"",[f]);(0,c.useEffect)(()=>{let b=a.get("key");if(!b)return void i("결과 키가 없어요. 처음부터 다시 진행해 주세요.");try{let a=sessionStorage.getItem(`pawstars:${b}`);if(!a)return void i("저장된 결과를 찾을 수 없어요. 다시 진행해 주세요.");let c=JSON.parse(a);g(c)}catch{i("결과를 불러오는 중 오류가 발생했어요.")}},[a]);let k=async()=>{if(f)try{let a=globalThis;if(a?.Kakao&&a.Kakao.isInitialized?.())return void a.Kakao.Share.sendDefault({objectType:"text",text:j,link:{mobileWebUrl:location.href,webUrl:location.href}});if(navigator.share)return void await navigator.share({title:"PawStars 결과",text:j});await navigator.clipboard.writeText(j),alert("결과를 클립보드에 복사했어요.")}catch{try{await navigator.clipboard.writeText(j),alert("결과를 클립보드에 복사했어요.")}catch{alert("공유에 실패했어요. 다시 시도해 주세요.")}}};return(0,b.jsxs)("div",{className:"min-h-screen w-full max-w-xl mx-auto px-4 py-5 sm:px-6 sm:py-10",children:[(0,b.jsx)("h1",{className:"text-xl sm:text-2xl font-bold mb-5 sm:mb-6",children:"PawStars 결과"}),h?(0,b.jsx)("div",{className:"text-red-500 text-sm",children:h}):f?(0,b.jsxs)("div",{className:"space-y-6",children:[f.fortune?(0,b.jsx)("div",{className:"rounded-lg border border-black/10 dark:border-white/20 p-4 whitespace-pre-wrap leading-6",children:f.fortune}):null,f.compatibility?(0,b.jsx)("div",{className:"rounded-lg border border-black/10 dark:border-white/20 p-4 whitespace-pre-wrap leading-6",children:f.compatibility}):null,(0,b.jsxs)("div",{className:"flex flex-col sm:flex-row gap-3 pt-2",children:[(0,b.jsx)("button",{className:"w-full sm:w-auto rounded-md bg-black text-white dark:bg-white dark:text-black px-4 py-3",onClick:()=>e.push("/"),children:"다시 분석하기"}),(0,b.jsx)("button",{className:"w-full sm:w-auto rounded-md border border-black/10 dark:border-white/20 px-4 py-3",onClick:k,children:"결과 공유하기"})]})]}):(0,b.jsx)("div",{children:"불러오는 중..."})]})}function f(){return(0,b.jsx)(c.Suspense,{fallback:(0,b.jsx)("div",{className:"min-h-screen w-full max-w-xl mx-auto px-4 py-5 sm:px-6 sm:py-10",children:"불러오는 중..."}),children:(0,b.jsx)(e,{})})}}];

//# sourceMappingURL=src_app_result_page_tsx_107048fe._.js.map