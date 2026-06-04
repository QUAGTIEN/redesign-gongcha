const products = [
  { id: 1, name: "Trà sữa trân châu đường đen", category: "signature milk", price: 59000, type: "milk-cup", badge: "BEST SELLER", desc: "Trà sữa mềm mại, trân châu nấu mới với đường đen.", tags: ["Béo ngọt", "Trân châu"] },
  { id: 2, name: "Trà Oolong đào hồng", category: "fruit", price: 57000, type: "fruit-cup", badge: "MỚI", desc: "Đào hồng tươi mát trên nền Oolong thơm sâu.", tags: ["Chua nhẹ", "Tươi mát"] },
  { id: 3, name: "Trà Alisan kem sữa", category: "signature pure", price: 55000, type: "green-cup", badge: "SIGNATURE", desc: "Trà Alisan thanh nhẹ với lớp kem sữa mặn ngọt.", tags: ["Thanh nhẹ", "Kem sữa"] },
  { id: 4, name: "Trà sữa Oolong 3J", category: "milk signature", price: 63000, type: "milk-cup", badge: "BEST SELLER", desc: "Ba loại topping vui miệng trong vị Oolong đậm.", tags: ["Đậm trà", "Nhiều topping"] },
  { id: 5, name: "Trà xanh chanh dây", category: "fruit", price: 53000, type: "green-cup", badge: "REFRESH", desc: "Chanh dây chua thanh, thơm mát cùng trà xanh.", tags: ["Chua thanh", "Ít ngọt"] },
  { id: 6, name: "Trà đen kem sữa", category: "signature pure", price: 52000, type: "amber-cup", badge: "SIGNATURE", desc: "Vị trà đen rõ nét cân bằng cùng kem sữa.", tags: ["Đậm trà", "Kem sữa"] },
  { id: 7, name: "Trà sữa khoai môn", category: "milk", price: 57000, type: "milk-cup", badge: "COMFORT", desc: "Khoai môn béo bùi, ngọt dịu và dễ thưởng thức.", tags: ["Béo bùi", "Ngọt dịu"] },
  { id: 8, name: "Trà Oolong nguyên chất", category: "pure", price: 47000, type: "amber-cup", badge: "PURE TEA", desc: "Hương Oolong thơm sâu, hậu vị thanh sạch.", tags: ["Đậm trà", "Không sữa"] }
];

const moodData = {
  refresh: { name: "Trà Oolong Đào Hồng", copy: "Vị đào tươi mát kết hợp cùng nền trà Oolong thơm sâu, phù hợp cho một ngày cần thêm năng lượng.", sweet: "Nhẹ", tea: "Vừa", fresh: "Cao", type: "fruit-cup", id: 2 },
  comfort: { name: "Trà Sữa Khoai Môn", copy: "Vị khoai môn béo bùi, ngọt dịu và mềm mại cho những lúc bạn muốn tự thưởng mình.", sweet: "Vừa", tea: "Nhẹ", fresh: "Dịu", type: "milk-cup", id: 7 },
  focus: { name: "Trà Đen Kem Sữa", copy: "Nền trà đen rõ nét, hậu vị sâu và lớp kem sữa cân bằng giúp bạn tỉnh táo.", sweet: "Nhẹ", tea: "Cao", fresh: "Vừa", type: "amber-cup", id: 6 },
  adventure: { name: "Trà Sữa Oolong 3J", copy: "Ba kết cấu topping trong một ly Oolong đậm vị, dành cho ngày bạn muốn thử điều mới.", sweet: "Vừa", tea: "Cao", fresh: "Vui", type: "milk-cup", id: 4 }
};

let activeFilter = "all";
let activeProduct = products[0];
let basePrice = activeProduct.price;
let cart = [];

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
        <div class="mini-cup ${product.type}"><span></span></div>
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
  document.querySelector(".customizer-product .mini-cup").className = `mini-cup ${activeProduct.type}`;
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
        <div class="mini-cup ${item.type}"><span></span></div>
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

  const mood = event.target.closest("[data-mood]");
  if (mood) {
    document.querySelectorAll(".mood-card").forEach(card => card.classList.toggle("active", card === mood));
    const data = moodData[mood.dataset.mood];
    document.querySelector("#recommend-name").textContent = data.name;
    document.querySelector("#recommend-copy").textContent = data.copy;
    document.querySelector("#sweet-meter").textContent = data.sweet;
    document.querySelector("#tea-meter").textContent = data.tea;
    document.querySelector("#fresh-meter").textContent = data.fresh;
    document.querySelector("#recommend-cup").className = `recommend-cup ${data.type}`;
    document.querySelector("#recommend-order").dataset.product = data.id;
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
document.querySelector("#recommend-order")?.addEventListener("click", () => openCustomizer(document.querySelector("#recommend-order").dataset.product || 2));

document.querySelector("#add-cart")?.addEventListener("click", () => {
  const size = document.querySelector('[data-option-group="size"] .selected').dataset.value;
  const sugar = document.querySelector('[data-option-group="sugar"] .selected').dataset.value;
  const ice = document.querySelector('[data-option-group="ice"] .selected').dataset.value;
  const toppings = [...document.querySelectorAll(".topping-option input:checked")].map(input => input.value);
  const price = Number(document.querySelector("#total-price").textContent.replace(/\D/g, ""));
  cart.push({ name: activeProduct.name, type: activeProduct.type, price, options: `Size ${size} · Đường ${sugar} · ${ice}${toppings.length ? ` · ${toppings.join(", ")}` : ""}` });
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
