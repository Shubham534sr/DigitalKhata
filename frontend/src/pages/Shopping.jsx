import "./Settings.css";
import { useEffect, useMemo, useState } from "react";
import {
  FiAlertTriangle,
  FiBox,
  FiCheckCircle,
  FiClock,
  FiFilter,
  FiMinus,
  FiPackage,
  FiPhone,
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiSend,
  FiShoppingCart,
  FiTrash2,
  FiTruck,
  FiUser,
  FiX,
} from "react-icons/fi";
import "./Shopping.css";
import {
  createShoppingOrder,
  getShoppingOrders,
  getShoppingProducts,
  updateShoppingOrderStatus,
} from "./shoppingService";

const formatMoney = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const formatDateTime = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const initialOrder = {
  customer_name: "",
  mobile: "",
  pickup_time: "",
  note: "",
};

const fallbackImage = "https://placehold.co/500x360/e5e7eb/334155?text=Product";
const orderStatuses = ["Placed", "Packing", "Ready", "Collected", "Cancelled"];
const orderFilters = ["Open", ...orderStatuses, "All"];

function Shopping() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState([]);
  const [order, setOrder] = useState(initialOrder);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [orderFilter, setOrderFilter] = useState("Open");
  const [orderSearch, setOrderSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadShopping = async () => {
    try {
      setLoading(true);
      setError("");
      const [productData, orderData] = await Promise.all([
        getShoppingProducts(),
        getShoppingOrders(),
      ]);
      setProducts(productData);
      setOrders(orderData);
    } catch (err) {
      console.log(err);
      setError("Shopping data load failed. Please check backend and database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadShopping();
  }, []);

  const categories = useMemo(
    () => ["All", ...new Set(products.map((product) => product.category).filter(Boolean))],
    [products]
  );

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    return products.filter((product) => {
      const matchSearch =
        !query ||
        [product.product_name, product.category, product.description]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query));
      const matchCategory = category === "All" || product.category === category;
      return matchSearch && matchCategory;
    });
  }, [products, search, category]);

  const cartTotal = useMemo(
    () => cart.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0),
    [cart]
  );

  const filteredOrders = useMemo(() => {
    const query = orderSearch.trim().toLowerCase();
    return orders.filter((item) => {
      const matchesFilter =
        orderFilter === "All" ||
        item.status === orderFilter ||
        (orderFilter === "Open" && !["Collected", "Cancelled"].includes(item.status));
      const matchesSearch =
        !query ||
        [item.customer_name, item.mobile, item.status, item.id]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query));
      return matchesFilter && matchesSearch;
    });
  }, [orderFilter, orderSearch, orders]);

  const shoppingStats = useMemo(
    () => ({
      inStock: products.filter((product) => Number(product.stock_qty || 0) > 0).length,
      lowStock: products.filter(
        (product) => Number(product.stock_qty || 0) > 0 && Number(product.stock_qty || 0) <= Number(product.min_stock || 0)
      ).length,
      readyOrders: orders.filter((item) => item.status === "Ready").length,
      activeOrders: orders.filter((item) => !["Collected", "Cancelled"].includes(item.status)).length,
    }),
    [orders, products]
  );

  const getCartQuantity = (productId) => cart.find((item) => item.product_id === productId)?.quantity || 0;

  const resetShoppingFilters = () => {
    setSearch("");
    setCategory("All");
  };

  const addToCart = (product) => {
    if (Number(product.stock_qty || 0) <= 0) {
      setError("This product is out of stock.");
      return;
    }

    setError("");
    setCart((items) => {
      const existing = items.find((item) => item.product_id === product.id);
      if (existing) {
        if (existing.quantity >= Number(product.stock_qty || 0)) {
          setError("Selected quantity reached available stock.");
          return items;
        }

        return items.map((item) =>
          item.product_id === product.id
            ? { ...item, quantity: Math.min(item.quantity + 1, Number(product.stock_qty || 0)) }
            : item
        );
      }

      return [
        ...items,
        {
          product_id: product.id,
          product_name: product.product_name,
          price: Number(product.price || 0),
          quantity: 1,
          stock_qty: Number(product.stock_qty || 0),
        },
      ];
    });
  };

  const updateCartQuantity = (productId, quantity) => {
    setCart((items) =>
      items
        .map((item) =>
          item.product_id === productId
            ? { ...item, quantity: Math.max(1, Math.min(Number(quantity || 1), item.stock_qty)) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const stepCartQuantity = (productId, change) => {
    setCart((items) =>
      items
        .map((item) =>
          item.product_id === productId
            ? { ...item, quantity: Math.max(0, Math.min(item.quantity + change, item.stock_qty)) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeCartItem = (productId) => {
    setCart((items) => items.filter((item) => item.product_id !== productId));
  };

  const handleOrderChange = (event) => {
    setOrder({ ...order, [event.target.name]: event.target.value });
  };

  const submitOrder = async (event) => {
    event.preventDefault();

    if (cart.length === 0) {
      setError("Please select at least one product.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      const payload = {
        ...order,
        items: cart.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
        })),
      };
      const result = await createShoppingOrder(payload);
      setMessage(result.message || "Order placed successfully.");
      setOrder(initialOrder);
      setCart([]);
      await loadShopping();
      window.setTimeout(() => setMessage(""), 2800);
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Order save failed.");
    } finally {
      setSaving(false);
    }
  };

  const changeStatus = async (id, status) => {
    try {
      setError("");
      await updateShoppingOrderStatus(id, status);
      await loadShopping();
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Status update failed.");
    }
  };

  const handleImageError = (event) => {
    event.currentTarget.src = fallbackImage;
  };

  return (
    <div className="shopping-page">
      <div className="shopping-header page-hero">
        <div>
          <span className="page-kicker"><FiShoppingCart /> Pickup orders</span>
          <h1>Shopping</h1>
          <p>Select products, build the cart, place orders, and track pickup status from one screen.</p>
        </div>
        <div className="shopping-search">
          <label className="control-with-icon">
            <FiSearch />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search product..." />
          </label>
          <label className="control-with-icon">
            <FiFilter />
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {(message || error) && <div className={error ? "shop-alert error" : "shop-alert success"}>{error || message}</div>}

      <section className="shopping-stats" aria-label="Shopping summary">
        <div className="shop-stat">
          <FiPackage />
          <span>Products in stock</span>
          <strong>{shoppingStats.inStock}</strong>
        </div>
        <div className="shop-stat warning">
          <FiAlertTriangle />
          <span>Low stock</span>
          <strong>{shoppingStats.lowStock}</strong>
        </div>
        <div className="shop-stat">
          <FiClock />
          <span>Active orders</span>
          <strong>{shoppingStats.activeOrders}</strong>
        </div>
        <div className="shop-stat success">
          <FiCheckCircle />
          <span>Ready pickup</span>
          <strong>{shoppingStats.readyOrders}</strong>
        </div>
      </section>

      <div className="category-strip" aria-label="Product categories">
        {categories.map((item) => (
          <button
            className={category === item ? "active" : ""}
            key={item}
            type="button"
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
        {(search || category !== "All") && (
          <button className="clear-filter-btn" type="button" onClick={resetShoppingFilters}>
            <FiX /> Clear
          </button>
        )}
      </div>

      <div className="shopping-layout">
        <section className="product-area">
          <div className="section-title-row">
            <div>
              <h2>Product Catalogue</h2>
              <p>{filteredProducts.length} products available for the current filter.</p>
            </div>
          </div>
          <div className="product-grid">
            {loading ? (
              Array.from({ length: 6 }).map((_, index) => <div className="shop-product-card product-skeleton" key={index} />)
            ) : filteredProducts.length ? (
              filteredProducts.map((product) => (
                <article className="shop-product-card" key={product.id}>
                  <button className="product-image-button" type="button" onClick={() => setSelectedProduct(product)}>
                    <img src={product.image_url || fallbackImage} alt={product.product_name} onError={handleImageError} />
                    {getCartQuantity(product.id) > 0 && <span className="cart-count-badge">{getCartQuantity(product.id)}</span>}
                  </button>
                  <div className="product-body">
                    <div>
                      <h2>{product.product_name}</h2>
                      <span className="product-category"><FiBox /> {product.category || "General"}</span>
                    </div>
                    <strong>{formatMoney(product.price)}</strong>
                    <p>{product.description || "Product details available."}</p>
                    <div className="stock-meter" aria-label={`${product.stock_qty || 0} stock available`}>
                      <span
                        style={{
                          width: `${Math.min(100, Math.max(6, (Number(product.stock_qty || 0) / Math.max(Number(product.min_stock || 1) * 3, 1)) * 100))}%`,
                        }}
                      />
                    </div>
                    <div className="product-actions">
                      <button type="button" onClick={() => setSelectedProduct(product)}>
                        Details
                      </button>
                      <button type="button" onClick={() => addToCart(product)} disabled={Number(product.stock_qty || 0) <= 0}>
                        Select
                      </button>
                    </div>
                    <small
                      className={
                        Number(product.stock_qty || 0) <= 0
                          ? "stock-low"
                          : Number(product.stock_qty || 0) <= Number(product.min_stock || 0)
                            ? "stock-warning"
                            : ""
                      }
                    >
                      Stock: {product.stock_qty || 0}
                    </small>
                  </div>
                </article>
              ))
            ) : (
              <div className="empty-shop">No products found.</div>
            )}
          </div>
        </section>

        <aside className="cart-panel">
          <div className="cart-panel-title">
            <div>
              <h2>Order Cart</h2>
              <p>{cart.length ? `${cart.length} selected item${cart.length > 1 ? "s" : ""}` : "No product selected"}</p>
            </div>
            <FiShoppingCart />
          </div>
          <form className="cart-form" onSubmit={submitOrder}>
            <div className="order-field-grid">
              <label>
                Customer Name
                <span className="input-shell">
                  <FiUser />
                  <input name="customer_name" value={order.customer_name} onChange={handleOrderChange} required />
                </span>
              </label>
              <label>
                Mobile
                <span className="input-shell">
                  <FiPhone />
                  <input name="mobile" value={order.mobile} onChange={handleOrderChange} inputMode="tel" />
                </span>
              </label>
            </div>
            <label>
              Preferred Pickup Time
              <span className="input-shell">
                <FiClock />
                <input type="datetime-local" name="pickup_time" value={order.pickup_time} onChange={handleOrderChange} required />
              </span>
            </label>

            <div className="cart-items">
              {cart.length ? (
                cart.map((item) => (
                  <div className="cart-row" key={item.product_id}>
                    <div>
                      <strong>{item.product_name}</strong>
                      <span>{formatMoney(item.price)} each</span>
                    </div>
                    <div className="qty-stepper">
                      <button type="button" aria-label="Reduce quantity" onClick={() => stepCartQuantity(item.product_id, -1)}>
                        <FiMinus />
                      </button>
                      <input
                        type="number"
                        min="1"
                        max={item.stock_qty}
                        value={item.quantity}
                        onChange={(event) => updateCartQuantity(item.product_id, event.target.value)}
                        aria-label={`${item.product_name} quantity`}
                      />
                      <button type="button" aria-label="Increase quantity" onClick={() => stepCartQuantity(item.product_id, 1)}>
                        <FiPlus />
                      </button>
                    </div>
                    <button className="remove-cart-btn" type="button" aria-label={`Remove ${item.product_name}`} onClick={() => removeCartItem(item.product_id)}>
                      <FiTrash2 />
                    </button>
                  </div>
                ))
              ) : (
                <div className="cart-empty">
                  <FiShoppingCart />
                  <span>Select products from the catalogue to build the order.</span>
                </div>
              )}
            </div>

            <label>
              Note
              <textarea name="note" value={order.note} onChange={handleOrderChange} rows="3" />
            </label>

            <div className="cart-total">
              <span>Total</span>
              <strong>{formatMoney(cartTotal)}</strong>
            </div>

            <button className="place-order-btn" type="submit" disabled={saving || cart.length === 0}>
              <FiSend />
              {saving ? "Placing..." : "Place Order"}
            </button>
          </form>
        </aside>
      </div>

      <section className="orders-panel">
        <div className="section-title-row">
          <div>
            <h2>Order Pickup Flow</h2>
            <p>Move each order from placed to collected as the packing work finishes.</p>
          </div>
          <div className="orders-tools">
            <label className="control-with-icon compact">
              <FiSearch />
              <input value={orderSearch} onChange={(event) => setOrderSearch(event.target.value)} placeholder="Search orders..." />
            </label>
            <label className="control-with-icon compact">
              <FiFilter />
              <select value={orderFilter} onChange={(event) => setOrderFilter(event.target.value)}>
                {orderFilters.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
            </label>
            <button className="refresh-btn" type="button" onClick={loadShopping}>
              <FiRefreshCw /> Refresh
            </button>
          </div>
        </div>
        <div className="orders-grid">
          {filteredOrders.length ? (
            filteredOrders.map((item) => (
              <article className="order-card" key={item.id}>
                <div className="order-top">
                  <div>
                    <strong>#{item.id} {item.customer_name}</strong>
                    <span>{formatDateTime(item.pickup_time)}</span>
                  </div>
                  <span className={`order-status-pill ${item.status?.toLowerCase()}`}>{item.status}</span>
                </div>
                {item.mobile && (
                  <div className="order-contact">
                    <FiPhone />
                    <span>{item.mobile}</span>
                  </div>
                )}
                <div className="order-status-row">
                  <select value={item.status} onChange={(event) => changeStatus(item.id, event.target.value)}>
                    {orderStatuses.map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>
                </div>
                <p>{item.items?.map((product) => `${product.product_name} x ${product.quantity}`).join(", ")}</p>
                <div className="order-bottom">
                  <span><FiTruck /> {item.status === "Ready" ? "Customer can collect order" : "Prepare before pickup"}</span>
                  <b>{formatMoney(item.total_amount)}</b>
                </div>
              </article>
            ))
          ) : (
            <div className="empty-shop">No orders found.</div>
          )}
        </div>
      </section>

      {selectedProduct && (
        <div className="product-modal-backdrop" onClick={() => setSelectedProduct(null)}>
          <div className="product-modal" onClick={(event) => event.stopPropagation()}>
            <button className="modal-close-btn" type="button" aria-label="Close details" onClick={() => setSelectedProduct(null)}>
              <FiX />
            </button>
            <img src={selectedProduct.image_url || fallbackImage} alt={selectedProduct.product_name} onError={handleImageError} />
            <div>
              <h2>{selectedProduct.product_name}</h2>
              <strong>{formatMoney(selectedProduct.price)}</strong>
              <p>{selectedProduct.description || "Product details available."}</p>
              <span>Available stock: {selectedProduct.stock_qty || 0}</span>
              <div className="modal-actions">
                <button type="button" onClick={() => setSelectedProduct(null)}>Close</button>
                <button type="button" onClick={() => addToCart(selectedProduct)}>Add To Cart</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Shopping;
