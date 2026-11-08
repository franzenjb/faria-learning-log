(function () {
  var KEY = "faria-reading-scale";
  var MIN = 85, MAX = 150, STEP = 5;
  var input = document.getElementById("reading-size");
  var out = document.getElementById("reading-size-out");
  var reset = document.getElementById("reading-size-reset");
  if (!input || !out) return;
  function clamp(n) {
    if (!Number.isFinite(n)) return 100;
    n = Math.round(n / STEP) * STEP;
    if (n < MIN) return MIN;
    if (n > MAX) return MAX;
    return n;
  }
  function save(n) {
    try {
      if (n === 100) localStorage.removeItem(KEY);
      else localStorage.setItem(KEY, String(n));
    } catch (e) {}
  }
  function apply(n, persist) {
    n = clamp(n);
    document.documentElement.style.setProperty("--reading-scale", String(n / 100));
    input.value = String(n);
    input.setAttribute("aria-valuenow", String(n));
    input.setAttribute("aria-valuetext", n + " percent");
    out.textContent = n + "%";
    if (persist) save(n);
  }
  var start = 100;
  try {
    var raw = localStorage.getItem(KEY);
    if (raw !== null) start = clamp(Number(raw));
  } catch (e) {}
  apply(start, false);
  input.addEventListener("input", function () { apply(Number(input.value), true); });
  input.addEventListener("change", function () { apply(Number(input.value), true); });
  if (reset) reset.addEventListener("click", function () { apply(100, true); input.focus(); });
})();
