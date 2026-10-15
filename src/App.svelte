<script lang="ts">
  import Navigation from './lib/components/landing/Navigation.svelte';
  import HeroSection from './lib/components/landing/HeroSection.svelte';
  import FeaturesSection from './lib/components/landing/FeaturesSection.svelte';
  import HowItWorksSection from './lib/components/landing/HowItWorksSection.svelte';
  import InfrastructureSection from './lib/components/landing/InfrastructureSection.svelte';
  import MetricsSection from './lib/components/landing/MetricsSection.svelte';
  import IntegrationsSection from './lib/components/landing/IntegrationsSection.svelte';
  import SecuritySection from './lib/components/landing/SecuritySection.svelte';
  import TestimonialsSection from './lib/components/landing/TestimonialsSection.svelte';
  import PricingSection from './lib/components/landing/PricingSection.svelte';
  import CtaSection from './lib/components/landing/CtaSection.svelte';
  import FooterSection from './lib/components/landing/FooterSection.svelte';
</script>

<main class="noise-overlay relative min-h-screen overflow-x-hidden bg-white text-[#161616]">
  <Navigation />
  <HeroSection />
  <FeaturesSection />
  <HowItWorksSection />
  <div class="content-visibility-auto">
    <InfrastructureSection />
  </div>
  <div class="content-visibility-auto">
    <MetricsSection />
  </div>
  <div class="content-visibility-auto">
    <IntegrationsSection />
  </div>
  <div class="content-visibility-auto">
    <SecuritySection />
  </div>
  <div class="content-visibility-auto">
    <TestimonialsSection />
  </div>
  <div class="content-visibility-auto">
    <PricingSection />
  </div>
  <div class="content-visibility-auto">
    <CtaSection />
  </div>
  <div class="content-visibility-auto">
    <FooterSection />
  </div>
</main>
