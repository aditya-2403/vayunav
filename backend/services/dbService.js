const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc, setDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Determine validity of cache (e.g., 28 days for an AIRAC cycle)
const CACHE_EXPIRY_MS = 28 * 24 * 60 * 60 * 1000;

async function getCachedCharts(airportCode) {
    try {
        const docRef = doc(db, 'airports', airportCode);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            const data = docSnap.data();
            const now = Date.now();
            // Verify if cache is fresh
            if (data.lastScraped && (now - data.lastScraped < CACHE_EXPIRY_MS)) {
                console.log(`Cache HIT for ${airportCode}`);
                return data.charts;
            } else {
                console.log(`Cache EXPIRED for ${airportCode}`);
            }
        } else {
            console.log(`Cache MISS for ${airportCode}`);
        }
    } catch (err) {
        console.error("Firebase read error, bypassing cache:", err);
    }
    return null;
}

async function cacheCharts(airportCode, charts) {
    try {
        if (!charts || charts.length === 0) return;
        
        const docRef = doc(db, 'airports', airportCode);
        await setDoc(docRef, {
            charts: charts,
            lastScraped: Date.now()
        });
        console.log(`Saved ${charts.length} charts to Firebase for ${airportCode}`);
    } catch (err) {
        console.error("Firebase write error:", err);
    }
}

module.exports = {
    getCachedCharts,
    cacheCharts
};
