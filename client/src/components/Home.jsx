import React, { useState } from 'react';
import vehicle from '../assets/vehicle.png';
import grocery from '../assets/groceries.png';
import pharmacy from '../assets/pharmacy.png';

const Home = () => {
  const [hovered, setHovered] = useState(false);

  return (
    <main className="home">
      <section className="hero">
        <div className="hero-text">
          <h1 className="fade-in">Deliver Fast,<br />Dispatch Smarter</h1>

          <p className="fade-in">Explore the products now <span
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className={`arrow ${hovered ? 'arrow-hover' : ''}`}
          >  <a href="#" className='arrow'>→</a></span>
          </p>

        </div>
        <div className="hero-image">
          <img src={vehicle} alt="Hero" />
        </div>
      </section>

      <section className="cards">
        <div className="card pharmacy">
          <div className="card-left">
            <h3>Pharmacy at your doorstep</h3>
            <button className="card-btn">Order Now</button>
          </div>
          <div className="card-right">
            <img src={pharmacy} alt="Pharmacy" />
          </div>
        </div>
        <div className="card grocery">
          <div className="card-left">
            <h3>Groceries in minutes</h3>
            <button className="card-btn">Order Now</button>
          </div>
          <div className="card-right">
            <img src={grocery} alt="Pharmacy" />
          </div>
        </div>

        <div className="card yellow">
          <h3>Track your orders</h3>
          <p>Get notified in real time</p>
          <button className="card-btn track">Track Now</button>
        </div>
      </section>
    </main>
  );
};

export default Home;
