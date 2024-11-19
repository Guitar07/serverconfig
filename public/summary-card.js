class ServerSummaryCard {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.options = {
            basePrice: 1500.00,
            vatRate: 0.20,
            ...options
        };
        this.state = {
            selectedOptions: {},
            quantity: 1,
            showDetails: false
        };
        this.init();
    }

    init() {
        // Listen for messages from the configurator iframe
        window.addEventListener('message', (event) => {
            // In production, replace '*' with your actual domain
            // if (event.origin !== 'YOUR_CONFIGURATOR_DOMAIN') return;

            const { type, ...data } = event.data;
            switch (type) {
                case 'configUpdate':
                    this.updateState(data);
                    break;
                case 'quantityUpdate':
                    this.state.quantity = data.quantity;
                    this.render();
                    break;
                case 'toggleDetails':
                    this.state.showDetails = data.showDetails;
                    this.render();
                    break;
            }
        });

        // Initial render
        this.render();
    }

    updateState(data) {
        if (data.selectedOptions) {
            this.state.selectedOptions = data.selectedOptions;
        }
        if (data.basePrice) {
            this.options.basePrice = data.basePrice;
        }
        this.render();
    }

    formatPrice(price) {
        return price.toLocaleString('en-GB', {
            style: 'currency',
            currency: 'GBP',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    calculatePrices() {
        const subtotal = this.options.basePrice * this.state.quantity;
        const vat = subtotal * this.options.vatRate;
        const total = subtotal + vat;
        return { subtotal, vat, total };
    }

    render() {
        const { subtotal, vat, total } = this.calculatePrices();
        
        this.container.innerHTML = `
            <div class="summary-content">
                <div class="system-section">
                    <h3>Your System</h3>
                    <div class="base-price">
                        <span>Base Price:</span>
                        <span>${this.formatPrice(this.options.basePrice)}</span>
                    </div>
                </div>

                <div class="selected-options">
                    <div class="options-header">
                        <span>Selected Options</span>
                        <span>${this.formatPrice(0)}</span>
                    </div>
                    <button class="toggle-details" onclick="summaryCard.toggleDetails()">
                        ${this.state.showDetails ? 'Hide Details' : 'Show Details'}
                    </button>
                    
                    <div class="details-section" style="display: ${this.state.showDetails ? 'block' : 'none'}">
                        ${this.renderSelectedOptions()}
                    </div>
                </div>

                <div class="quantity-section">
                    <label for="quantity">Quantity:</label>
                    <div class="quantity-input">
                        <button onclick="summaryCard.updateQuantity('decrease')">-</button>
                        <input type="number" id="quantity" value="${this.state.quantity}" min="1" 
                               onchange="summaryCard.updateQuantity('set', this.value)"/>
                        <button onclick="summaryCard.updateQuantity('increase')">+</button>
                    </div>
                </div>

                <div class="lead-time">
                    <span class="asterisk">*</span>Est Lead time: 5-7 days
                </div>

                <div class="price-breakdown">
                    <div class="subtotal">
                        <span>Subtotal (ex. VAT)</span>
                        <span>${this.formatPrice(subtotal)}</span>
                    </div>
                    <div class="vat">
                        <span>VAT (20%)</span>
                        <span>${this.formatPrice(vat)}</span>
                    </div>
                    <div class="total">
                        <span>Total (inc. VAT)</span>
                        <span>${this.formatPrice(total)}</span>
                    </div>
                </div>

                <button class="add-to-cart" onclick="summaryCard.addToCart()">
                    Add to Cart
                </button>
            </div>
        `;
    }

    renderSelectedOptions() {
        // This will be populated with actual selected options from the configurator
        return Object.entries(this.state.selectedOptions)
            .map(([category, option]) => `
                <div class="detail-item">
                    <span class="detail-label">${category}:</span>
                    <span class="detail-value">${option}</span>
                </div>
            `).join('');
    }

    updateQuantity(action, value) {
        let newValue = parseInt(this.state.quantity);
        
        switch(action) {
            case 'increase':
                newValue++;
                break;
            case 'decrease':
                newValue = Math.max(1, newValue - 1);
                break;
            case 'set':
                newValue = Math.max(1, parseInt(value));
                break;
        }
        
        this.state.quantity = newValue;
        this.render();

        // Notify the configurator iframe
        if (window.configuratorFrame) {
            configuratorFrame.contentWindow.postMessage({
                type: 'quantityUpdate',
                quantity: newValue
            }, '*');
        }
    }

    toggleDetails() {
        this.state.showDetails = !this.state.showDetails;
        this.render();

        // Notify the configurator iframe
        if (window.configuratorFrame) {
            configuratorFrame.contentWindow.postMessage({
                type: 'toggleDetails',
                showDetails: this.state.showDetails
            }, '*');
        }
    }

    addToCart() {
        // This method will integrate with Shopify's cart API
        const { total } = this.calculatePrices();
        
        // Example Shopify cart addition
        fetch('/cart/add.js', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                items: [{
                    id: YOUR_PRODUCT_VARIANT_ID, // Replace with your Shopify product variant ID
                    quantity: this.state.quantity,
                    properties: {
                        ...this.state.selectedOptions,
                        configuration_total: total
                    }
                }]
            })
        })
        .then(response => response.json())
        .then(data => {
            // Redirect to cart or show success message
            window.location.href = '/cart';
        })
        .catch(error => {
            console.error('Error adding to cart:', error);
        });
    }
}
