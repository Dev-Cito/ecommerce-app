export const EMOJI_BURST_EVENT = "emoji-burst";

export interface EmojiBurstDetail {
  x: number;
  y: number;
}

export function fireEmojiBurst(el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  const detail: EmojiBurstDetail = {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
  window.dispatchEvent(new CustomEvent<EmojiBurstDetail>(EMOJI_BURST_EVENT, { detail }));
}
