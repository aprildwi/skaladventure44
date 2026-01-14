// components/Banner.jsx
import { Link } from 'react-router-dom';
import { FiArrowRight, FiMap, FiCompass } from 'react-icons/fi';

function Banner() {
  return (
    <div className="hero-banner">
      {/* Background Image */}
      <div 
        className="banner-overlay"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=1600&h=900&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      ></div>
      
      <div className="banner-content fade-in-up">
        <span className="banner-subtitle">
          <FiCompass /> Explore The Wilderness
        </span>
        <h1 className="banner-title">
          Gear Up For Your
          <br />
          Next Adventure
        </h1>
        <p className="banner-description">
          Premium outdoor equipment for camping, hiking, climbing, and survival. 
          Trusted by adventurers worldwide. Ready for any terrain, any weather.
        </p>
        <div className="flex gap-4">
          <Link to="/products" className="btn btn-adventure">
            Shop Gear <FiArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Banner;