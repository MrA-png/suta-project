<template>
  <div class="video-workspace">
    <!-- Simulated Video Stream -->
    <div class="video-placeholder">
      <div class="overlay-gradient"></div>
      <div class="scanline"></div>
      
      <div class="stream-info">
        <span class="pulse-icon"></span>
        LIVE: GOOGLE MEET STREAM
      </div>

      <div class="no-signal">
        <div class="glitch-text" data-text="WAITING FOR STREAM">WAITING FOR STREAM</div>
      </div>
    </div>

    <!-- Floating Controls -->
    <div class="floating-controls glass-panel">
      <button class="control-btn" title="Change Source">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M12 8v8"/><path d="m9 11 3-3 3 3"/></svg>
        <span>Change Source</span>
      </button>
      <div class="divider"></div>
      <button class="control-btn toggle-btn" title="Stop Capture">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><circle cx="12" cy="12" r="3"/></svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.video-workspace {
  width: 100%;
  height: 100%;
  position: relative;
  background: #000;
}

.video-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: radial-gradient(circle at center, #111 0%, #000 100%);
}

.overlay-gradient {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 20%, rgba(0,0,0,0) 80%, rgba(0,0,0,0.4) 100%);
  pointer-events: none;
}

.stream-info {
  position: absolute;
  top: 20px;
  left: 20px;
  font-size: 10px;
  letter-spacing: 2px;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: 8px;
}

.pulse-icon {
  width: 6px;
  height: 6px;
  background-color: var(--emerald-green);
  border-radius: 50%;
  display: inline-block;
  box-shadow: 0 0 8px var(--emerald-green);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.2); }
  100% { opacity: 1; transform: scale(1); }
}

.floating-controls {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  padding: 8px 16px;
  border-radius: 100px;
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 5;
}

.control-btn {
  background: transparent;
  border: none;
  color: var(--text-bright);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s;
  opacity: 0.8;
}

.control-btn:hover {
  opacity: 1;
  background: rgba(255,255,255,0.05);
}

.divider {
  width: 1px;
  height: 20px;
  background: var(--border-muted);
}

.glitch-text {
  font-size: 14px;
  letter-spacing: 4px;
  color: var(--text-muted);
  position: relative;
}

.scanline {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    transparent,
    rgba(0, 240, 255, 0.03) 50%,
    transparent
  );
  background-size: 100% 4px;
  pointer-events: none;
}
</style>
