import React, { useState } from 'react';
import dairyImg from '../assets/dairymain.png'; // Add actual images accordingly
import snacksImg from '../assets/snacksmain.png';
import bakeryImg from '../assets/bakerymain.png';
import pharmaImg from '../assets/pharmacy.png';
import bakeryData from '../data/bakery.json';
import dairyData from '../data/dairy.json';
import snacksData from '../data/snacks.json';
import pharmaData from '../data/pharmacy.json';
const categories = [
    {
        name: "Dairy & Bread",
        image: dairyImg,
        key: "Dairy"
    },
    {
        name: "Snacks & Munchies",
        image: snacksImg,
        key: "Snacks"
    },
    {
        name: "Bakery",
        image: bakeryImg,
        key: "Bakery"
    },
    {
        name: "Pharma & Wellness",
        image: pharmaImg,
        key: "Pharma"
    }
];
const categoryDataMap = {
    "Bakery": bakeryData,
    "Dairy": dairyData,
    "Snacks": snacksData,
    "Pharma": pharmaData
};
const Products = ({ addToCart }) => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [addedItems, setAddedItems] = useState([]);
    const renderProducts = () => {
        const products = categoryDataMap[selectedCategory];
        if (!products) return null;
        return (
            <div className="grid-main">
                <div className="product-grid">
                    {products.map(product => (
                        <div key={product.id} className="product-card-item">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="product-image"
                            />
                            <p className="product-name">{product.name}</p>
                            <p className="product-price">₹{product.price}</p>
                            {/* // Products.js - update addToCart usage inside onClick */}
                            <button
                                className="add-button"
                                onClick={async () => {
                                    const token = localStorage.getItem("token"); // or however you're storing it
                                    const response = await fetch("http://localhost:5000/api/cart/add", {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json",
                                            Authorization: `Bearer ${token}`,
                                        },
                                        body: JSON.stringify({
                                            product: { ...product, quantity: 1 },
                                        }),
                                    });

                                    if (response.ok) {
                                        setAddedItems(prev => [...prev, product.id]);
                                        setTimeout(() => {
                                            setAddedItems(prev => prev.filter(id => id !== product.id));
                                        }, 2000);
                                    } else {
                                        console.error("Failed to add to cart");
                                    }
                                }}
                                disabled={addedItems.includes(product.id)}
                            >
                                {addedItems.includes(product.id) ? '✔️ Added' : 'ADD'}
                            </button>

                        </div>
                    ))}
                </div>

            </div>
        );
    }
    return (
        <section className="products-section">
            <h2 className="products-heading">Shop By Category</h2>
            <div className="product-cards-container">
                {categories.map((category, idx) => (
                    <div className="product-card" key={idx}
                        onClick={() => setSelectedCategory(category.key)}
                        style={{ cursor: "pointer" }}>
                        <img src={category.image} alt={category.name} className="product-image" />
                        <p className="product-title">{category.name}</p>
                    </div>
                ))}
            </div>
            {/* render products */}
            {selectedCategory &&
                (
                    <>
                        <h3 className="category-heading">{selectedCategory.toUpperCase()} PRODUCTS</h3>
                        {renderProducts()}
                    </>
                )
            }
        </section>
    );
};

export default Products;
