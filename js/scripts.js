import { get, post, put, deleteFunc} from "./services.js";

// HTML Elements:

const toggleNavbarBtnEl = document.querySelector(".toggle-navbar-btn");

const navbarEl = document.querySelector(".navbar");

const slidesEl = document.querySelector(".slides");

const prevBtnEl = document.querySelector(".prev");

const nextBtnEl = document.querySelector(".next");

const latestProductsContainerEl = document.querySelector(".latest-products--container");

const openCartBtnEl = document.querySelector(".open-cart-btn");

const cartEl = document.querySelector(".cart");

const closeCartBtnEl = document.querySelector(".close-cart-btn");

const cartItemsEl = document.querySelector(".cart-items");

const cartQuantityEl = document.querySelector(".cart-quantity");

const cartSubTotal = document.querySelector(".cart--sub-total span");

const testimonialsPrevBtn = document.querySelector(".testimonials-prev");

const testimonialsNextBtn = document.querySelector(".testimonials-next");

const testimonialEl = document.querySelectorAll(".testimonial");

const toUpBtnEl = document.querySelector(".to-up-btn");

// Toggle Navbar Menu:

toggleNavbarBtnEl.addEventListener("click", function () {

    if (navbarEl.classList.contains("show")) {

        this.innerHTML = "<i class=\"fa-solid fa-bars\"></i>";

        navbarEl.classList.remove("show");

    } else {

        this.innerHTML = "<i class=\"fa-solid fa-xmark\"></i>";

        navbarEl.classList.add("show");

    }

});

// Hero Slider:

let slidesLength = document.querySelectorAll(".slide").length;

let counter = 0;

let sliderInterval;

function slideEveryThreeSeconds() {

    sliderInterval = window.setInterval(() => {

        if (counter === slidesLength - 1) { // on the last slide

            counter = 0; // to the fist slide

        } else {

            counter++; // to the next slide

        }

        slide();

    }, 3000);

}

slideEveryThreeSeconds();

prevBtnEl.addEventListener("click", () => {

    window.clearInterval(sliderInterval);

    slideEveryThreeSeconds(); // reset timer

    if (counter === 0) { // first slide

        counter = slidesLength - 1; // to last slide

    } else {

        counter--;

    }

    slide();

});

nextBtnEl.addEventListener("click", () => {

    window.clearInterval(sliderInterval);

    slideEveryThreeSeconds(); // reset timer

    if (counter === slidesLength - 1) { // last slide

        counter = 0; // to first slide

    } else {

        counter++;

    }

    slide();

});

function slide() {

    slidesEl.style.transform = `translate(-${counter * 100}vw)`;

}

// Latest Products:

get("http://localhost:3000/products").then(products => {

    products.forEach(product => {
        
        createLatestProduct(product);

    });

});

function createLatestProduct(product) {

    const latestProductEl = document.createElement("div");

    latestProductEl.className = "latest-product";

    const latestProductImageEl = document.createElement("div");

    latestProductImageEl.className = "latest-product--image";

    const imageEl = document.createElement("img");

    imageEl.src = `/images/products/${product["product-image"]}`;

    imageEl.alt = "Latest Product";

    latestProductImageEl.appendChild(imageEl);

    latestProductEl.appendChild(latestProductImageEl);

    const latestProductInfoEl = document.createElement("div");

    latestProductInfoEl.className = "latest-product--info";

    const latestProductTitleEl = document.createElement("p");

    latestProductTitleEl.className = "latest-product--title";

    latestProductTitleEl.textContent = product["product-title"];

    latestProductInfoEl.appendChild(latestProductTitleEl);

    const latestProductPriceEl = document.createElement("span");

    latestProductPriceEl.className = "latest-product--price";

    latestProductPriceEl.textContent = `$${product["product-price"]}`;

    latestProductInfoEl.appendChild(latestProductPriceEl);

    latestProductEl.appendChild(latestProductInfoEl);

    const latestProductOnHoverEl = document.createElement("div");

    latestProductOnHoverEl.className = "latest-product--on-hover";

    const addToCartBtnEl = document.createElement("button");

    addToCartBtnEl.className = "btn";

    addToCartBtnEl.textContent = "Add To Cart";

    addToCartBtnEl.addEventListener("click", (e) => {

        e.preventDefault();

        post("http://localhost:3000/cart", {

            "id": product.id,

            "product-image": product["product-image"],

            "product-title": product["product-title"],

            "product-price": product["product-price"],

            quantity: 1

        });

    });

    latestProductOnHoverEl.appendChild(addToCartBtnEl);

    latestProductEl.appendChild(latestProductOnHoverEl);

    latestProductsContainerEl.appendChild(latestProductEl);

}

// Open | Close Cart Aside:

openCartBtnEl.addEventListener("click", () => {

    cartEl.classList.add("show");

});

closeCartBtnEl.addEventListener("click", () => {

    cartEl.classList.remove("show");

});

// Cart:

get("http://localhost:3000/cart").then(cartItems => {

    cartQuantityEl.textContent = cartItems.length;

    cartSubTotal.textContent = "$" + cartItems.reduce((acc, current) => {

        return acc + (current["product-price"] * current.quantity);

    }, 0).toFixed(2);

    if (cartItems.length > 0) {

        cartItemsEl.innerHTML = "";

        cartItems.forEach(cartItem => {

            createCartItem(cartItem);

        });

    } else {

        cartItemsEl.innerHTML = "<p class='empty-cart'>No Cart Items To Show!</p>"

    }

});

function createCartItem(cartItem) {

    const cartItemEl = document.createElement("div");

    cartItemEl.className = "cart-item";

    const cartItemInfoEl = document.createElement("cart-item--info");

    cartItemInfoEl.className = "cart-item--info";

    const imageEl = document.createElement("img");

    imageEl.src = `images/products/${cartItem["product-image"]}`;

    imageEl.alt = "Cart Item";

    cartItemInfoEl.appendChild(imageEl);

    const divEl = document.createElement("div");

    const cartItemTitleEl = document.createElement("p");

    cartItemTitleEl.className = "cart-item--title";

    cartItemTitleEl.textContent = cartItem["product-title"];

    divEl.appendChild(cartItemTitleEl);

    const cartItemPriceEl = document.createElement("span");

    cartItemPriceEl.className = "cart-item--price";

    cartItemPriceEl.textContent = `$${cartItem["product-price"] * cartItem.quantity}`;

    divEl.appendChild(cartItemPriceEl);

    cartItemInfoEl.appendChild(divEl);

    cartItemEl.appendChild(cartItemInfoEl);

    const cartItemQuantityControlEl = document.createElement("form");

    cartItemQuantityControlEl.className = "cart-item--quantity-control";

    const quantityIecreamentBtn = document.createElement("button");

    quantityIecreamentBtn.className = "quantity-decreament";

    quantityIecreamentBtn.textContent = "+"; // Increament

    quantityIecreamentBtn.addEventListener("click", () => {

        put(`http://localhost:3000/cart/${cartItem.id}`, {
            
            quantity: cartItem.quantity + 1
        
        });

    });

    cartItemQuantityControlEl.appendChild(quantityIecreamentBtn);

    const inputEl = document.createElement("input");

    inputEl.type = "number";

    inputEl.min = 1;

    inputEl.max = 8;

    inputEl.value = cartItem.quantity;

    inputEl.addEventListener("change", (e) => {

        if (e.currentTarget.value === "0") { // value is string

            deleteFunc(`http://localhost:3000/cart/${cartItem.id}`);

        } else {

            put(`http://localhost:3000/cart/${cartItem.id}`, {
                
                quantity: e.currentTarget.value
            
            });

        }  

    });

    cartItemQuantityControlEl.appendChild(inputEl);

    const quantityDecreamentBtn = document.createElement("button");

    quantityDecreamentBtn.className = "quantity-increament";

    quantityDecreamentBtn.textContent = "-"; // Decreament

    quantityDecreamentBtn.addEventListener("click", () => {

        if (cartItem.quantity === 1) {

            deleteFunc(`http://localhost:3000/cart/${cartItem.id}`);

        } else {

            put(`http://localhost:3000/cart/${cartItem.id}`, {
                
                quantity: cartItem.quantity - 1
            
            });

        }   

    });

    cartItemQuantityControlEl.appendChild(quantityDecreamentBtn);

    cartItemEl.appendChild(cartItemQuantityControlEl);

    const deleteCartItemBtn = document.createElement("button");

    deleteCartItemBtn.className = "delete-cart-item";

    deleteCartItemBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';

    deleteCartItemBtn.addEventListener("click", () => {

        deleteFunc(`http://localhost:3000/cart/${cartItem.id}`);

    });

    cartItemEl.appendChild(deleteCartItemBtn);

    cartItemsEl.appendChild(cartItemEl);

}

// Testimonial:

let testimonialsLength = testimonialEl.length;

let testimonial_index = 0;

let testimonialInterval;

function changeTestimonialEveryThreeSeconds() {

    testimonialInterval = window.setInterval(() => {

        if (testimonial_index === testimonialsLength - 1) { // last testimonial

            testimonial_index = 0; // to first testimonial

        } else {

            testimonial_index++; // next testimonial

        }

        changeTestimonial();

    }, 3000);

}

changeTestimonialEveryThreeSeconds();

testimonialsPrevBtn.addEventListener("click", () => {

    window.clearInterval(testimonialInterval);

    changeTestimonialEveryThreeSeconds();

    if (testimonial_index === 0) { // first testimonial

        testimonial_index = testimonialsLength - 1;

        // to last testimonial

    } else {

        testimonial_index--; // prev testimonial

    }

    changeTestimonial();

});

testimonialsNextBtn.addEventListener("click", () => {

    window.clearInterval(testimonialInterval);

    changeTestimonialEveryThreeSeconds();

    if (testimonial_index === testimonialsLength - 1) { // last testimonial

        testimonial_index = 0; // to first testimonial

    } else {

        testimonial_index++; // next testimonial

    }

    changeTestimonial();

});

function changeTestimonial() {

    testimonialEl.forEach(ele => {

        ele.classList.remove("show");

    });

    testimonialEl[testimonial_index].classList.add("show");

}

// Scroll To Top:

window.addEventListener("scroll", () => {

    if (window.scrollY >= 84) {

        toUpBtnEl.classList.add("show");

    } else {

        toUpBtnEl.classList.remove("show");

    }

});

toUpBtnEl.addEventListener("click", () => {

    window.scrollTo({

        top: 0,

        left: 0,

        behavior: "smooth"

    });

});





