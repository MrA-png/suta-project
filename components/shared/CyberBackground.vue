<template>
  <!-- Background Effects (Synced with VideoDisplay Offline State) -->
  <div class="fixed inset-0 pointer-events-none z-0">
    <!-- Base Radial Gradient -->
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,_#111_0%,_#000_100%)]"></div>
    
    <!-- Vertical Vignette -->
    <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60"></div>
    
    <!-- Cyber Scanlines -->
    <div class="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(0,240,255,0.03)_50%,transparent)] bg-[length:100%_4px]"></div>

    <!-- Accent Glows -->
    <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-suta-cyan/5 blur-[120px] rounded-full"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 blur-[120px] rounded-full"></div>
    <div class="absolute inset-0 opacity-[0.02] [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:40px_40px]"></div>
  </div>
</template>
