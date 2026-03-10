/** Ready State — pure data */

export function getReadyContent() {
  return {
    title: "You're ready to start discovering",
    supportCopy:
      "We've prepared a first set of profiles based on your location and goals.",
    swipeExplainer: [
      { icon: "left", label: "Swipe left to pass" },
      { icon: "right", label: "Swipe right to save" },
      { icon: "tap", label: "Tap a card to view the full profile" },
    ],
    ctaLabel: "Start discovering",
    secondaryCta: "Review my preferences",
    footerNote:
      "Nothing is shared with a professional until you save, request info, or message.",
  };
}
