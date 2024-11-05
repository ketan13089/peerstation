import React, { useState } from 'react';
import { ShoppingCart, X, Clock, Star, ChevronRight } from 'lucide-react';
import styles from './Courses.module.css';

interface Course {
  id: number;
  name: string;
  description: string;
  price: number;
  newPrice: number;
  hours: number;
  rating: number;
  image: string;
}

const Courses = () => {
  const [cartItems, setCartItems] = useState<Course[]>([]);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [redeemedCoins, setRedeemedCoins] = useState(0);

  const MAX_DISCOUNT_COINS = 100;

  const courses: Course[] = [
    { id: 1, name: 'React for Beginners', description: 'Learn the basics of React and build interactive UIs.', price: 4900, newPrice: 3900, hours: 20, rating: 4.5, image: 'react.png' },
    { id: 2, name: 'Advanced JavaScript', description: 'Master advanced JavaScript concepts and features.', price: 5900, newPrice: 4900, hours: 15, rating: 4.0, image: 'js.jpg' },
    { id: 3, name: 'CSS Mastery', description: 'Become a pro at CSS and responsive design mastery.', price: 3900, newPrice: 2900, hours: 10, rating: 4.8, image: 'css.jpg' },
    { id: 4, name: 'Python for Data Science', description: 'Explore data science with Python and libraries like NumPy and Pandas.', price: 7900, newPrice: 6900, hours: 25, rating: 4.2, image: 'python.jpg' },
    { id: 5, name: 'Full-Stack Web Development', description: 'Learn front-end and back-end development for full-stack skills.', price: 9900, newPrice: 8900, hours: 30, rating: 4.9, image: 'full.png' },
    { id: 6, name: 'Machine Learning Basics', description: 'Get started with machine learning algorithms and concepts.', price: 8900, newPrice: 7900, hours: 20, rating: 4.3, image: 'machine.jpg' },
    { id: 7, name: 'UI/UX Design Essentials', description: 'Design user-friendly interfaces with a focus on user experience.', price: 6900, newPrice: 5900, hours: 15, rating: 4.7, image: 'uiux.jpg' },
    { id: 8, name: 'Database Design and SQL', description: 'Learn to design databases and write efficient SQL queries.', price: 5500, newPrice: 4500, hours: 12, rating: 4.6, image: 'sql.jpg' },
    { id: 9, name: 'Java Programming', description: 'Become proficient in Java programming for various applications.', price: 6500, newPrice: 5500, hours: 18, rating: 4.4, image: 'java.png' },
    { id: 10, name: 'Cybersecurity Fundamentals', description: 'Learn how to secure systems and protect data from cyber threats.', price: 7900, newPrice: 6900, hours: 22, rating: 4.1, image: 'cyber.jpg' },
  ];

  const addToCart = (course: Course) => {
    setCartItems([...cartItems, course]);
  };

  const removeFromCart = (indexToRemove: number) => {
    setCartItems(cartItems.filter((_, index) => index !== indexToRemove));
  };

  const totalAmount = cartItems.reduce((total, item) => total + item.newPrice, 0);
  const calculatedDiscount = Math.min(redeemedCoins, MAX_DISCOUNT_COINS);
  const discountPercent = (calculatedDiscount / 100) * 5;
  const discount = (discountPercent / 100) * totalAmount;
  const finalAmount = totalAmount - discount;

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.content}>
          <div className={styles.coursesSection}>
            <div className={styles.header}>
              <h1 className={styles.title}>Popular Courses</h1>
              <p className={styles.subtitle}>Use coins for additional discounts on these courses!</p>
            </div>

            <div className={styles.coursesGrid}>
              {courses.map((course) => (
                <div key={course.id} className={styles.courseCard}>
                  <div className={styles.imageContainer}>
                    <img 
                      src={`/images/${course.image}`} // Updated image source
                      alt={course.name}
                      className={styles.courseImage}
                    />
                  </div>
                  
                  <div className={styles.courseContent}>
                    <h3 className={styles.courseName}>{course.name}</h3>
                    <p className={styles.courseDescription}>{course.description}</p>
                    
                    <div className={styles.courseMetadata}>
                      <div className={styles.duration}>
                        <Clock className={styles.icon} />
                        <span>{course.hours}h</span>
                      </div>
                      <div className={styles.rating}>
                        {[...Array(5)].map((_, index) => (
                          <Star
                            key={index}
                            className={`${styles.star} ${
                              index < Math.floor(course.rating)
                                ? styles.starFilled
                                : styles.starEmpty
                            }`}
                          />
                        ))}
                        <span className={styles.ratingValue}>({course.rating})</span>
                      </div>
                    </div>

                    <div className={styles.courseFooter}>
                      <div className={styles.priceContainer}>
                        <span className={styles.oldPrice}>₹{course.price}</span>
                        <span className={styles.newPrice}>₹{course.newPrice}</span>
                      </div>
                      <button
                        onClick={() => addToCart(course)}
                        className={styles.addToCartButton}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Sidebar */}
          <div className={`${styles.cart} ${isCartVisible ? styles.cartVisible : ''}`}>
            <div className={styles.cartContent}>
              <div className={styles.cartHeader}>
                <h2 className={styles.cartTitle}>Shopping Cart</h2>
                <button
                  onClick={() => setIsCartVisible(false)}
                  className={styles.closeCart}
                >
                  <X className={styles.icon} />
                </button>
              </div>

              <div className={styles.cartItems}>
                {cartItems.length === 0 ? (
                  <div className={styles.emptyCart}>
                    <ShoppingCart className={styles.emptyCartIcon} />
                    <p className={styles.emptyCartText}>Your cart is empty</p>
                  </div>
                ) : (
                  <div className={styles.cartItemsList}>
                    {cartItems.map((item, index) => (
                      <div key={index} className={styles.cartItem}>
                        <div className={styles.cartItemInfo}>
                          <h4 className={styles.cartItemName}>{item.name}</h4>
                          <p className={styles.cartItemPrice}>₹{item.newPrice}</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(index)}
                          className={styles.removeItem}
                        >
                          <X className={styles.icon} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cartItems.length > 0 && (
                <div className={styles.cartFooter}>
                  <div className={styles.coinsSection}>
                    <label className={styles.coinsLabel}>
                      Redeem Coins (Max: {MAX_DISCOUNT_COINS})
                    </label>
                    <input
                      type="number"
                      min="0"
                      max={MAX_DISCOUNT_COINS}
                      value={redeemedCoins}
                      onChange={(e) => setRedeemedCoins(Number(e.target.value))}
                      className={styles.coinsInput}
                    />
                  </div>

                  <div className={styles.summary}>
                    <div className={styles.summaryRow}>
                      <span>Subtotal</span>
                      <span>₹{totalAmount}</span>
                    </div>
                    <div className={`${styles.summaryRow} ${styles.discount}`}>
                      <span>Discount</span>
                      <span>-₹{discount.toFixed(2)}</span>
                    </div>
                    <div className={`${styles.summaryRow} ${styles.total}`}>
                      <span>Total</span>
                      <span>₹{finalAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  <button className={styles.checkoutButton}>
                    Proceed to Checkout
                    <ChevronRight className={styles.icon} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Cart Toggle */}
      <button
        onClick={() => setIsCartVisible(!isCartVisible)}
        className={styles.toggleCartButton}
      >
        {isCartVisible ? 'Hide Cart' : 'Show Cart'}
      </button>
    </div>
  );
};

export default Courses;
