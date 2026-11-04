// The site owns consent. This component never loads an analytics provider.
(() => {
  const key = "ll_consent";
  function mount() {
    const footer = document.querySelector('footer:not([aria-hidden="true"])');
    if (!footer || footer.querySelector('lf-client-signature')) return;
    const signature = document.createElement('lf-client-signature');
    signature.id = 'lf-client-footer';
    const root = signature.attachShadow({mode: 'open'});
    root.innerHTML = "<link rel=\"stylesheet\" href=\"/lf-signature/signature.css\"><div id=\"signature\"><div class=\"lf-layout\">\n <div class=\"lf-credit\"><a class=\"lf-care\" href=\"https://littlefightnyc.com/case-studies/logan-loans/\" aria-label=\"Cared For By LittleFightNYC.com. View case study for Logan Loans\"><span class=\"lf-mark\"><svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\" aria-hidden=\"true\" focusable=\"false\"><title>Little Fight NYC | Footer preview</title><circle cx=\"256\" cy=\"256\" r=\"256\" fill=\"#F97316\"/><g class=\"lf-steam\" fill=\"#fff\"><circle cx=\"164\" cy=\"128\" r=\"12\"/><circle cx=\"166\" cy=\"129\" r=\"9\"/></g><g class=\"lf-hull\"><g transform=\"translate(84 140.569) scale(0.41049315098263384)\"><g transform=\"translate(-297.159815,611.589160) scale(0.100000,-0.100000)\"\nfill=\"#FFFFFF\" stroke=\"none\">\n<path d=\"M6050 6114 c-317 -39 -527 -140 -620 -299 -42 -70 -38 -357 6 -506\n17 -57 20 -58 111 -24 189 70 312 107 448 136 128 27 475 30 623 5 51 -8 99\n-13 107 -9 18 6 20 85 5 195 -5 40 -14 105 -19 145 -30 230 -198 349 -506 358\n-66 2 -136 1 -155 -1z\"/>\n<path d=\"M8860 5354 c-152 -16 -582 -54 -908 -79 -326 -25 -534 -168 -639\n-439 -32 -82 -44 -234 -41 -541 4 -311 -2 -337 -84 -409 -50 -43 -86 -59 -165\n-72 -39 -6 -43 -4 -61 26 -11 17 -22 48 -26 68 -20 126 -56 422 -61 507 -4 55\n-13 143 -20 195 -7 52 -16 129 -20 170 -9 103 -32 235 -45 259 -42 80 -614\n120 -811 57 -24 -8 -91 -29 -149 -47 -134 -41 -282 -112 -315 -150 -29 -35\n-33 -95 -14 -208 5 -35 16 -132 24 -215 17 -180 51 -493 65 -591 16 -115 13\n-189 -8 -208 -27 -24 -99 -35 -281 -42 -343 -12 -525 -91 -693 -297 -135 -166\n-174 -337 -158 -685 9 -192 11 -198 52 -212 67 -24 1232 -9 1543 19 61 5 184\n14 275 20 150 10 459 46 585 69 28 5 79 12 115 16 65 6 161 23 295 52 39 8 90\n19 115 24 97 20 147 56 337 243 222 219 296 271 461 331 72 26 224 60 312 69\n30 4 87 13 125 21 146 30 243 47 330 61 50 7 144 25 210 39 66 14 149 30 185\n36 36 5 117 21 180 36 63 14 150 34 192 43 42 9 84 22 92 30 20 16 21 104 2\n260 -8 63 -17 178 -21 255 -3 77 -10 176 -15 220 -5 44 -14 145 -20 225 -16\n204 -41 324 -90 422 -97 193 -244 318 -461 394 -73 25 -281 40 -389 28z m420\n-582 c59 -26 108 -75 136 -137 26 -58 59 -299 70 -510 10 -189 2 -200 -141\n-215 -44 -4 -125 -13 -180 -19 -55 -6 -149 -15 -210 -21 -60 -5 -155 -15 -210\n-21 -154 -16 -212 -3 -275 63 -41 45 -59 109 -71 267 -17 213 -9 347 23 396\n83 127 183 168 478 195 69 6 152 15 185 20 80 11 140 6 195 -18z\"/>\n<path d=\"M10910 3414 c-30 -7 -118 -25 -195 -39 -77 -14 -174 -32 -215 -40\n-173 -34 -250 -48 -340 -60 -52 -8 -149 -25 -215 -40 -66 -14 -149 -30 -185\n-36 -36 -5 -94 -16 -130 -24 -177 -40 -249 -55 -290 -60 -25 -3 -74 -12 -110\n-20 -116 -25 -223 -46 -310 -60 -47 -7 -107 -18 -135 -24 -105 -22 -213 -42\n-300 -56 -219 -34 -315 -90 -490 -286 -107 -119 -155 -162 -249 -223 -74 -49\n-231 -113 -316 -131 -206 -42 -369 -72 -450 -80 -30 -3 -100 -12 -155 -20\n-153 -22 -452 -53 -625 -65 -85 -6 -202 -15 -259 -20 -506 -45 -1428 -36\n-2266 22 -479 33 -451 32 -522 13 -190 -52 -231 -306 -122 -761 16 -66 36\n-138 44 -160 9 -21 22 -52 28 -69 53 -134 166 -309 251 -389 158 -147 285\n-213 506 -262 122 -27 888 -35 3235 -31 2488 3 2311 -1 2575 61 176 41 267 74\n427 155 376 187 669 473 900 876 78 137 179 375 198 465 4 19 22 87 40 150\n103 364 149 896 92 1058 -27 76 -65 126 -117 152 -47 24 -210 27 -300 4z\nm-515 -678 c32 -14 72 -46 107 -85 51 -57 58 -69 69 -132 26 -144 -23 -264\n-136 -333 -47 -29 -55 -31 -155 -31 -100 0 -108 2 -155 31 -209 128 -187 444\n38 549 71 33 163 34 232 1z\"/>\n</g></g></g></svg></span><span class=\"lf-lockup\"><span class=\"lf-caption\" aria-hidden=\"true\"><span class=\"lf-by\">Cared For By</span><span class=\"lf-destination\">View case study</span></span><strong class=\"lf-wave\" aria-hidden=\"true\"><span style=\"--i:0\">L</span><span style=\"--i:1\">i</span><span style=\"--i:2\">t</span><span style=\"--i:3\">t</span><span style=\"--i:4\">l</span><span style=\"--i:5\">e</span><span style=\"--i:6\">F</span><span style=\"--i:7\">i</span><span style=\"--i:8\">g</span><span style=\"--i:9\">h</span><span style=\"--i:10\">t</span><span style=\"--i:11\">N</span><span style=\"--i:12\">Y</span><span style=\"--i:13\">C</span><span style=\"--i:14\">.</span><span style=\"--i:15\">c</span><span style=\"--i:16\">o</span><span style=\"--i:17\">m</span></strong></span></a></div>\n <div class=\"lf-client\"><strong>Logan Loans</strong><a href=\"https://logan.loans/\">logan.loans</a></div>\n <div class=\"lf-controls\"><section class=\"lf-consent\" aria-label=\"Analytics preferences\"><button value=\"yes\" type=\"button\">Yes</button><button value=\"no\" type=\"button\">No</button><span>Allow analytics &amp; cookies?</span></section><button class=\"lf-privacy\" type=\"button\" hidden>Cookie settings</button></div>\n</div></div>";
    footer.append(signature);
    for (const link of footer.querySelectorAll('a[href*="littlefightnyc.com"]')) {
      if (/^(www\.)?littlefightnyc\.com$/.test(link.hostname)) { link.hidden = true; link.style.setProperty('display', 'none', 'important'); }
    }
    const panel = root.querySelector('.lf-consent');
    const settings = root.querySelector('.lf-privacy');
    const robots = document.querySelector('meta[name="robots" i]')?.content || '';
    if (/\bnoindex\b/i.test(robots)) {
      const privacy = document.createElement('a');
      privacy.className = 'lf-privacy';
      privacy.href = "/privacy";
      privacy.textContent = 'Privacy';
      root.querySelector('.lf-controls').replaceChildren(privacy);
      return;
    }
    function remember() {
      try {
        const stored = localStorage.getItem(key);
        const known = ['granted','denied'].includes(stored);
        panel.hidden = Boolean(known);
        settings.hidden = !known;
      } catch { panel.hidden = false; settings.hidden = true; }
    }
    remember();
    if (location.hash === '#lf-client-footer') requestAnimationFrame(() => signature.scrollIntoView({block:'end'}));
    settings.onclick = () => { settings.hidden = true; panel.hidden = false; panel.querySelector('button').focus(); };
    panel.onclick = event => {
      const button = event.target.closest('button');
      if (!button) return;
      const allow = button.value === 'yes';
      if (typeof setConsent === 'function') setConsent(allow);
      remember();
      if (!settings.hidden) settings.focus();
    };
    window.addEventListener('storage', remember);
  }
  mount();

})();
