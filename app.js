const products = [
  { id: 1, name: "Trà sữa trân châu đen", category: "signature milk", price: 59000, type: "milk-cup", image: "assets/products/milk-tea-pearl.png", badge: "BEST SELLER", desc: "Trà sữa mềm mại cùng trân châu đen dai giòn.", tags: ["Béo ngọt", "Trân châu"], moods: ["comfort"], tastes: ["milk", "topping"], colors: ["cream"], sweet: "Vừa", tea: "Nhẹ", fresh: "Dịu" },
  { id: 2, name: "Trà xanh đào", category: "fruit", price: 57000, type: "fruit-cup", image: "assets/products/peach-green-tea.png", badge: "TƯƠI MÁT", desc: "Hương đào mọng quả trên nền trà xanh thanh nhẹ.", tags: ["Trái cây", "Tươi mát"], moods: ["refresh"], tastes: ["fruit"], colors: ["yellow"], sweet: "Nhẹ", tea: "Vừa", fresh: "Cao" },
  { id: 3, name: "Trà Alisan kem sữa", category: "signature pure", price: 55000, type: "green-cup", image: "assets/products/alisan-milkfoam.png", badge: "SIGNATURE", desc: "Trà Alisan thanh nhẹ với lớp kem sữa mặn ngọt.", tags: ["Thanh nhẹ", "Kem sữa"], moods: ["comfort", "focus"], tastes: ["tea", "milk"], colors: ["yellow", "cream"], sweet: "Nhẹ", tea: "Vừa", fresh: "Vừa" },
  { id: 4, name: "Trà sữa Oolong 3J", category: "milk signature", price: 63000, type: "milk-cup", image: "assets/products/oolong-3j.png", badge: "BEST SELLER", desc: "Ba loại topping vui miệng trong vị Oolong đậm.", tags: ["Đậm trà", "Nhiều topping"], moods: ["adventure"], tastes: ["topping", "milk"], colors: ["cream"], sweet: "Vừa", tea: "Cao", fresh: "Vui" },
  { id: 5, name: "Trà xanh nguyên chất", category: "fruit pure", price: 53000, type: "green-cup", image: "assets/products/green-tea.png", badge: "REFRESH", desc: "Trà xanh thanh sạch, tươi mát và nhẹ nhàng.", tags: ["Thanh mát", "Ít ngọt"], moods: ["refresh", "focus"], tastes: ["tea", "fruit"], colors: ["yellow"], sweet: "Nhẹ", tea: "Vừa", fresh: "Cao" },
  { id: 6, name: "Trà đen kem sữa", category: "signature pure", price: 52000, type: "amber-cup", image: "assets/products/black-tea-milkfoam.png", badge: "SIGNATURE", desc: "Vị trà đen rõ nét cân bằng cùng kem sữa.", tags: ["Đậm trà", "Kem sữa"], moods: ["focus"], tastes: ["tea", "milk"], colors: ["amber"], sweet: "Nhẹ", tea: "Cao", fresh: "Vừa" },
  { id: 7, name: "Trà sữa khoai môn", category: "milk", price: 57000, type: "milk-cup", image: "assets/products/taro-milk-tea.png", badge: "COMFORT", desc: "Khoai môn béo bùi, ngọt dịu và dễ thưởng thức.", tags: ["Béo bùi", "Ngọt dịu"], moods: ["comfort", "adventure"], tastes: ["milk"], colors: ["purple"], sweet: "Vừa", tea: "Nhẹ", fresh: "Dịu" },
  { id: 8, name: "Trà Oolong nguyên chất", category: "pure", price: 47000, type: "amber-cup", image: "assets/products/oolong-tea.png", badge: "PURE TEA", desc: "Hương Oolong thơm sâu, hậu vị thanh sạch.", tags: ["Đậm trà", "Không sữa"], moods: ["focus", "refresh"], tastes: ["tea"], colors: ["amber"], sweet: "Không", tea: "Cao", fresh: "Vừa" }
];

const quizLabels = {
  refresh: "một ngày cần sự tươi mới",
  comfort: "tâm trạng muốn được chiều chuộng",
  focus: "lúc cần tập trung và tỉnh táo",
  adventure: "mong muốn thử điều khác biệt",
  fruit: "khẩu vị yêu trái cây",
  milk: "sở thích béo mịn",
  tea: "tình yêu dành cho vị trà",
  topping: "niềm vui từ nhiều topping",
  yellow: "sắc vàng tươi sáng",
  cream: "gam kem dịu dàng",
  purple: "sắc tím mộng mơ",
  amber: "màu hổ phách sâu lắng"
};

let activeFilter = "all";
let activeProduct = products[0];
let basePrice = activeProduct.price;
let cart = [];
const quizAnswers = {};

const formatPrice = value => `${new Intl.NumberFormat("vi-VN").format(value)}đ`;
const renderIcons = () => window.lucide?.createIcons();
const productGrid = document.querySelector("#product-grid");
const searchInput = document.querySelector("#menu-search");
const customizer = document.querySelector("#customizer");
const cartDrawer = document.querySelector("#cart-drawer");
const backdrop = document.querySelector("#modal-backdrop");

function renderProducts() {
  if (!productGrid || !searchInput) return;
  const term = searchInput.value.trim().toLowerCase();
  const visible = products.filter(product => {
    const matchesFilter = activeFilter === "all" || product.category.includes(activeFilter);
    const matchesSearch = `${product.name} ${product.desc} ${product.tags.join(" ")}`.toLowerCase().includes(term);
    return matchesFilter && matchesSearch;
  });

  productGrid.innerHTML = visible.map(product => `
    <article class="product-card">
      <div class="product-visual">
        <span class="product-badge">${product.badge}</span>
        <button class="favorite" type="button" aria-label="Thêm ${product.name} vào yêu thích"><i data-lucide="heart"></i></button>
        <img class="product-photo" src="${product.image}" alt="${product.name}">
      </div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <p>${product.desc}</p>
        <div class="tags">${product.tags.map(tag => `<span>${tag}</span>`).join("")}</div>
        <div class="product-bottom">
          <span class="price">Từ ${formatPrice(product.price)}</span>
          <button class="customize-btn" type="button" data-product="${product.id}">Tùy chỉnh</button>
        </div>
      </div>
    </article>
  `).join("");

  const emptyState = document.querySelector("#empty-state");
  if (emptyState) emptyState.style.display = visible.length ? "none" : "block";
  renderIcons();
}

function getQuizRecommendations() {
  return products
    .map(product => {
      let score = 0;
      if (product.moods.includes(quizAnswers.mood)) score += 4;
      if (product.tastes.includes(quizAnswers.taste)) score += 4;
      if (product.colors.includes(quizAnswers.color)) score += 2;
      return { product, score };
    })
    .sort((a, b) => b.score - a.score || a.product.id - b.product.id)
    .slice(0, 2);
}

function renderQuizRecommendations() {
  const container = document.querySelector("#quiz-results-grid");
  const results = document.querySelector("#quiz-results");
  if (!container || !results) return;

  container.innerHTML = getQuizRecommendations().map(({ product }, index) => `
    <article class="quiz-result-card">
      <div class="quiz-result-visual">
        <span>${index === 0 ? "HỢP NHẤT" : "LỰA CHỌN THỨ HAI"}</span>
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="quiz-result-copy">
        <p class="recommend-label">GỢI Ý ${index + 1}</p>
        <h3>${product.name}</h3>
        <p>${product.desc} Phù hợp với ${quizLabels[quizAnswers.mood]}, ${quizLabels[quizAnswers.taste]} và ${quizLabels[quizAnswers.color]} của bạn.</p>
        <div class="taste-meter">
          <span>Độ ngọt <b>${product.sweet}</b></span>
          <span>Vị trà <b>${product.tea}</b></span>
          <span>Tươi mát <b>${product.fresh}</b></span>
        </div>
        <div class="quiz-result-actions">
          <button class="primary" type="button" data-product="${product.id}">Tùy chỉnh món này <i data-lucide="sliders-horizontal"></i></button>
          <a class="text-cta" href="menu.html">Xem thực đơn <i data-lucide="arrow-right"></i></a>
        </div>
      </div>
    </article>
  `).join("");

  results.hidden = false;
  results.scrollIntoView({ behavior: "smooth", block: "start" });
  renderIcons();
}

function selectFilter(filter) {
  activeFilter = filter;
  document.querySelectorAll(".filter-chip[data-filter]").forEach(button => button.classList.toggle("active", button.dataset.filter === filter));
  renderProducts();
}

function showBackdrop() {
  if (!backdrop) return;
  backdrop.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeDrawers() {
  customizer?.classList.remove("open");
  cartDrawer?.classList.remove("open");
  customizer?.setAttribute("aria-hidden", "true");
  cartDrawer?.setAttribute("aria-hidden", "true");
  if (backdrop) backdrop.hidden = true;
  document.body.style.overflow = "";
}

function resetOptions() {
  document.querySelectorAll("[data-option-group]").forEach(group => {
    group.querySelectorAll("button").forEach((button, index) => {
      const defaultSelected = group.dataset.optionGroup === "sugar"
        ? button.dataset.value === "50%"
        : group.dataset.optionGroup === "ice"
          ? button.dataset.value === "Ít đá"
          : index === 0;
      button.classList.toggle("selected", defaultSelected);
    });
  });
  document.querySelectorAll(".topping-option input").forEach(input => { input.checked = false; });
}

function updateTotal() {
  const totalPrice = document.querySelector("#total-price");
  if (!totalPrice) return;
  const sizeAdd = document.querySelector('[data-option-group="size"] .selected')?.dataset.value === "L" ? 8000 : 0;
  const toppingsAdd = [...document.querySelectorAll(".topping-option input:checked")].reduce((sum, input) => sum + Number(input.dataset.price), 0);
  totalPrice.textContent = formatPrice(basePrice + sizeAdd + toppingsAdd);
}

function openCustomizer(id) {
  if (!customizer) return;
  activeProduct = products.find(product => product.id === Number(id)) || products[0];
  basePrice = activeProduct.price;
  document.querySelector("#custom-name").textContent = activeProduct.name;
  document.querySelector("#custom-price").textContent = formatPrice(activeProduct.price);
  const customImage = document.querySelector(".customizer-product .custom-product-photo");
  if (customImage) {
    customImage.src = activeProduct.image;
    customImage.alt = activeProduct.name;
  }
  resetOptions();
  updateTotal();
  showBackdrop();
  customizer.classList.add("open");
  customizer.setAttribute("aria-hidden", "false");
}

function openCart() {
  if (!cartDrawer) return;
  showBackdrop();
  cartDrawer.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
}

function renderCart() {
  const container = document.querySelector("#cart-items");
  if (!container) return;
  if (!cart.length) {
    container.innerHTML = '<div class="cart-empty"><i data-lucide="shopping-bag"></i><p>Giỏ hàng đang trống.</p><small>Chọn một ly trà và tùy chỉnh theo ý bạn.</small></div>';
  } else {
    container.innerHTML = cart.map(item => `
      <div class="cart-item">
        <img class="cart-product-photo" src="${item.image}" alt="${item.name}">
        <div><strong>${item.name}</strong><small>${item.options}</small></div>
        <b>${formatPrice(item.price)}</b>
      </div>
    `).join("");
  }
  document.querySelector("#cart-total").textContent = formatPrice(cart.reduce((sum, item) => sum + item.price, 0));
  document.querySelector(".cart-count").textContent = cart.length;
  renderIcons();
}

function filterStores() {
  const query = document.querySelector("#store-query")?.value.trim().toLowerCase() || "";
  const city = document.querySelector(".city-filters .active")?.dataset.city || "all";
  document.querySelectorAll(".store-card").forEach(card => {
    const cityMatches = city === "all" || card.dataset.city === city;
    const queryMatches = card.dataset.store.toLowerCase().includes(query);
    card.classList.toggle("is-hidden", !(cityMatches && queryMatches));
  });
}

document.addEventListener("click", event => {
  const scrollButton = event.target.closest("[data-scroll]");
  if (scrollButton) document.querySelector(scrollButton.dataset.scroll)?.scrollIntoView({ behavior: "smooth" });

  const filterButton = event.target.closest("[data-filter]");
  if (filterButton) selectFilter(filterButton.dataset.filter);

  const jump = event.target.closest("[data-filter-jump]");
  if (jump) {
    selectFilter(jump.dataset.filterJump);
    document.querySelector("#menu")?.scrollIntoView({ behavior: "smooth" });
  }

  const customize = event.target.closest("[data-product]");
  if (customize) openCustomizer(customize.dataset.product);

  const quizOption = event.target.closest("[data-quiz-question]");
  if (quizOption) {
    const question = quizOption.dataset.quizQuestion;
    quizAnswers[question] = quizOption.dataset.quizValue;
    document.querySelectorAll(`[data-quiz-question="${question}"]`).forEach(button => button.classList.toggle("active", button === quizOption));
    const answered = Object.keys(quizAnswers).length;
    const submit = document.querySelector("#quiz-submit");
    const progress = document.querySelector("#quiz-progress-fill");
    const status = document.querySelector("#quiz-status");
    if (submit) submit.disabled = answered < 3;
    if (progress) progress.style.width = `${answered / 3 * 100}%`;
    if (status) status.textContent = answered === 3 ? "Đã sẵn sàng tìm món" : `Đã trả lời ${answered}/3 câu`;
  }

  const option = event.target.closest("[data-option-group] button");
  if (option) {
    option.parentElement.querySelectorAll("button").forEach(button => button.classList.toggle("selected", button === option));
    updateTotal();
  }

  const cityButton = event.target.closest("[data-city]");
  if (cityButton) {
    document.querySelectorAll("[data-city]").forEach(button => button.classList.toggle("active", button === cityButton));
    filterStores();
  }

  if (event.target.closest(".favorite")) event.target.closest(".favorite").classList.toggle("selected");
  if (event.target.closest(".menu-toggle")) document.body.classList.toggle("mobile-nav-open");
  if (event.target.closest("[data-focus-search]")) searchInput?.focus();
});

searchInput?.addEventListener("input", renderProducts);
document.querySelector("#store-query")?.addEventListener("input", filterStores);
document.querySelectorAll(".topping-option input").forEach(input => input.addEventListener("change", updateTotal));
document.querySelector("#close-customizer")?.addEventListener("click", closeDrawers);
document.querySelector("#close-cart")?.addEventListener("click", closeDrawers);
document.querySelector(".cart-button")?.addEventListener("click", event => {
  if (cartDrawer) {
    event.preventDefault();
    openCart();
  }
});
backdrop?.addEventListener("click", closeDrawers);
document.querySelector("#quiz-submit")?.addEventListener("click", renderQuizRecommendations);
document.querySelector("#quiz-reset")?.addEventListener("click", () => {
  Object.keys(quizAnswers).forEach(key => delete quizAnswers[key]);
  document.querySelectorAll("[data-quiz-question]").forEach(button => button.classList.remove("active"));
  document.querySelector("#quiz-submit").disabled = true;
  document.querySelector("#quiz-progress-fill").style.width = "0";
  document.querySelector("#quiz-status").textContent = "Đã trả lời 0/3 câu";
  document.querySelector("#quiz-results").hidden = true;
  document.querySelector("#finder").scrollIntoView({ behavior: "smooth", block: "start" });
});

document.querySelector("#add-cart")?.addEventListener("click", () => {
  const size = document.querySelector('[data-option-group="size"] .selected').dataset.value;
  const sugar = document.querySelector('[data-option-group="sugar"] .selected').dataset.value;
  const ice = document.querySelector('[data-option-group="ice"] .selected').dataset.value;
  const toppings = [...document.querySelectorAll(".topping-option input:checked")].map(input => input.value);
  const price = Number(document.querySelector("#total-price").textContent.replace(/\D/g, ""));
  cart.push({ name: activeProduct.name, image: activeProduct.image, price, options: `Size ${size} · Đường ${sugar} · ${ice}${toppings.length ? ` · ${toppings.join(", ")}` : ""}` });
  renderCart();
  closeDrawers();
  openCart();
});

document.querySelector("#contact-form-element")?.addEventListener("submit", event => {
  event.preventDefault();
  const success = document.querySelector("#form-success");
  success.hidden = false;
  event.currentTarget.reset();
});

renderProducts();
renderCart();
renderIcons();
