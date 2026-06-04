const products = [
  { id: 1, name: "Trà sữa tran chau duong den", category: "signature milk", price: 59000, type: "milk-cup", badge: "BEST SELLER", desc: "Trà sữa mem mai, tran chau nau moi voi duong den.", tags: ["Béo ngọt", "Trân châu"] },
  { id: 2, name: "Trà Oolong đào hồng", category: "fruit", price: 57000, type: "fruit-cup", badge: "MOI", desc: "Đào hồng tươi mát trên nền oolong thơm sâu.", tags: ["Chua nhẹ", "Tươi mát"] },
  { id: 3, name: "Trà Alisan kem sữa", category: "signature pure", price: 55000, type: "green-cup", badge: "SIGNATURE", desc: "Trà Alisan thanh nhẹ với lớp kem sữa mặn ngọt.", tags: ["Thanh nhẹ", "Kem sữa"] },
  { id: 4, name: "Trà sữa Oolong 3J", category: "milk signature", price: 63000, type: "milk-cup", badge: "BEST SELLER", desc: "Ba loại topping vui miệng trong vị oolong đậm.", tags: ["Đậm trà", "Nhiều topping"] },
  { id: 5, name: "Trà xanh chanh dây", category: "fruit", price: 53000, type: "green-cup", badge: "REFRESH", desc: "Chanh dây chua thanh, thơm mát cùng trà xanh.", tags: ["Chua thanh", "Ít ngọt"] },
  { id: 6, name: "Trà đen kem sữa", category: "signature pure", price: 52000, type: "amber-cup", badge: "SIGNATURE", desc: "Vị trà den ro net can bang cung kem sua.", tags: ["Đậm trà", "Kem sữa"] },
  { id: 7, name: "Trà sữa khoai mon", category: "milk", price: 57000, type: "milk-cup", badge: "COMFORT", desc: "Khoai m?n b?o b?i, ng?t d?u v? d? thĐóng.", tags: ["Béo bùi", "Ngọt dịu"] },
  { id: 8, name: "Trà Oolong nguyên chất", category: "pure", price: 47000, type: "amber-cup", badge: "PURE TEA", desc: "HĐóng oolong th?m s?u, h?u v? thanh s?ch.", tags: ["Đậm trà", "Không sữa"] }
];

const moodData = {
  refresh: { name: "Trà Oolong Đào Hồng", copy: "Vị đào tươi mát kết hợp cùng nền trà oolong thơm sâu, phù hợp cho một ngày cần thêm năng lượng.", sweet: "Nhe", tea: "Vua", fresh: "Cao", type: "fruit-cup", id: 2 },
  comfort: { name: "Tra Sua Khoai Mon", copy: "Vi khoai mon beo bui, ngot diu va mem mai cho nhung luc ban muon tu thuong minh.", sweet: "Vua", tea: "Nhe", fresh: "Diu", type: "milk-cup", id: 7 },
  focus: { name: "Tra Den Kem Sua", copy: "Nen tra den ro net, hau vi sau va lop kem sua can bang giup ban tinh tao.", sweet: "Nhe", tea: "Cao", fresh: "Vua", type: "amber-cup", id: 6 },
  adventure: { name: "Tra Sua Oolong 3J", copy: "Ba ket cau topping trong mot ly oolong dam vi, danh cho ngay ban muon thu dieu moi.", sweet: "Vua", tea: "Cao", fresh: "Vui", type: "milk-cup", id: 4 }
};

let activeFilter = "all";
let activeProduct = products[0];
let basePrice = activeProduct.price;
let cart = [];

const formatPrice = value => `${new Intl.NumberFormat("vi-VN").format(value)}d`;
const renderIcons = () => window.lucide?.createIcons();
const productGrid = document.querySelector("#product-grid");
const searchInput = document.querySelector("#menu-search");
const customizer = document.querySelector("#customizer");
const cartDrawer = document.querySelector("#cart-drawer");
const backdrop = document.querySelector("#modal-backdrop");

function renderProducts() {
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
        <button class="favorite" type="button" aria-label="Th?m ${product.name} vao yeu thich"><i data-lucide="heart"></i></button>
        <div class="mini-cup ${product.type}"><span></span></div>
      </div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <p>${product.desc}</p>
        <div class="tags">${product.tags.map(tag => `<span>${tag}</span>`).join("")}</div>
        <div class="product-bottom">
          <span class="price">Tu ${formatPrice(product.price)}</span>
          <button class="customize-btn" type="button" data-product="${product.id}">Tùy chỉnh</button>
        </div>
      </div>
    </article>
  `).join("");

  document.querySelector("#empty-state").style.display = visible.length ? "none" : "block";
  renderIcons();
}

function selectFilter(filter) {
  activeFilter = filter;
  document.querySelectorAll(".filter-chip").forEach(button => button.classList.toggle("active", button.dataset.filter === filter));
  renderProducts();
}

function showBackdrop() {
  backdrop.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeDrawers() {
  customizer.classList.remove("open");
  cartDrawer.classList.remove("open");
  customizer.setAttribute("aria-hidden", "true");
  cartDrawer.setAttribute("aria-hidden", "true");
  backdrop.hidden = true;
  document.body.style.overflow = "";
}

function resetOptions() {
  document.querySelectorAll("[data-option-group]").forEach(group => {
    group.querySelectorAll("button").forEach((button, index) => {
      const defaultSelected = group.dataset.optionGroup === "sugar" ? button.dataset.value === "50%" : group.dataset.optionGroup === "ice" ? button.dataset.value === "Ít đá" : index === 0;
      button.classList.toggle("selected", defaultSelected);
    });
  });
  document.querySelectorAll(".topping-option input").forEach(input => input.checked = false);
}

function updateTotal() {
  const sizeAdd = document.querySelector('[data-option-group="size"] .selected')?.dataset.value === "L" ? 8000 : 0;
  const toppingsAdd = [...document.querySelectorAll(".topping-option input:checked")].reduce((sum, input) => sum + Number(input.dataset.price), 0);
  document.querySelector("#total-price").textContent = formatPrice(basePrice + sizeAdd + toppingsAdd);
}

function openCustomizer(id) {
  activeProduct = products.find(product => product.id === Number(id)) || products[0];
  basePrice = activeProduct.price;
  document.querySelector("#custom-name").textContent = activeProduct.name;
  document.querySelector("#custom-price").textContent = formatPrice(activeProduct.price);
  const cup = document.querySelector(".customizer-product .mini-cup");
  cup.className = `mini-cup ${activeProduct.type}`;
  resetOptions();
  updateTotal();
  showBackdrop();
  customizer.classList.add("open");
  customizer.setAttribute("aria-hidden", "false");
}

function openCart() {
  showBackdrop();
  cartDrawer.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
}

function renderCart() {
  const container = document.querySelector("#cart-items");
  if (!cart.length) {
    container.innerHTML = '<div class="cart-empty"><i data-lucide="shopping-bag"></i><p>Giỏ hàng dang trong.</p><small>Chọn một ly trà và tùy chỉnh theo ý bạn.</small></div>';
  } else {
    container.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div class="mini-cup ${item.type}"><span></span></div>
        <div><strong>${item.name}</strong><small>${item.options}</small></div>
        <b>${formatPrice(item.price)}</b>
      </div>
    `).join("");
  }
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  document.querySelector("#cart-total").textContent = formatPrice(total);
  document.querySelector(".cart-count").textContent = cart.length;
  renderIcons();
}

document.addEventListener("click", event => {
  const scrollButton = event.target.closest("[data-scroll]");
  if (scrollButton) document.querySelector(scrollButton.dataset.scroll)?.scrollIntoView({ behavior: "smooth" });

  const filterButton = event.target.closest("[data-filter]");
  if (filterButton) selectFilter(filterButton.dataset.filter);

  const jump = event.target.closest("[data-filter-jump]");
  if (jump) {
    selectFilter(jump.dataset.filterJump);
    document.querySelector("#menu").scrollIntoView({ behavior: "smooth" });
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

  if (event.target.closest(".favorite")) event.target.closest(".favorite").classList.toggle("selected");
});

searchInput.addEventListener("input", renderProducts);
document.querySelectorAll(".topping-option input").forEach(input => input.addEventListener("change", updateTotal));
document.querySelector("#close-customizer").addEventListener("click", closeDrawers);
document.querySelector("#close-cart").addEventListener("click", closeDrawers);
document.querySelector(".cart-button").addEventListener("click", openCart);
backdrop.addEventListener("click", closeDrawers);
document.querySelector("#recommend-order").addEventListener("click", () => openCustomizer(document.querySelector("#recommend-order").dataset.product || 2));

document.querySelector("#add-cart").addEventListener("click", () => {
  const size = document.querySelector('[data-option-group="size"] .selected').dataset.value;
  const sugar = document.querySelector('[data-option-group="sugar"] .selected').dataset.value;
  const ice = document.querySelector('[data-option-group="ice"] .selected').dataset.value;
  const toppings = [...document.querySelectorAll(".topping-option input:checked")].map(input => input.value);
  const price = Number(document.querySelector("#total-price").textContent.replace(/\D/g, ""));
  cart.push({ name: activeProduct.name, type: activeProduct.type, price, options: `Size ${size} · Duong ${sugar} · ${ice}${toppings.length ? ` · ${toppings.join(", ")}` : ""}` });
  renderCart();
  closeDrawers();
  openCart();
});

document.querySelector(".menu-toggle").addEventListener("click", () => document.querySelector("#menu").scrollIntoView({ behavior: "smooth" }));

renderProducts();
renderCart();
renderIcons();
