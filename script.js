var crsr = document.querySelector("#cursor")
document.addEventListener("mousemove", function (dets) {
    crsr.style.left = dets.x-5 + "px";
    crsr.style.top = dets.y-1 + "px";
});

 // Timeline with scrub effect
 const tl = gsap.timeline({
    scrollTrigger: {
      trigger: "#page2",
      start: "top center",
      end: "bottom center",
      scrub: 2,
      pin: true, 
    }
  });

  // Animate cards in order
  tl.from("#card1", { opacity: 0, y: 100, duration: 1 })
    .from("#card2", { opacity: 0, x: -100, duration: 1 }, "-=0.5")
    .from("#card3", { opacity: 0, scale: 0.5, duration: 1 }, "-=0.5")
    .from("#card4", { opacity: 0, x: 100, duration: 1 }, "-=0.5")
    .from("#card5", { opacity: 0, y: 100, duration: 1 }, "-=0.5");