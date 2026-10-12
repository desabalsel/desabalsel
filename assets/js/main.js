/* ============ Profil Desa Balasuna Selatan — interaksi ============ */
(function () {
  "use strict";

  var doc = document;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, r) { return (r || doc).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || doc).querySelectorAll(s)); };

  /* ================= IKON ================= */
  var ICONS = window.ICONS || {};
  function paintIcons(root) {
    $$("[data-ico]", root).forEach(function (el) {
      var svg = ICONS[el.dataset.ico];
      if (svg && el.dataset.painted !== "1") {
        el.innerHTML = svg;
        el.dataset.painted = "1";
      }
    });
  }
  paintIcons();

  /* ================= SMOOTH SCROLL (Lenis) ================= */
  var lenis = null;
  if (!reduce && typeof window.Lenis === "function") {
    lenis = new window.Lenis({ duration: 0.95, smoothWheel: true, touchMultiplier: 1.6 });
    (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(0);
  }

  /* ================= DRAWER MOBILE ================= */
  var burger = $("#burger");
  var drawer = $("#drawer");
  function setDrawer(open) {
    if (!drawer || !burger) return;
    drawer.classList.toggle("hidden", !open);
    burger.setAttribute("aria-expanded", String(open));
    var ico = burger.firstElementChild;
    if (ico && ICONS[open ? "x" : "menu"]) {
      ico.innerHTML = ICONS[open ? "x" : "menu"];
      ico.dataset.ico = open ? "x" : "menu";
    }
  }
  if (burger) burger.addEventListener("click", function () {
    setDrawer(drawer.classList.contains("hidden"));
  });
  if (drawer) drawer.addEventListener("click", function (e) {
    if (e.target.closest("a")) setDrawer(false);
  });

  /* ================= TAUTAN ANCHOR ================= */
  doc.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute("href");
    if (!id || id.length < 2) return;
    var target = doc.querySelector(id);
    if (!target) return;
    e.preventDefault();
    setDrawer(false);
    if (lenis) lenis.scrollTo(target, { offset: -96 });
    else target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    history.replaceState(null, "", id);
  });

  /* ================= SCROLL SPY + NAV STATE ================= */
  var navLinks = $$("#nav .nav-link");
  var spySections = [];
  navLinks.forEach(function (a) {
    (a.getAttribute("data-spy") || "").split(/\s+/).forEach(function (id) {
      if (!id) return;
      var el = doc.getElementById(id);
      if (el) spySections.push({ el: el, link: a });
    });
  });
  spySections.sort(function (p, q) { return p.el.offsetTop - q.el.offsetTop; });
  var navbar = $("#navbar");
  var toTop = $("#toTop");

  var lastActive = navLinks.filter(function (a) { return a.classList.contains("active"); })[0] || null;
  var lastScrolled = null, lastToTop = null;
  function onScroll() {
    var sy = window.scrollY || doc.documentElement.scrollTop;
    var y = sy + 140;
    var curLink = null;
    for (var i = 0; i < spySections.length; i++) {
      if (spySections[i].el.offsetTop <= y) curLink = spySections[i].link;
    }
    if (curLink && curLink !== lastActive) {
      lastActive = curLink;
      navLinks.forEach(function (a) {
        a.classList.toggle("active", a === curLink);
      });
    }
    var scrolled = sy > 30;
    if (scrolled !== lastScrolled) {
      lastScrolled = scrolled;
      if (navbar) navbar.classList.toggle("is-scrolled", scrolled);
    }
    var show = sy > 700;
    if (show !== lastToTop) {
      lastToTop = show;
      if (toTop) {
        toTop.style.opacity = show ? "1" : "0";
        toTop.style.transform = show ? "none" : "";
      }
    }
  }
  if (toTop) toTop.addEventListener("click", function () {
    if (lenis) lenis.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  });

  /* ============ JEDA ANIMASI SAAT SCROLL ============ */
  var htmlEl = doc.documentElement;
  var idleTimer = null;
  function markScrolling() {
    if (!htmlEl.classList.contains("is-scrolling")) htmlEl.classList.add("is-scrolling");
    if (idleTimer) clearTimeout(idleTimer);
    idleTimer = setTimeout(function () {
      htmlEl.classList.remove("is-scrolling");
      idleTimer = null;
    }, 180);
  }

  /* animasi dekoratif dijeda saat elemennya keluar layar */
  if ("IntersectionObserver" in window) {
    var animIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        en.target.classList.toggle("anim-hold", !en.isIntersecting);
      });
    }, { rootMargin: "80px 0px" });
    $$(".animate-kenburns, .animate-floaty, .animate-floatySlow, .animate-bob, .marquee-track")
      .forEach(function (el) { animIO.observe(el); });
  }

  /* ================= REVEAL ================= */
  var revealTargets = $$("[data-reveal]");
  if ("IntersectionObserver" in window && !reduce) {
    var revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add("is-in");
        revealIO.unobserve(en.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    revealTargets.forEach(function (el) { revealIO.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ================= COUNTER ================= */
  function runCount(el) {
    if (el.dataset.done) return;
    el.dataset.done = "1";
    var target = parseFloat(el.dataset.count) || 0;
    if (reduce) { el.textContent = target.toLocaleString("id-ID"); return; }
    var dur = 1500, t0 = null;
    function step(t) {
      if (t0 === null) t0 = t;
      var p = Math.min(1, (t - t0) / dur);
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * e).toLocaleString("id-ID");
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counters = $$("[data-count]");
  if ("IntersectionObserver" in window) {
    var countIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        runCount(en.target);
        countIO.unobserve(en.target);
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { countIO.observe(el); });
  } else {
    counters.forEach(runCount);
  }

  /* ================= PARALLAX ================= */
  var pxEls = $$("[data-parallax]").map(function (el) {
    return { el: el, sp: parseFloat(el.dataset.parallax) || 0, base: 0, h: 0, cur: null };
  }).filter(function (o) { return o.sp !== 0; });

  var vh = window.innerHeight;
  function measureParallax() {
    vh = window.innerHeight;
    var sy = window.scrollY || doc.documentElement.scrollTop;
    pxEls.forEach(function (o) {
      var r = o.el.getBoundingClientRect();
      o.base = r.top + sy - (o.cur || 0);
      o.h = r.height;
    });
  }

  function applyParallax() {
    var sy = window.scrollY || doc.documentElement.scrollTop;
    for (var i = 0; i < pxEls.length; i++) {
      var o = pxEls[i];
      var lim = Math.max(24, o.h * 0.11);
      if (o.base - sy > vh + lim + 240 || o.base + o.h - sy < -lim - 240) continue;
      var y = -((o.base - sy) + o.h / 2 - vh / 2) * o.sp;
      if (y > lim) y = lim;
      else if (y < -lim) y = -lim;
      if (o.cur !== null && Math.abs(y - o.cur) < 0.5) continue;
      o.cur = y;
      o.el.style.translate = "0 " + y.toFixed(1) + "px";
    }
  }

  var ticking = false;
  function tick() {
    ticking = false;
    markScrolling();
    onScroll();
    if (!reduce) applyParallax();
  }
  function requestTick() {
    if (!ticking) { ticking = true; requestAnimationFrame(tick); }
  }
  window.addEventListener("scroll", requestTick, { passive: true });
  window.addEventListener("resize", function () { measureParallax(); requestTick(); }, { passive: true });
  window.addEventListener("load", function () { measureParallax(); requestTick(); });
  if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(function () { measureParallax(); requestTick(); });
  measureParallax();
  tick();

  /* ================= DATA GRAFIK ================= */
  var DUSUN = ["Mokora", "Kakado", "Toroho"];
  var C = {
    penduduk2022: [
      { name: "Laki-laki", color: "#0d6e5f", values: [142, 91, 87] },
      { name: "Perempuan", color: "#e0a028", values: [121, 102, 94] }
    ],
    umur: [
      { name: "Laki-laki", color: "#0d6e5f", values: [4, 23, 55, 116, 37, 27] },
      { name: "Perempuan", color: "#e0a028", values: [5, 22, 57, 115, 41, 29] }
    ],
    umurCat: ["<1 th", "1–4 th", "5–14 th", "15–39 th", "40–64 th", "65+ th"],
    pendidikan: [
      { name: "Jumlah penduduk", color: "#0d6e5f", values: [181, 145, 91, 158, 9, 53] }
    ],
    pendidikanCat: ["Tdk tamat SD", "Tamat SD", "Tamat SMP", "Tamat SLTA", "Diploma", "S1/S2"]
  };

  var BARS = {
    luas: {
      title: "Penggunaan Lahan (hektare)",
      unit: "Ha",
      items: [
        ["Tanah Perkebunan", 100], ["Tanah Pertanian", 82], ["Hutan Hak", 79.5],
        ["Tanah Pemukiman", 17.5], ["Tanah Pekarangan", 2.5], ["Lahan Peternakan", 0.5]
      ]
    },
    pekerjaan: {
      title: "Mata Pencaharian Penduduk (jiwa)",
      unit: "jiwa",
      items: [
        ["Tidak bekerja", 334], ["Petani", 138], ["Wiraswasta", 57], ["Nelayan", 40],
        ["Pelaut", 17], ["Honorer", 9], ["Perangkat desa", 9], ["PNS", 8],
        ["Pedagang", 8], ["BPD", 5], ["Pertukangan", 4], ["Perbengkelan", 3],
        ["Dukun beranak", 2]
      ]
    },
    penduduk2026: {
      title: "Penduduk per Dusun (jiwa)",
      unit: "jiwa",
      items: [["Mokora", 255], ["Toroho", 195], ["Kakado", 180]]
    }
  };

  /* ---------- grafik batang berkelompok (SVG) ---------- */
  function drawChart(el) {
    if (el.dataset.drawn) return;
    el.dataset.drawn = "1";
    var key = el.dataset.chart;
    var cats, series;
    if (key === "penduduk2022") { cats = DUSUN; series = C.penduduk2022; }
    else if (key === "umur") { cats = C.umurCat; series = C.umur; }
    else if (key === "pendidikan") { cats = C.pendidikanCat; series = C.pendidikan; }
    else return;

    var max = 0;
    series.forEach(function (s) { s.values.forEach(function (v) { if (v > max) max = v; }); });
    max = Math.ceil(max / 50) * 50 || 50;

    var W = 720, H = 330, padL = 46, padR = 12, padT = 16, padB = 76;
    var plotW = W - padL - padR, plotH = H - padT - padB;
    var group = plotW / cats.length;
    var n = series.length;
    var barW = Math.min(46, (group * 0.62) / n);

    var svg = '<svg class="chart" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Grafik batang">';

    for (var i = 0; i <= 5; i++) {
      var v = (max / 5) * i;
      var y = padT + plotH - (v / max) * plotH;
      svg += '<line x1="' + padL + '" y1="' + y + '" x2="' + (W - padR) + '" y2="' + y +
        '" stroke="#e6ecea" stroke-width="1"/>';
      svg += '<text x="' + (padL - 8) + '" y="' + (y + 4) + '" font-size="11.5" fill="#7b8d89" text-anchor="end">' +
        v + "</text>";
    }

    cats.forEach(function (c, ci) {
      var cx = padL + group * ci + group / 2;
      var totalW = n * barW + (n - 1) * 4;
      var x0 = cx - totalW / 2;
      series.forEach(function (s, si) {
        var val = s.values[ci] || 0;
        var h = (val / max) * plotH;
        var x = x0 + si * (barW + 4);
        var y = padT + plotH - h;
        svg += '<rect x="' + x + '" y="' + (padT + plotH) + '" width="' + barW + '" height="0" rx="4" fill="' + s.color + '">' +
          '<animate attributeName="y" to="' + y + '" dur="0.7s" begin="' + (si * 0.08 + 0.05) + 's" fill="freeze"/>' +
          '<animate attributeName="height" to="' + h + '" dur="0.7s" begin="' + (si * 0.08 + 0.05) + 's" fill="freeze"/>' +
          "<title>" + c + " – " + s.name + ": " + val + "</title></rect>";
        if (val > 0) {
          svg += '<text x="' + (x + barW / 2) + '" y="' + (y - 6) + '" font-size="11.5" font-weight="700" fill="#2c3f3b" text-anchor="middle" opacity="0">' +
            val + '<animate attributeName="opacity" to="1" dur=".4s" begin="' + (0.6 + si * 0.08) + 's" fill="freeze"/></text>';
        }
      });
      var parts = c.split(" ");
      svg += '<text x="' + cx + '" y="' + (padT + plotH + 20) + '" font-size="12" fill="#40544f" text-anchor="middle">';
      if (c.length > 10) {
        svg += '<tspan x="' + cx + '" dy="0">' + parts.slice(0, Math.ceil(parts.length / 2)).join(" ") + "</tspan>" +
          '<tspan x="' + cx + '" dy="15">' + parts.slice(Math.ceil(parts.length / 2)).join(" ") + "</tspan>";
      } else {
        svg += c;
      }
      svg += "</text>";
    });
    svg += "</svg>";

    var legend = '<div class="legend">' + series.map(function (s) {
      return '<span><i style="background:' + s.color + '"></i>' + s.name + "</span>";
    }).join("") + "</div>";

    el.innerHTML = svg + legend;
    if (reduce) $$("animate", el).forEach(function (a) { a.parentNode.removeChild(a); });
  }

  /* ---------- batang horizontal ---------- */
  function drawBars(el) {
    if (el.dataset.drawn) return;
    el.dataset.drawn = "1";
    var data = BARS[el.dataset.bars];
    if (!data) return;
    var max = Math.max.apply(null, data.items.map(function (i) { return i[1]; }));
    el.innerHTML = '<div class="hbars">' + data.items.map(function (it) {
      var pct = Math.max(1.5, (it[1] / max) * 100);
      return '<div class="hbar"><div class="top"><span>' + it[0] + "</span><b>" +
        it[1] + " " + data.unit + '</b></div><div class="track"><div class="fill" data-w="' +
        pct.toFixed(1) + '"></div></div></div>';
    }).join("") + "</div>";
    var fills = $$(".fill", el);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        fills.forEach(function (f) { f.style.width = f.dataset.w + "%"; });
      });
    });
  }

  if ("IntersectionObserver" in window) {
    var chartIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        if (en.target.dataset.chart) drawChart(en.target);
        if (en.target.dataset.bars) drawBars(en.target);
        chartIO.unobserve(en.target);
      });
    }, { threshold: 0.2 });
    $$("[data-chart],[data-bars]").forEach(function (el) { chartIO.observe(el); });
  } else {
    $$("[data-chart]").forEach(drawChart);
    $$("[data-bars]").forEach(drawBars);
  }

  /* ================= GALERI ================= */
  var GAL = [
    ["image33.jpeg", "kegiatan", "Sosialisasi Program Sigap"],
    ["image34.jpeg", "kegiatan", "Penandatanganan Kesepakatan Bersama"],
    ["image35.jpeg", "kegiatan", "Identifikasi stakeholder kunci & pemangku kepentingan"],
    ["image36.jpeg", "kegiatan", "FGD Pemetaan Potensi Desa Balasuna Selatan"],
    ["image37.jpeg", "kegiatan", "Sketsa Potensi Desa"],
    ["image38.jpeg", "kegiatan", "Pelatihan Tenaga Pendata SDGs"],
    ["image39.jpeg", "kegiatan", "Praktek Wawancara SDGs"],
    ["image40.jpeg", "kegiatan", "Identifikasi Kebutuhan Peningkatan Kapasitas Kelembagaan"],
    ["image41.jpeg", "kegiatan", "Pelatihan Penguatan Kelembagaan BUMDes"],
    ["image42.jpeg", "kegiatan", "Pendampingan Kelembagaan BUMDes"],
    ["image43.jpeg", "kegiatan", "Pelatihan Bisnis Plan BUMDes"],
    ["image44.jpeg", "kegiatan", "Pendampingan Bisnis Plan BUMDes"],
    ["image45.jpeg", "kegiatan", "Pelatihan Pemandu Pariwisata"],
    ["image46.jpeg", "kegiatan", "Pelatihan Pembuatan Paket Wisata"],
    ["image47.jpeg", "kegiatan", "Pembuatan Paket Wisata"],
    ["image48.jpeg", "kegiatan", "Pelatihan Promosi dan Pemasaran"],
    ["image49.jpeg", "kegiatan", "Praktek Pengambilan Gambar oleh Peserta"],
    ["image50.jpeg", "kegiatan", "Pelatihan PRA"],
    ["image51.jpeg", "kegiatan", "Isu Penting Permasalahan Desa Balasuna Selatan"],
    ["image52.jpeg", "kegiatan", "Diskusi Kelompok Tentang Pohon Masalah"],
    ["image53.jpeg", "kegiatan", "Analisis Peluang Usaha Pariwisata"],
    ["image54.jpeg", "kegiatan", "FGD Analisis Isu Sosial & Ekonomi dalam Pengelolaan SDA"],
    ["image55.jpeg", "kegiatan", "Visioning 2042: Desa Sentra Pertanian Berkelanjutan"],
    ["image56.jpeg", "kegiatan", "Koordinasi dengan Pemangku Kepentingan (Sara, Camat & BTNW)"],
    ["image57.jpeg", "kegiatan", "Koordinasi dengan Desa Berbatasan (Desa Balasuna)"],
    ["image58.jpeg", "kegiatan", "FGD Penyusunan Jadwal Pengambilan Titik Batas Desa"],
    ["image59.jpeg", "kegiatan", "Pengambilan Titik Batas Desa"],
    ["image60.jpeg", "kegiatan", "Pengambilan Titik Batas Desa"],
    ["image61.jpeg", "kegiatan", "FGD Uji Publik & Berita Acara Batas Desa"],
    ["image62.jpeg", "kegiatan", "FGD Konsep Tata Ruang Wilayah Desa"],
    ["image63.jpeg", "kegiatan", "Musyawarah Desa Rencana Tata Ruang Wilayah"],
    ["image64.jpeg", "kegiatan", "Pelatihan Pembuatan Perdes"],
    ["image65.jpeg", "kegiatan", "Pendampingan Penyusunan Perdes"],
    ["image66.jpeg", "kegiatan", "Musdes Penetapan Perdes Tata Ruang Pemanfaatan Wilayah"],
    ["image67.jpeg", "kegiatan", "Penyusunan Perdes Perlindungan Sumber Mata Air & Sempadan Kali"],
    ["image68.jpeg", "kegiatan", "Musdes Rancangan & Penetapan Perdes Mata Air"],
    ["image69.jpeg", "kegiatan", "Pelatihan Kelembagaan Kelompok Tenun"],
    ["image70.jpeg", "kegiatan", "Pelatihan Pengelolaan Keuangan Kelompok Tenun"],
    ["image71.jpeg", "kegiatan", "Pelatihan Promosi & Pemasaran Produk Lokal Tenun"],
    ["image72.jpeg", "kegiatan", "Hasil Foto Produk & Merek Kelompok Tenun"],
    ["image73.jpeg", "kegiatan", "Penandatanganan Conservation Agreement Kelompok Perempuan"],
    ["image74.jpeg", "kegiatan", "Lokakarya Sinkronisasi Tata Ruang (sesi 1)"],
    ["image75.jpeg", "kegiatan", "Lokakarya Sinkronisasi Tata Ruang (sesi 2)"],
    ["image13.jpeg", "peta", "Peta Potensi Wisata Desa Balasuna Selatan (2023)"],
    ["image76.png", "peta", "Peta Potensi Wisata Desa Balasuna Selatan (2023)"],
    ["bagan-penduduk-2026.jpg", "dok", "Bagan Penduduk Desa Agustus 2026"],
    ["image1.jpeg", "dok", "Dokumentasi Desa Balasuna Selatan"],
    ["image6.jpeg", "dok", "Dokumentasi Desa Balasuna Selatan"],
    ["image12.jpeg", "dok", "Dokumentasi Desa Balasuna Selatan"],
    ["image17.jpeg", "dok", "Suasana pedesaan Desa Balasuna Selatan"],
    ["dok-01.jpg", "dok", "Dokumentasi Desa Balasuna Selatan"],
    ["dok-03.jpg", "dok", "Dokumentasi Desa Balasuna Selatan"]
  ];

  var galBox = $("#gal-grid");
  if (galBox) {
    galBox.innerHTML = GAL.map(function (g, i) {
      return '<figure class="gitem" data-i="' + i + '" data-t="' + g[1] + '" tabindex="0" role="button" aria-label="Perbesar ' +
        g[2].replace(/"/g, "") + '">' +
        '<img src="assets/img/' + g[0] + '" alt="' + g[2].replace(/"/g, "") +
        '" loading="lazy" decoding="async">' +
        "<figcaption>" + g[2] + "</figcaption></figure>";
    }).join("");
  }

  /* ---------- filter ---------- */
  var filterBtns = $$(".filter-btn");
  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterBtns.forEach(function (b) { b.classList.remove("on"); });
      btn.classList.add("on");
      var f = btn.dataset.filter;
      $$(".gitem").forEach(function (it) {
        it.style.display = (f === "all" || it.dataset.t === f) ? "" : "none";
      });
    });
  });

  /* ---------- lightbox ---------- */
  var lb = $("#lb");
  if (lb) {
    var lbImg = $("img", lb);
    var lbCap = $("figcaption", lb);
    var idx = 0;

    function visibleItems() {
      return $$(".gitem").filter(function (i) { return i.style.display !== "none"; });
    }
    function show(item) {
      var g = GAL[+item.dataset.i];
      lbImg.src = "assets/img/" + g[0];
      lbImg.alt = g[2];
      lbCap.textContent = g[2];
    }
    function open(item) {
      var items = visibleItems();
      idx = items.indexOf(item);
      if (idx < 0) { items = [item]; idx = 0; }
      show(items[idx]);
      lb.classList.add("on");
      doc.body.style.overflow = "hidden";
      if (lenis) lenis.stop();
    }
    function close() {
      lb.classList.remove("on");
      doc.body.style.overflow = "";
      if (lenis) lenis.start();
    }
    function step(d) {
      var items = visibleItems();
      if (!items.length) return;
      idx = (idx + d + items.length) % items.length;
      show(items[idx]);
    }

    doc.addEventListener("click", function (e) {
      var item = e.target.closest && e.target.closest(".gitem");
      if (item) { open(item); return; }
      if (!lb.classList.contains("on")) return;
      if (e.target.closest(".lb-close") || e.target === lb) close();
      else if (e.target.closest(".lb-prev")) step(-1);
      else if (e.target.closest(".lb-next")) step(1);
    });
    doc.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("on")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "Enter" && e.target.classList && e.target.classList.contains("gitem")) open(e.target);
    });

    /* geser (swipe) */
    var sx = null;
    lb.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener("touchend", function (e) {
      if (sx === null) return;
      var dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 60) step(dx < 0 ? 1 : -1);
      sx = null;
    }, { passive: true });
  }

  /* ================= FOOTER YEAR ================= */
  var yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  paintIcons();
})();
