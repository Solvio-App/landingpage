<script lang="ts">
  import { ArrowUpRight } from 'lucide-svelte';
  import AnimatedWave from './AnimatedWave.svelte';
  import { getLoginUrl, getRegisterUrl, getPosBaseUrl } from '../../utils';

  const loginUrl = getLoginUrl();
  const registerUrl = getRegisterUrl();
  const posUrl = getPosBaseUrl();

  const footerLinks = {
    Produk: [
      { name: 'Presensi Selfie GPS', href: '#features' },
      { name: 'Kasir POS', href: '#features' },
      { name: 'Payroll Otomatis', href: '#features' },
      { name: 'Cara Kerja', href: '#how-it-works' },
      { name: 'Paket Harga', href: '#pricing' },
    ],
    Akses: [
      { name: 'Login Owner', href: loginUrl },
      { name: 'Login Store Manager', href: loginUrl },
      { name: 'Kasir POS Toko', href: posUrl },
      {
        name: 'Daftar',
        href: registerUrl,
        badge: '35 Hari Gratis',
      },
    ],
    Perusahaan: [
      { name: 'Jadwalkan Demo', href: 'https://wa.me/6282314093294?text=Halo%20Solvio,%20saya%20ingin%20menjadwalkan%20demo%20sistem%20POS%20dan%20operasional%20untuk%20bisnis%20saya.', badge: 'WhatsApp' },
      { name: 'Tentang Solvio', href: '#' },
      { name: 'Pusat Bantuan', href: '#' },
      { name: 'Panduan Outlet', href: '#how-it-works' },
      { name: 'Email Support', href: 'mailto:support@solvio.id' },
    ],
    Legalitas: [
      { name: 'Kebijakan Privasi', href: '#' },
      { name: 'Syarat & Ketentuan', href: '#' },
      { name: 'Keamanan Data', href: '#security' },
    ],
  };

  const socialLinks = [
    { name: 'Instagram', href: 'https://instagram.com/solvio.id' },
    { name: 'LinkedIn', href: '#' },
    { name: 'Email', href: 'mailto:support@solvio.id' },
  ];
</script>

<footer class="relative overflow-hidden border-t border-[#e0e0e0] bg-white">
  <div class="relative mx-auto max-w-350 px-6 lg:px-12">
    <!-- Main Footer Content Area with full Animated Wave Background -->
    <div class="relative py-16 lg:py-24">
      <!-- Animated wave background filling the entire upper section above the bottom bar -->
      <div
        class="pointer-events-none absolute -inset-x-6 inset-y-0 transform-gpu overflow-hidden opacity-25 lg:-inset-x-12"
      >
        <AnimatedWave />
      </div>

      <div class="relative z-10 grid grid-cols-2 gap-12 md:grid-cols-6 lg:gap-8">
        <!-- Brand Column -->
        <div class="col-span-2">
          <a href="/" class="mb-6 inline-flex items-center gap-2.5">
            <img
              src="/logo.webp"
              alt="Solvio Logo"
              width="36"
              height="36"
              class="size-9 rounded-xl object-contain"
            />
            <span class="font-display text-2xl font-bold text-[#161616]">Solvio</span>
          </a>

          <p class="mb-8 max-w-xs text-sm leading-relaxed text-[#525252]">
            Platform operasional SaaS terpadu khusus bisnis ritel, kuliner, dan jasa. Presensi jujur
            ber-watermark GPS, kasir POS offline-ready, dan payroll otomatis.
          </p>

          <!-- Social Links -->
          <div class="flex gap-6">
            {#each socialLinks as link}
              <a
                href={link.href}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                class="group flex items-center gap-1 text-sm text-[#525252] transition-colors hover:text-[#161616]"
              >
                {link.name}
                <ArrowUpRight
                  class="size-3 -translate-x-1 text-[#0f62fe] opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
                />
              </a>
            {/each}
          </div>
        </div>

        <!-- Link Columns -->
        {#each Object.entries(footerLinks) as [title, links]}
          <div>
            <h3 class="mb-6 text-sm font-semibold text-[#161616]">{title}</h3>
            <ul class="space-y-4">
              {#each links as link}
                <li>
                  <a
                    href={link.href}
                    class="inline-flex items-center gap-2 text-sm text-[#525252] transition-colors hover:text-[#161616]"
                  >
                    {link.name}
                    {#if 'badge' in link && link.badge}
                      <span
                        class="rounded-full bg-[#0f62fe] px-2 py-0.5 font-mono text-[10px] text-white"
                      >
                        {link.badge}
                      </span>
                    {/if}
                  </a>
                </li>
              {/each}
            </ul>
          </div>
        {/each}
      </div>
    </div>

    <!-- Bottom Bar (Clean boundary above copyright) -->
    <div
      class="relative z-10 flex items-center justify-center border-t border-[#e0e0e0] bg-white py-8 text-center"
    >
      <p class="text-sm text-[#525252]">
        &copy; 2026 <span
          class="font-medium text-[#525252] underline decoration-[#525252] decoration-1 underline-offset-4"
          >Munk Studio</span
        >. Hak cipta dilindungi undang-undang.
      </p>
    </div>
  </div>
</footer>
