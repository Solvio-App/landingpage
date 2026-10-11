<script lang="ts">
  import { onMount } from 'svelte';
  import { ArrowRight, Check, MessageSquare } from 'lucide-svelte';

  interface BackendPlan {
    id: string;
    name: string;
    max_workspaces: number;
    monthly_price: number;
    annual_price: number;
    is_active: boolean;
  }

  interface PlanDisplay {
    id?: string;
    name: string;
    description: string;
    price: {
      monthly: string;
      annual: string;
      annualBilled: string;
    };
    features: string[];
    cta: string;
    popular: boolean;
  }

  let isAnnual = $state(true);

  const defaultPlans: PlanDisplay[] = [
    {
      name: 'Starter',
      description: 'Untuk toko mandiri atau bisnis 1 lokasi',
      price: { monthly: '149.000', annual: '124.900', annualBilled: '1.499.000' },
      features: [
        '1 Kuota Outlet / Cabang',
        'Kasir POS Offline-Ready',
        'Presensi Selfie & Geofence GPS',
        'Modul Surat Izin & Sakit Terintegrasi',
        'Kalkulasi Payroll & Potongan Absen',
        'Rekonsiliasi Kas Harian',
      ],
      cta: 'Coba Gratis 35 Hari',
      popular: false,
    },
    {
      name: 'Growth',
      description: 'Untuk bisnis bertumbuh hingga 3 cabang',
      price: { monthly: '239.000', annual: '202.400', annualBilled: '2.429.000' },
      features: [
        'Hingga 3 Kuota Outlet / Cabang',
        'Semua Fitur Paket Starter',
        'Hak Akses Kepala Toko (Store Manager)',
        'Laporan Penjualan Multi-Cabang',
        'Modul Pinjaman Kasbon & Auto-Potong',
        'Ekspor Slip Gaji Siap Transfer Bank',
      ],
      cta: 'Coba Gratis 35 Hari',
      popular: true,
    },
    {
      name: 'Scale',
      description: 'Untuk jaringan bisnis berkembang hingga 5 cabang',
      price: { monthly: '389.000', annual: '329.000', annualBilled: '3.949.000' },
      features: [
        'Hingga 5 Kuota Outlet / Cabang',
        'Semua Fitur Paket Growth',
        'Staf Karyawan & Kasir Tanpa Batas',
        'Laporan Finansial Konsolidasi',
        'Geofence Radius Kustom per Cabang',
        'Prioritas Dukungan Teknis 24/7',
      ],
      cta: 'Mulai Paket Scale',
      popular: false,
    },
  ];

  let displayPlans = $state<PlanDisplay[]>(defaultPlans);

  function formatNumber(num: number): string {
    return new Intl.NumberFormat('id-ID').format(Math.round(num));
  }

  function getPlanFeatures(workspaces: number): string[] {
    if (workspaces <= 1) {
      return [
        '1 Kuota Outlet / Cabang',
        'Kasir POS Offline-Ready',
        'Presensi Selfie & Geofence GPS',
        'Modul Surat Izin & Sakit Terintegrasi',
        'Kalkulasi Payroll & Potongan Absen',
        'Rekonsiliasi Kas Harian',
      ];
    }
    if (workspaces <= 3) {
      return [
        `Hingga ${workspaces} Kuota Outlet / Cabang`,
        'Semua Fitur Paket Starter',
        'Hak Akses Kepala Toko (Store Manager)',
        'Laporan Penjualan Multi-Cabang',
        'Modul Pinjaman Kasbon & Auto-Potong',
        'Ekspor Slip Gaji Siap Transfer Bank',
      ];
    }
    return [
      `Hingga ${workspaces} Kuota Outlet / Cabang`,
      'Semua Fitur Paket Growth',
      'Staf Karyawan & Kasir Tanpa Batas',
      'Laporan Finansial Konsolidasi',
      'Geofence Radius Kustom per Cabang',
      'Prioritas Dukungan Teknis 24/7',
    ];
  }

  function getPlanDescription(workspaces: number): string {
    if (workspaces <= 1) return 'Untuk toko mandiri atau bisnis 1 lokasi';
    if (workspaces <= 3) return `Untuk bisnis bertumbuh hingga ${workspaces} cabang`;
    return `Untuk jaringan bisnis berkembang hingga ${workspaces} cabang`;
  }

  function cleanPlanName(rawName: string): string {
    return rawName.replace(/\s*\(\d+\s*Outlets?\)/i, '').trim();
  }

  onMount(async () => {
    try {
      const res = await fetch('/api/v1/billing/plans');
      if (res.ok) {
        const json = await res.json();
        const serverPlans: BackendPlan[] = Array.isArray(json.data) ? json.data : [];
        if (serverPlans.length > 0) {
          displayPlans = serverPlans.map((sp) => {
            const rawMonthly = Number(sp.monthly_price) || 0;
            const rawAnnual = Number(sp.annual_price) || 0;
            const effectiveMonthlyAnnual = rawAnnual > 0 ? rawAnnual / 12 : rawMonthly * 0.854;
            const isGrowth = sp.max_workspaces > 1 && sp.max_workspaces <= 3;
            const name = cleanPlanName(sp.name);

            return {
              id: sp.id,
              name,
              description: getPlanDescription(sp.max_workspaces),
              price: {
                monthly: formatNumber(rawMonthly),
                annual: formatNumber(effectiveMonthlyAnnual),
                annualBilled: formatNumber(rawAnnual),
              },
              features: getPlanFeatures(sp.max_workspaces),
              cta: isGrowth || sp.max_workspaces <= 1 ? 'Coba Gratis 35 Hari' : `Mulai Paket ${name}`,
              popular: isGrowth,
            };
          });
        }
      }
    } catch {
      // Graceful fallback to defaultPlans jika offline
    }
  });

  const demoWhatsappUrl = 'https://wa.me/6282314093294?text=' + encodeURIComponent('Halo Solvio, saya ingin menjadwalkan demo sistem POS dan operasional untuk bisnis saya.');
</script>

<section id="pricing" class="relative border-t border-[#e0e0e0] bg-white py-32 lg:py-40">
  <div class="mx-auto max-w-7xl px-6 lg:px-12">
    <!-- Header -->
    <div class="mb-20 max-w-3xl">
      <span class="mb-6 block font-mono text-xs tracking-widest text-[#525252] uppercase">
        Paket &amp; Harga
      </span>
      <h2 class="mb-6 font-display text-5xl tracking-tight text-[#161616] md:text-6xl lg:text-7xl">
        Biaya sederhana,
        <br />
        <span class="text-stroke">transparan</span>
      </h2>
      <p class="max-w-xl text-lg text-[#525252]">
        Mulai dengan uji coba gratis 35 hari (termasuk 5 hari setup toko &amp; 2 workspace). Tambah
        kuota outlet kapan saja tanpa kontrak rumit.
      </p>
    </div>

    <!-- Billing Toggle & Demo Schedule CTA -->
    <div class="mb-16 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex items-center gap-4">
        <span
          class={`text-sm transition-colors ${
            !isAnnual ? 'font-semibold text-[#161616]' : 'text-[#525252]'
          }`}
        >
          Bulanan
        </span>
        <button
          type="button"
          onclick={() => (isAnnual = !isAnnual)}
          class="relative h-7 w-14 rounded-full bg-[#e0e0e0] p-1 transition-colors hover:bg-[#c6c6c6]"
          aria-label="Toggle annual billing"
        >
          <div
            class={`size-5 rounded-full bg-[#0f62fe] transition-transform duration-300 ${
              isAnnual ? 'translate-x-7' : 'translate-x-0'
            }`}
          ></div>
        </button>
        <span
          class={`text-sm transition-colors ${
            isAnnual ? 'font-semibold text-[#161616]' : 'text-[#525252]'
          }`}
        >
          Tahunan
        </span>
        {#if isAnnual}
          <span class="ml-2 rounded bg-[#24a148] px-2 py-1 font-mono text-xs text-white">
            Hemat ~15% Tahunan
          </span>
        {/if}
      </div>

      <!-- Jadwalkan Demo Whatsapp Link -->
      <a
        href={demoWhatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-2 rounded-full border border-[#161616] px-5 py-2.5 text-xs font-semibold text-[#161616] transition-all hover:bg-[#161616] hover:text-white"
      >
        <MessageSquare class="size-4 text-[#25d366]" />
        <span>Jadwalkan Demo Langsung (WA)</span>
      </a>
    </div>

    <!-- Pricing Cards -->
    <div class="grid gap-px border border-[#e0e0e0] bg-[#e0e0e0] md:grid-cols-3">
      {#each displayPlans as plan, idx}
        <div
          class={`relative flex flex-col justify-between bg-white p-8 lg:p-12 ${
            plan.popular
              ? 'z-10 border-2 border-[#0f62fe] shadow-lg md:-my-4 md:py-12 lg:py-16'
              : ''
          }`}
        >
          <div>
            {#if plan.popular}
              <span
                class="absolute -top-3 left-8 bg-[#0f62fe] px-3 py-1 font-mono text-xs tracking-widest text-white uppercase"
              >
                Paling Diminati
              </span>
            {/if}

            <!-- Plan Header -->
            <div class="mb-8">
              <span class="font-mono text-xs text-[#8c8c8c]">
                {String(idx + 1).padStart(2, '0')}
              </span>
              <h3 class="mt-2 font-display text-3xl text-[#161616]">{plan.name}</h3>
              <p class="mt-2 text-sm text-[#525252]">{plan.description}</p>
            </div>

            <!-- Price -->
            <div class="mb-8 border-b border-[#e0e0e0] pb-8">
              <div class="flex items-baseline gap-2">
                <span class="font-mono text-sm text-[#525252]">Rp</span>
                <span class="font-display text-4xl text-[#161616] lg:text-5xl">
                  {isAnnual ? plan.price.annual : plan.price.monthly}
                </span>
                <span class="font-mono text-sm text-[#525252]">/bln</span>
              </div>
              {#if isAnnual}
                <span class="mt-1 block font-mono text-xs text-[#8c8c8c]">
                  Ditagih Rp {plan.price.annualBilled}/tahun
                </span>
              {/if}
            </div>

            <!-- Features -->
            <ul class="mb-10 space-y-4">
              {#each plan.features as feature}
                <li class="flex items-start gap-3">
                  <Check class="mt-0.5 size-4 shrink-0 text-[#0f62fe]" />
                  <span class="text-sm text-[#525252]">{feature}</span>
                </li>
              {/each}
            </ul>
          </div>

          <!-- CTA -->
          <a
            href="https://app.solvio.id/register"
            class={`flex w-full items-center justify-center gap-2 rounded-none py-4 text-sm font-medium transition-all ${
              plan.popular
                ? 'bg-[#0f62fe] text-white hover:bg-[#0050e6]'
                : 'border border-[#161616] text-[#161616] hover:bg-[#f4f4f4]'
            }`}
          >
            {plan.cta}
            <ArrowRight class="size-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      {/each}
    </div>

    <!-- Bottom Note -->
    <div class="mt-12 flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
      <p class="text-sm text-[#525252]">
        Semua paket mencakup pembaruan sistem berkala, enkripsi SSL, dan backup cloud otomatis.
      </p>
      <a
        href={demoWhatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        class="text-sm font-medium text-[#0f62fe] hover:underline"
      >
        Punya lebih dari 5 cabang? Hubungi kami untuk paket khusus &rarr;
      </a>
    </div>
  </div>
</section>
