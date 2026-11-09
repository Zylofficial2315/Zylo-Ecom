// products.js

// 1. Inga unga Google Sheet CSV link-a paste pannunga
const sheetUrl = "[https://docs.google.com/spreadsheets/d/e/2PACX-1vThmDvmzfUgAoXHEW6DGdKZcJG0Zw9kRU8cTc9l_PfXiJfQUmeDmc4paYjW9GZisyXLQAgNXJvTmX2_/pub?output=csv)";

// Namma products ellam intha array-la thaan save aagum
let products = [];

async function loadProductsFromSheet() {
    try {
        const response = await fetch(sheetUrl);
        const csvText = await response.text();
        
        // CSV file-a text-la irunthu JavaScript array-a maathurathu
        const lines = csvText.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        
        for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim() === '') continue;
            
            // Description-kulla comma iruntha problem aagama irukka intha regex split use aagum
            const currentLine = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
            let obj = {};
            
            headers.forEach((header, index) => {
                let value = currentLine[index] || '';
                // Extra quotes iruntha remove pandrathu
                obj[header] = value.replace(/^"|"$/g, '').trim(); 
            });
            
            products.push(obj);
        }
        
        console.log("Sheet-la irunthu vantha products:", products);
        
        // 2. Inga unga UI-a kaattura function-a call pannanum
        // Unga script.js-la products-a display panna enna function vachirukingalo atha inga podanum.
        // Example-ku: renderProducts(products); allathu displayItems(products);
        if (typeof renderProducts === 'function') {
            renderProducts(products); 
        }
        
    } catch (error) {
        console.error("Products load aagala boss, error ithuthaan:", error);
    }
}

// Function-a start panrom
loadProductsFromSheet();