import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PIN_LENGTH = 6;

export default function PinLockScreen({ tryUnlock, error }) {
    const [digits, setDigits] = useState(Array(PIN_LENGTH).fill(''));
    const inputRefs = useRef([]);

    // Auto-focus first input on mount
    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    // Submit when all 6 digits are filled
    useEffect(() => {
        if (digits.every(d => d !== '')) {
            tryUnlock(digits.join(''));
        }
    }, [digits, tryUnlock]);

    // Shake on error — clear digits and refocus
    useEffect(() => {
        if (error) {
            setTimeout(() => {
                setDigits(Array(PIN_LENGTH).fill(''));
                inputRefs.current[0]?.focus();
            }, 600);
        }
    }, [error]);

    const handleChange = (val, idx) => {
        if (!/^\d*$/.test(val)) return;
        const next = [...digits];
        next[idx] = val.slice(-1);
        setDigits(next);
        if (val && idx < PIN_LENGTH - 1) {
            inputRefs.current[idx + 1]?.focus();
        }
    };

    const handleKeyDown = (e, idx) => {
        if (e.key === 'Backspace' && !digits[idx] && idx > 0) {
            const next = [...digits];
            next[idx - 1] = '';
            setDigits(next);
            inputRefs.current[idx - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, PIN_LENGTH);
        if (pasted.length === PIN_LENGTH) {
            setDigits(pasted.split(''));
        }
        e.preventDefault();
    };

    return (
        <div style={{
            position: 'fixed', inset: 0,
            background: 'radial-gradient(ellipse at 50% 40%, #0a0a1e 0%, #05050f 70%)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            zIndex: 9999, gap: '2rem',
            fontFamily: 'monospace',
        }}>
            {/* Animated background grid lines */}
            <div style={{
                position: 'absolute', inset: 0, overflow: 'hidden',
                backgroundImage: `
                    linear-gradient(rgba(0,245,255,0.03) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(0,245,255,0.03) 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px',
                pointerEvents: 'none',
            }} />

            {/* Logo */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                style={{ textAlign: 'center' }}
            >
                <div style={{ fontSize: '2.8rem', lineHeight: 1, marginBottom: '0.3rem' }}>✈</div>
                <div style={{
                    fontSize: '1.6rem', fontWeight: 700, letterSpacing: '6px',
                    background: 'linear-gradient(90deg, #00f5ff, #9d4edd)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>
                    VAYUNAV
                </div>
                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.25)', letterSpacing: '2px', marginTop: '4px' }}>
                    RESTRICTED ACCESS
                </div>
            </motion.div>

            {/* PIN Box */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(0,245,255,0.15)',
                    borderRadius: '16px',
                    padding: '2.5rem 2rem',
                    backdropFilter: 'blur(16px)',
                    textAlign: 'center',
                    minWidth: '340px',
                }}
            >
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '3px', marginBottom: '1.8rem' }}>
                    ENTER PASSCODE
                </div>

                {/* Digit inputs */}
                <motion.div
                    animate={error ? { x: [0, -10, 10, -8, 8, -4, 4, 0] } : {}}
                    transition={{ duration: 0.5 }}
                    style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginBottom: '1.5rem' }}
                >
                    {digits.map((d, i) => (
                        <input
                            key={i}
                            ref={el => inputRefs.current[i] = el}
                            type="password"
                            inputMode="numeric"
                            maxLength={1}
                            value={d}
                            onChange={e => handleChange(e.target.value, i)}
                            onKeyDown={e => handleKeyDown(e, i)}
                            onPaste={handlePaste}
                            style={{
                                width: '44px', height: '56px',
                                textAlign: 'center', fontSize: '1.4rem',
                                background: d
                                    ? 'rgba(0,245,255,0.1)'
                                    : 'rgba(255,255,255,0.04)',
                                border: `1px solid ${error
                                    ? 'rgba(255,80,80,0.7)'
                                    : d
                                        ? 'rgba(0,245,255,0.5)'
                                        : 'rgba(255,255,255,0.12)'}`,
                                borderRadius: '10px',
                                color: '#00f5ff',
                                outline: 'none',
                                caretColor: 'transparent',
                                transition: 'all 0.2s ease',
                            }}
                        />
                    ))}
                </motion.div>

                {/* Error message */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            style={{ fontSize: '0.7rem', color: 'rgba(255,80,80,0.85)', letterSpacing: '2px' }}
                        >
                            INVALID PASSCODE
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Idle hint */}
                {!error && (
                    <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.18)', letterSpacing: '1px', marginTop: '0.25rem' }}>
                        6-digit code required
                    </div>
                )}
            </motion.div>

            {/* Footer */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.15)', letterSpacing: '1px' }}
            >
                for flight simulation purposes only
            </motion.div>
        </div>
    );
}
