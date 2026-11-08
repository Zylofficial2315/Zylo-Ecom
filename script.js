// --- 1. HTML Elements-a JavaScript-la edukkurom ---
const grid = document.getElementById("productGrid");
const search = document.getElementById("searchInput");
const count = document.getElementById("resultCount");
const empty = document.getElementById("emptyState");
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// --- 2. Variables (Filter panra values) ---
let activeCategory = "All";
let query = "";

// --- 3. Security Function (HTML injection thadukka) ---
function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

// --- 4. Main Render Function (Products-a display panna) ---
function render() {
    // Category matrum Search query vechu products-a filter pandrom
    const matches = products.filter(p => {
        const matchesCategory = (activeCategory === "All" || p.category === activeCategory);
        const matchesSearch = (`${p.name} ${p.category} ${p.description}`.toLowerCase().includes(query));
        return matchesCategory && matchesSearch;
    });

    // Filter aana products-a HTML-la create panni website-la kaaturom
    grid.innerHTML = matches.map(p => `
        <article class="product-card">
            <div class="product-art" aria-hidden="true">${p.emoji}</div>
            <div class="product-info">
                <h3>${escapeHTML(p.name)}</h3>
                <p>${escapeHTML(p.description)}</p>
                <span class="price">₹${p.price.toLocaleString("en-IN")}</span>
                <span class="demo-tag">DEMO PRICE</span>
                <a href="#" data-product="${p.id}" class="product-link">Affiliate link coming soon ↗</a>
            </div>
        </article>
    `).join("");

    // Results count update pandrom
    count.textContent = `${matches.length} demo products`;
    
    // Products illana 'Empty State' message kaaturom
    empty.classList.toggle("hidden", matches.length !== 0);
}

// --- 5. Actions & Events (Click, Type pannum pothu enna nadakanum) ---

// Search bar-la type pannum pothu
search.addEventListener("input", e => {
    query = e.target.value.trim().toLowerCase();
    render();
});

// Category buttons-a click pannum pothu
document.getElementById("categoryList").addEventListener("click", e => {
    const button = e.target.closest("button[data-category]");
    if (!button) return; // Button click aagalana onnum panna vendam

    // Active category-a set panni matha buttons-oda style mathurom
    activeCategory = button.dataset.category;
    document.querySelectorAll(".category").forEach(b => {
        b.classList.toggle("active", b === button);
    });
    
    render();
});

// Demo AI Assistant Form submit pannum pothu
document.getElementById("assistantForm").addEventListener("submit", e => {
    e.preventDefault(); // Page refresh aaguratha thadukka
    const text = document.getElementById("assistantInput").value.toLowerCase();
    
    // Type panna text-la budget (₹) and category iruka nu thedurom
    const budgetMatch = text.match(/(?:under|below|less than)\s*₹?\s*(\d+)/);
    const categoryMatch = ["fashion", "home", "kitchen", "beauty", "electronics", "kids", "toy"].find(c => text.includes(c));

    // Category iruntha atha select pandrom
    if (categoryMatch) {
        if (categoryMatch === "home" || categoryMatch === "kitchen") activeCategory = "Home & Kitchen";
        else if (categoryMatch === "kids" || categoryMatch === "toy") activeCategory = "Kids & Toys";
        else activeCategory = categoryMatch.charAt(0).toUpperCase() + categoryMatch.slice(1);

        if (!["Fashion", "Beauty", "Electronics", "Home & Kitchen", "Kids & Toys"].includes(activeCategory)) {
            activeCategory = "All";
        }

        // Category button-a highlight pandrom
        document.querySelectorAll(".category").forEach(b => {
            b.classList.toggle("active", b.dataset.category === activeCategory);
        });
    }

    query = ""; // Normal search query-a clear pandrom

    // Budget match aana athuketha maari filter pandrom
    if (budgetMatch) {
        const max = Number(budgetMatch[1]);
        const filtered = products.filter(p => (activeCategory === "All" || p.category === activeCategory) && p.price <= max);
        
        grid.innerHTML = filtered.map(p => `
            <article class="product-card">
                <div class="product-art">${p.emoji}</div>
                <div class="product-info">
                    <h3>${escapeHTML(p.name)}</h3>
                    <p>${escapeHTML(p.description)}</p>
                    <span class="price">₹${p.price.toLocaleString("en-IN")}</span>
                    <span class="demo-tag">DEMO PRICE</span>
                    <a href="#">Affiliate link coming soon ↗</a>
                </div>
            </article>
        `).join("");
        
        count.textContent = `${filtered.length} demo matches`;
        empty.classList.toggle("hidden", filtered.length !== 0);
        document.getElementById("assistantMessage").textContent = `Demo filter: showing catalogue items at or below ₹${max}. This is not an AI-powered recommendation yet.`;
    } else {
        render();
        document.getElementById("assistantMessage").textContent = "Demo assistant: try a request such as “kitchen products under ₹500”. Category and budget matching are basic rules, not AI."; 
    }

    // Products section-ku keezha scroll pandrom
    document.getElementById("discover").scrollIntoView({ behavior: "smooth" });
});

// --- 6. Dark Theme Toggle Logic ---

// Browser-la already save aagiruka theme-a load panna
if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-theme');
    themeToggle.textContent = '☀️';
}

// Button click pannum pothu light/dark switch aaga
themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-theme');
    
    if (body.classList.contains('dark-theme')) {
        localStorage.setItem('theme', 'dark');
        themeToggle.textContent = '☀️';
    } else {
        localStorage.setItem('theme', 'light');
        themeToggle.textContent = '🌙';
    }
});

// --- 7. Final Setup (Page load aagum pothu run aaganum) ---
document.getElementById("year").textContent = new Date().getFullYear(); // Footer-la year podurathuku
render(); // First time products-a display panna