import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/counter/userSlice';
import db from '../firebase';
import './PlansScreen.css';
import { loadStripe } from '@stripe/stripe-js';
const PlansScreen = () => {
  const [products, setProducts] = useState([]);
  const user = useSelector(selectUser);
  useEffect(() => {
    // Get the products and prices in the cloud firestore and set the state products
    db.collection('products')
      .where('active', '==', true)
      .get()
      .then((querySnapshot) => {
        const productos = {};
        querySnapshot.forEach(async (productDoc) => {
          productos[productDoc.id] = productDoc.data();
          const priceSnap = await productDoc.ref.collection('prices').get();
          priceSnap.docs.forEach((price) => {
            productos[productDoc.id].prices = {
              priceId: price.id,
              priceData: price.data(),
            };
          });
        });
        setProducts(productos);
      });
  }, []);
  //creating the checkout session
  const loadCheckout = async (priceId) => {
    const docRef = await db
      .collection('customers')
      .doc(user.uid)
      .collection('checkout_sessions')
      .add({
        mode: 'payment',
        price: priceId,
        // success_url: `${window.location.origin}/success.html`,
        // cancel_url: `${window.location.origin}/cancel.html`,
        success_url: window.location.origin,
        cancel_url: window.location.origin,
      });

    docRef.onSnapshot(async (snap) => {
      const { error, sessionId } = snap.data();
      if (error) {
        //show an error to the customer and inspect your cloud function logs in FireBase console
        alert(`An error occured: ${error.message}`);
      }
      if (sessionId) {
        // We have a session, let's redirect to checkout
        //init stripe

        const stripe = await loadStripe(
          'pk_test_51Mxsh5A15mwpYxoYInCfWCcmVXxpJLi4locbnSGQp1bYE8Dql8PbVWuUTvpSOrjZ1dA5Sl62utUkWgbB543PN66l00P3FqdEER'
        );

        stripe.redirectToCheckout({ sessionId });
      }
    });
  };
  return (
    <div className="plansScreen">
      {Object.entries(products).map(([productId, productData], index) => {
        // TODO: add some logic to check if the user suscription is active
        return (
          <div key={index} className="plansScreen__plan">
            <div className="plansScreen__info">
              <h5>{productData.name}</h5>
              <h6>{productData.description}</h6>
            </div>
            <button onClick={() => loadCheckout(productData.prices.priceId)}>
              Subscribe
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default PlansScreen;
