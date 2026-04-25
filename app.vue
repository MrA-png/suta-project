<template>
  <div class="min-h-screen bg-suta-black text-white font-sans selection:bg-suta-cyan selection:text-black">
    <NuxtPage />
  </div>
</template>

<script setup>
// Global app logic if any
</script>

<style>
/* Global Layout Reset */
html {
  height: 100%;
  scroll-behavior: smooth;
}
body {
  min-height: 100%;
  background-color: #050505;
}

/* Global Transitions */
.page-enter-active,
.page-leave-active {
  transition: all 0.4s ease;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
  transform: translateY(10px);
}

/* Custom Scrollbar Global */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: #0a0a0a;
}
::-webkit-scrollbar-thumb {
  background: #1a1a1a;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #2a2a2a;
}
</style>
