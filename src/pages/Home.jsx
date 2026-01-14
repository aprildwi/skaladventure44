// pages/Home.jsx
import Banner from '../components/Banner';
import ProductCard from '../components/ProductCard';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiTruck, FiShield, FiClock, FiAward } from 'react-icons/fi';
import { GiMountainClimbing, GiCampingTent } from 'react-icons/gi';
import productsData from '../data/products.json';

function Home() {
  const featuredProducts = productsData.slice(0, 4);
  const trendingProducts = productsData.slice(4, 8);

  const features = [
    {
      icon: <FiTruck />,
      title: "Free Shipping",
      description: "On orders over Rp 500,000"
    },
    {
      icon: <FiShield />,
      title: "2-Year Warranty",
      description: "Quality guarantee"
    },
    {
      icon: <FiClock />,
      title: "24/7 Support",
      description: "Expert advice"
    },
    {
      icon: <FiAward />,
      title: "Premium Quality",
      description: "Tested in wilderness"
    }
  ];

  const categories = [
    {
      name: "Camping",
      icon: <GiCampingTent />,
      count: "24 Products",
      image: "https://images.unsplash.com/photo-1504851149312-7a075b496cc7?w=400&h=250&fit=crop"
    },
    {
      name: "Hiking",
      icon: <GiMountainClimbing />,
      count: "18 Products",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop"
    }
  ];

  return (
    <div className="home">
      {/* Hero Banner */}
      <Banner />

      {/* Features */}
      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h4>{feature.title}</h4>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="products-section">
        <div className="container">
          <div className="section-header">
            <h2>Featured Products</h2>
            <Link to="/products" className="section-link">
              View All <FiArrowRight />
            </Link>
          </div>
          <div className="product-grid">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="products-section">
        <div className="container">
          <div className="section-header">
            <h2>Trending Now</h2>
            <Link to="/products" className="section-link">
              View All <FiArrowRight />
            </Link>
          </div>
          <div className="product-grid">
            {trendingProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready for Your Next Adventure?</h2>
            <p>Join thousands of outdoor enthusiasts who trust our gear</p>
            <div className="cta-buttons">
              <Link to="/products" className="btn btn-primary">
                Shop All Gear
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;