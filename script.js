let dishes = [
  {
    name: "Pizza Carlos",
    description: "mit Pepperonisalami und Sauce Hollandaise",
    price: 7.5,
    category: "pizza",
  },
  {
    name: "Pizza Margharita",
    description: "mit Käse",
    price: 3.5,
    category: "pizza",
  },
  {
    name: "Pizza Pasta",
    description: "mit Pasta du unhold",
    price: 63.5,
    category: "pizza",
  },
];

let currentBasket = [
  {
    name: "Pizza Margharita",
    quantity: 1,
    price: 3.5,
  },
];

function init() {
  renderDishes();
  renderBasket();
}

function renderDishes() {
  let mainDishesRef = document.getElementById("main-dishes");

  for (let i = 0; i < dishes.length; i++) {
    mainDishesRef.innerHTML += getDishTemplate(i);
  }
}
function getDishTemplate(index) {
    let dish = dishes[index];
  return `
        <div class="dish">
            <div class="dish-content">
                <h1 class="heading">${dish.name}</h1>
                <span class="dish-description">${dish.description}</span>
                <span class="price">${formatMoney(dish.price)} €</span>
            </div>
            <div onclick="addToBasket(${index})"> <i class="fa-solid fa-plus fa-xl"></i></div>
         </div>
    `;
}

function renderBasket() {
  renderBasketContent();
  renderBasketCheckout();
}

function renderBasketContent() {
  let basketContentRef = document.getElementById("basket-content");
  basketContentRef.innerHTML = "";
  let overlayRef = document.getElementById('basket-overlay-content');
  overlayRef.innerHTML = "";

  for (let i = 0; i < currentBasket.length; i++) {
    basketContentRef.innerHTML += getBasketEntryTemplate(i);
    overlayRef.innerHTML += getBasketEntryTemplate(i);
  }
}

function getBasketEntryTemplate(index) {
  let basketEntry = currentBasket[index];
  let actualPriceOfEntry = formatMoney(
    basketEntry.quantity * basketEntry.price
  );

  return `
            <div class="basket-entry pd-12">
                <span class="basket-dish-title">${basketEntry.name}</span>
                <div class="basket-dish-content">
                    <div class="entry-upselling">
                        <i onclick="downsellEntry(${index})" class="fa-solid fa-minus fa-sm" style="color: var(--orange);"></i>
                        <span>${basketEntry.quantity}</span>
                        <i onclick="upsellEntry(${index})" class="fa-solid fa-plus fa-sm" style="color: var(--orange)"></i>
                    </div>
                    <div class="entry-price">
                        <span>${actualPriceOfEntry} €</span>
                        <i onclick="removeBasketItem(${index})" class="fa-solid fa-trash fa-sm" style="color: var(--orange);"></i>
                    </div>
                </div>
            </div>
            <hr>
    `;
}

function renderBasketCheckout() {
    let basketCheckoutRef = document.getElementById('basket-checkout');
    let subTotal = 0 ;
    let orderFee = 5;

    currentBasket.forEach(dish => subTotal += dish.price * dish.quantity);
    basketCheckoutRef.innerHTML = getBasketCheckoutTemplate(formatMoney(subTotal),formatMoney(orderFee),formatMoney(subTotal+orderFee))

    let overlayRef = document.getElementById('basket-overlay-checkout');
    overlayRef.innerHTML = getBasketCheckoutTemplate(formatMoney(subTotal),formatMoney(orderFee),formatMoney(subTotal+orderFee));

}

function getBasketCheckoutTemplate(subTotal,orderFee, total) {
    return `
            <div class="basket-price-container">
                <span>Zwischensumme</span><span>${subTotal} €</span>
            </div>
            <div class="basket-price-container">
                <span>Lieferkosten</span><span>${orderFee} €</span>
            </div>
            <div class="basket-price-container bold">
                <span>Gesamt</span><span>${total}€</span>
            </div>
    `;
}

function upsellEntry(index) {
  currentBasket[index].quantity++;
  renderBasket();
}

function downsellEntry(index) {
  if (currentBasket[index].quantity === 1) {
    removeBasketItem(index);
  } else {
    currentBasket[index].quantity--;
    renderBasket();
  }

}

function addToBasket(index) {
  console.log(`Adding ${dishes[index].name} to basket`);
  let dish = dishes[index];
  
    let dishAlreadyInBasket = isDishAlreadyInBasket(dish);

    if(dishAlreadyInBasket !== -1) {
        currentBasket[dishAlreadyInBasket].quantity++;
    } else {
        currentBasket.push({
            "name": dish.name,
            "quantity" : 1,
            "price" : dish.price
        });
    }

    renderBasket();
}

function isDishAlreadyInBasket(dish) {
    let index = -1;
    for(let i = 0; i < currentBasket.length; i++) {
        if(currentBasket[i].name === dish.name){
            index = i;
        }
    }

    return index;
}

function removeBasketItem(index){
    currentBasket.splice(index, 1);
    renderBasket();
}

function formatMoney(price) {
  let priceString = Number(price).toFixed(2).replace(".", ",");
  return priceString;
}

function toggleBasketOverlay() {
  document.getElementById('basket-overlay').classList.toggle('d-none');
  document.getElementById('content').classList.toggle('d-none');
  document.getElementById('header').classList.toggle('d-none');
}
