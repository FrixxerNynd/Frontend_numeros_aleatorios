'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { useWalletStore } from '@/store/wallet.store';
import { getAuthHeaders } from '@/lib/utils';

const API = process.env.NEXT_PUBLIC_GAMES_API_URL || 'http://localhost:3000/api';

// ─── Constants ───────────────────────────────────────────────────────────────
const CARD_W = 80;
const CARD_H = 112;
const CIRC   = 2 * Math.PI * 22;

const CHIPS  = [
  { val: 5,   color: 'radial-gradient(circle at 35% 35%, #ef4444, #991b1b)' },
  { val: 10,  color: 'radial-gradient(circle at 35% 35%, #3b82f6, #1d4ed8)' },
  { val: 25,  color: 'radial-gradient(circle at 35% 35%, #22c55e, #15803d)' },
  { val: 50,  color: 'radial-gradient(circle at 35% 35%, #f59e0b, #b45309)' },
  { val: 100, color: 'radial-gradient(circle at 35% 35%, #8b5cf6, #6d28d9)' },
];

// ─── Types ────────────────────────────────────────────────────────────────────
interface Card { v: string; s: string; }
interface ResultInfo { title: string; sub: string; colorClass: string; }

function calcScore(hand: Card[]): number {
  let total = 0, aces = 0;
  for (const c of hand) {
    if (c.v === 'A') { aces++; total += 11; }
    else if (['J','Q','K'].includes(c.v)) total += 10;
    else total += parseInt(c.v);
  }
  while (total > 21 && aces > 0) total -= 10, aces--;
  return total;
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function PlayingCard({ suit = '', value = '', faceDown = false, style = {} }: {
  suit?: string; value?: string; faceDown?: boolean; style?: React.CSSProperties;
}) {
  const src = faceDown ? '/cards/back.png' : `/cards/${value}_${suit}.png`;
  return (
    <div style={{
      width: CARD_W, height: CARD_H, borderRadius: 10, overflow: 'hidden',
      boxShadow: '0 4px 14px rgba(0,0,0,0.45)', flexShrink: 0, position: 'relative',
      animation: 'dealCard 0.25s ease-out', ...style,
    }}>
      <Image src={src} alt={faceDown ? 'card back' : `${value} of ${suit}`}
        fill style={{ objectFit: 'cover' }} priority />
    </div>
  );
}

function ScoreBadge({ score, style = {} }: { score: number; style?: React.CSSProperties }) {
  const bust = score > 21;
  return (
    <div style={{
      background: bust ? '#DC2626' : '#fff', color: bust ? '#fff' : '#111',
      borderRadius: '50%', width: 30, height: 30,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 700, fontSize: 13, boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
      border: bust ? 'none' : '1px solid #e5e7eb',
      transition: 'background 0.3s, color 0.3s', ...style,
    }}>{score}</div>
  );
}

function CardHand({ hand, hideSecond = false, fan = false }: {
  hand: Card[]; hideSecond?: boolean; fan?: boolean;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', position: 'relative' }}>
      {hand.map((card, i) => {
        const angle = fan ? (i - (hand.length - 1) / 2) * 9 : 0;
        const tx    = fan ? (i - (hand.length - 1) / 2) * -14 : 0;
        const zIdx  = fan ? (i === Math.floor(hand.length / 2) ? 2 : 1) : i;
        return (
          <PlayingCard
            key={`${card.v}_${card.s}_${i}`}
            value={card.v} suit={card.s}
            faceDown={hideSecond && i === 1}
            style={{ transform: `rotate(${angle}deg) translateX(${tx}px)`, zIndex: zIdx, marginLeft: (!fan && i > 0) ? -6 : 0 }}
          />
        );
      })}
    </div>
  );
}

function TimerRing({ value, total }: { value: number; total: number }) {
  const offset = CIRC * (1 - value / total);
  return (
    <svg width="50" height="50" viewBox="0 0 50 50">
      <circle cx="25" cy="25" r="22" fill="#0A2A1F" stroke="rgba(255,255,255,.08)" strokeWidth="3" />
      <circle cx="25" cy="25" r="22" fill="none" stroke="#00FF88" strokeWidth="3"
        strokeLinecap="round" strokeDasharray={CIRC} strokeDashoffset={offset}
        transform="rotate(-90 25 25)" style={{ transition: 'stroke-dashoffset 1s linear' }} />
      <foreignObject x="7" y="10" width="36" height="30">
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14, fontWeight: 700 }}>
          {value}
        </div>
      </foreignObject>
    </svg>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function BlackjackPage() {
  const { balance: walletBalance, fetchBalance } = useWalletStore();
  const [localBalance, setLocalBalance] = useState<number | null>(null);
  const balance = localBalance ?? walletBalance;

  const [bet, setBet]                   = useState(0);
  const [selectedChip, setSelectedChip] = useState(25);
  const [phase, setPhase]               = useState<'bet'|'play'|'dealer'|'done'>('bet');
  const [timerVal, setTimerVal]         = useState(20);
  const [isSettling, setIsSettling]     = useState(false);
  const [settleError, setSettleError]   = useState<string | null>(null);

  const [dealerHand, setDealerHand]   = useState<Card[]>([]);
  const [playerHand, setPlayerHand]   = useState<Card[]>([]);
  const [hideDealer, setHideDealer]   = useState(true);

  const [totalWin, setTotalWin] = useState(0);
  const [result, setResult]     = useState<ResultInfo | null>(null);

  // Script de la partida interactiva (Token)
  const [token, setToken] = useState<string | null>(null);

  const timerRef  = useRef<ReturnType<typeof setInterval> | null>(null);

  // sync local balance when wallet loads
  useEffect(() => {
    if (localBalance === null && walletBalance > 0) {
      setLocalBalance(walletBalance);
    }
  }, [walletBalance, localBalance]);

  useEffect(() => { void fetchBalance(); }, [fetchBalance]);

  // ── Timer ──
  const clearTimer = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  }, []);

  const startTimer = useCallback((seconds: number, onExpire: () => void) => {
    clearTimer();
    setTimerVal(seconds);
    timerRef.current = setInterval(() => {
      setTimerVal(t => {
        if (t <= 1) { clearTimer(); onExpire(); return seconds; }
        return t - 1;
      });
    }, 1000);
  }, [clearTimer]);

  useEffect(() => () => clearTimer(), [clearTimer]);

  // ── Backend Interaction ───────────────────────────────────────────────────
  async function performAction(action: 'deal'|'hit'|'stand'|'double', amountToSend: number) {
    setIsSettling(true);
    setSettleError(null);

    try {
      const response = await fetch(`${API}/games/bet`, {
        method: 'POST',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        credentials: 'include',
        body: JSON.stringify({
          amount: amountToSend,
          gameType: 'blackjack',
          selection: { action, token },
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'Error al procesar acción');
      }

      const data = await response.json();
      const ws = data.winningSelection;
      
      setPlayerHand(ws.playerHand);
      setDealerHand(ws.dealerHand);
      
      if (ws.token) {
        setToken(ws.token);
      }

      if (ws.isOver) {
        setHideDealer(false);
        setPhase('done');
        setTotalWin(data.payout);
        setResult({
          title: data.message,
          sub: data.payout > 0 ? `Ganaste ${data.payout} fichas` : 'Perdiste la apuesta',
          colorClass: data.winner ? '#00c864' : (data.payout === amountToSend && data.winner) ? '#fff' : '#ef4444'
        });
        clearTimer();
        void fetchBalance().then(() => setLocalBalance(null));
      } else {
        setPhase('play');
        startTimer(30, () => performAction('stand', 0));
      }
      
    } catch (error) {
      setSettleError(error instanceof Error ? error.message : 'Error de red');
    } finally {
      setIsSettling(false);
    }
  }

  // ── Actions ───────────────────────────────────────────────────────────────
  async function handleDeal() {
    if (bet === 0 || balance < bet) return;
    setLocalBalance(b => (b ?? walletBalance) - bet);
    setHideDealer(true);
    setResult(null);
    setTotalWin(0);
    setDealerHand([]);
    setPlayerHand([]);
    await performAction('deal', bet);
  }

  function handleHit() {
    if (phase !== 'play' || !token) return;
    startTimer(30, () => performAction('stand', 0));
    void performAction('hit', 0);
  }

  function handleStand() {
    if (phase !== 'play' || !token) return;
    void performAction('stand', 0);
  }

  function handleDouble() {
    if (phase !== 'play' || !token || balance < bet) return;
    setLocalBalance(b => (b ?? walletBalance) - bet);
    setBet(b => b * 2);
    void performAction('double', bet);
  }

  function handleNewRound() {
    setBet(b => Math.min(b, balance));
    setPhase('bet');
    setDealerHand([]);
    setPlayerHand([]);
    setHideDealer(true);
    setResult(null);
    setTotalWin(0);
    setToken(null);
    clearTimer();
  }

  useEffect(() => { handleNewRound(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  // ── Derived ───────────────────────────────────────────────────────────────
  const dealerScore = hideDealer && dealerHand.length ? calcScore([dealerHand[0]]) : calcScore(dealerHand);
  const playerScore = playerHand.length ? calcScore(playerHand) : 0;
  
  // Can only double on initial hand if enough balance
  const canDouble = phase === 'play' && playerHand.length === 2 && balance >= bet;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @keyframes dealCard {
          from { opacity: 0; transform: translateY(-20px) scale(0.9); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes resultPop {
          from { opacity: 0; transform: scale(0.8); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>

      <div style={{
        minHeight: '100vh', paddingTop: '4rem',
        background: 'radial-gradient(ellipse at 50% 0%, #1a5c3a 0%, #0d3520 60%, #071a0f 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {/* ── TABLE ── */}
        <div style={{
          width: 900, minHeight: 560, borderRadius: 26,
          background: 'linear-gradient(180deg, #1E6F4F 0%, #165a40 60%, #0f3d2b 100%)',
          border: '6px solid #2d4a38',
          boxShadow: '0 0 0 3px #0a1a12, 0 24px 70px rgba(0,0,0,.75), inset 0 0 80px rgba(0,0,0,.3)',
          position: 'relative', overflow: 'hidden', userSelect: 'none',
        }}>

          {/* Felt texture */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4'%3E%3Ccircle cx='1' cy='1' r='.5' fill='rgba(255,255,255,.015)'/%3E%3C/svg%3E")`,
          }} />

          {/* Arc lines */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
            <ellipse cx="450" cy="590" rx="420" ry="180" fill="none" stroke="rgba(255,255,255,.07)" strokeWidth="2" />
            <ellipse cx="450" cy="615" rx="465" ry="205" fill="none" stroke="rgba(255,255,255,.04)" strokeWidth="2" />
          </svg>

          {/* Balance */}
          <div style={{
            position: 'absolute', top: 16, left: 16, background: '#0A2A1F',
            borderRadius: 10, padding: '8px 16px',
            border: '1px solid rgba(255,255,255,.1)', boxShadow: '0 2px 8px rgba(0,0,0,.4)',
          }}>
            <div style={{ color: 'rgba(255,255,255,.6)', fontSize: 11, letterSpacing: '.5px' }}>Fichas</div>
            <div style={{ color: '#fff', fontSize: 17, fontWeight: 700 }}>
              {isSettling && phase === 'done' ? '...' : Math.floor(balance).toLocaleString()}
            </div>
          </div>

          {/* Settle error */}
          {settleError && (
            <div style={{
              position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)',
              background: 'rgba(239,68,68,.9)', color: '#fff', padding: '6px 14px',
              borderRadius: 8, fontSize: 12, zIndex: 50,
            }}>
              {settleError}
            </div>
          )}

          {/* Timer */}
          {phase === 'play' && (
            <div style={{ position: 'absolute', top: 16, right: 20, width: 50, height: 50 }}>
              <TimerRing value={timerVal} total={30} />
            </div>
          )}

          {/* ── DEALER ── */}
          <div style={{
            position: 'absolute', top: 44, left: '50%', transform: 'translateX(-50%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
          }}>
            {dealerHand.length > 0 && (
              <>
                <CardHand hand={dealerHand} hideSecond={hideDealer} />
                <ScoreBadge score={dealerScore} />
              </>
            )}
          </div>

          {/* ── PLAYER ── */}
          <div style={{
            position: 'absolute', bottom: 96, left: '50%', transform: 'translateX(-50%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          }}>
            {playerHand.length > 0 && (
              <>
                <ScoreBadge score={playerScore} />
                <CardHand hand={playerHand} fan />
              </>
            )}
          </div>

          {/* ── RESULT OVERLAY ── */}
          {result && (
            <div style={{
              position: 'absolute', inset: 0,
              background: 'rgba(0,0,0,.45)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              zIndex: 30, borderRadius: 20,
            }}>
              <div style={{
                background: '#0A2A1F', border: '1px solid rgba(255,255,255,.15)',
                borderRadius: 16, padding: '28px 40px', textAlign: 'center',
                boxShadow: '0 12px 40px rgba(0,0,0,.7)',
                animation: 'resultPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}>
                <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 6, color: result.colorClass }}>{result.title}</div>
                <div style={{ color: 'rgba(255,255,255,.6)', fontSize: 15, marginBottom: 20 }}>{result.sub}</div>
                {isSettling && (
                  <div style={{ color: 'rgba(255,255,255,.4)', fontSize: 12, marginBottom: 12 }}>Sincronizando saldo…</div>
                )}
                <button
                  onClick={handleNewRound}
                  disabled={isSettling}
                  style={{
                    padding: '11px 32px', borderRadius: 50, border: 'none',
                    background: isSettling ? 'rgba(0,200,100,.3)' : 'linear-gradient(135deg,#00c864,#007a3d)',
                    color: '#fff', fontWeight: 700, fontSize: 15,
                    cursor: isSettling ? 'wait' : 'pointer',
                    boxShadow: '0 4px 14px rgba(0,200,100,.4)',
                  }}
                >Nueva Ronda</button>
              </div>
            </div>
          )}

          {/* ── ACTION BUTTONS (play phase) ── */}
          {phase === 'play' && (
            <div style={{
              position: 'absolute', bottom: 82, left: '50%', transform: 'translateX(-50%)',
              display: 'flex', gap: 10, zIndex: 20,
            }}>
              {([
                { label: 'Pedir',     onClick: handleHit,    bg: 'linear-gradient(135deg,#22c55e,#15803d)',  show: true },
                { label: 'Plantarse', onClick: handleStand,  bg: 'linear-gradient(135deg,#a855f7,#7c3aed)', show: true },
                { label: 'Doblar',    onClick: handleDouble, bg: 'linear-gradient(135deg,#f59e0b,#b45309)',  show: true, disabled: !canDouble || isSettling },
              ] as const).filter(b => b.show).map(({ label, onClick, bg, disabled }) => (
                <button key={label} onClick={onClick}
                  disabled={disabled as boolean | undefined || isSettling}
                  style={{
                    padding: '10px 22px', borderRadius: 50, border: 'none',
                    background: bg, color: '#fff', fontWeight: 700, fontSize: 13,
                    cursor: (disabled as boolean | undefined) || isSettling ? 'not-allowed' : 'pointer',
                    boxShadow: '0 3px 10px rgba(0,0,0,.4)', letterSpacing: '.5px',
                    opacity: (disabled as boolean | undefined) || isSettling ? .4 : 1,
                  }}
                >{label}</button>
              ))}
            </div>
          )}

          {/* ── CHIP SELECTOR (bet phase) ── */}
          {phase === 'bet' && (
            <div style={{
              position: 'absolute', bottom: 82, left: '50%', transform: 'translateX(-50%)',
              display: 'flex', gap: 8, zIndex: 20,
            }}>
              {CHIPS.map(({ val, color }) => (
                <div key={val} onClick={() => setSelectedChip(val)} style={{
                  width: 44, height: 44, borderRadius: '50%', background: color,
                  border: `3px solid ${selectedChip === val ? '#00FF88' : 'rgba(255,255,255,.25)'}`,
                  boxShadow: selectedChip === val
                    ? '0 0 0 2px #00FF88, 0 3px 8px rgba(0,0,0,.4)'
                    : '0 3px 8px rgba(0,0,0,.4), inset 0 1px 0 rgba(255,255,255,.2)',
                  cursor: 'pointer', fontWeight: 800, fontSize: 12, color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'transform .1s, box-shadow .15s',
                }}>{val}</div>
              ))}
            </div>
          )}

          {/* ── BOTTOM BAR ── */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: 74,
            background: '#0A2A1F', borderTop: '1px solid rgba(255,255,255,.08)',
            display: 'flex', alignItems: 'center', overflow: 'visible',
          }}>
            {/* Apuesta */}
            <div style={{ flex: 1, borderRight: '1px solid rgba(255,255,255,.08)', padding: '0 28px' }}>
              <div style={{ color: 'rgba(255,255,255,.5)', fontSize: 11, letterSpacing: '.5px' }}>Apuesta</div>
              <div style={{ color: '#fff', fontSize: 18, fontWeight: 700 }}>{bet} fichas</div>
            </div>
            {/* Ganancia */}
            <div style={{ flex: 1, borderRight: '1px solid rgba(255,255,255,.08)', padding: '0 28px' }}>
              <div style={{ color: 'rgba(255,255,255,.5)', fontSize: 11, letterSpacing: '.5px' }}>Ganancia</div>
              <div style={{ color: totalWin > 0 ? '#00FF88' : '#fff', fontSize: 18, fontWeight: 700 }}>{totalWin} fichas</div>
            </div>

            {/* Controls */}
            <div style={{
              flex: 2, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 4, position: 'relative',
            }}>
              {bet > 0 && (
                <div style={{
                  position: 'absolute', top: -56, left: '50%', transform: 'translateX(-50%)',
                  width: 52, height: 52, borderRadius: '50%',
                  background: 'radial-gradient(circle at 35% 35%, #ef4444, #991b1b)',
                  border: '3px solid rgba(255,255,255,.3)',
                  boxShadow: '0 4px 10px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontWeight: 800, fontSize: 14, zIndex: 10,
                }}>{bet}</div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button
                  onClick={() => { if (phase === 'bet') setBet(b => Math.max(0, b - selectedChip)); }}
                  disabled={phase !== 'bet' || bet === 0}
                  style={{
                    width: 30, height: 30, borderRadius: '50%', background: 'transparent',
                    border: '2px solid #ef4444', color: '#ef4444', fontSize: 22,
                    cursor: phase === 'bet' ? 'pointer' : 'not-allowed',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    opacity: phase !== 'bet' || bet === 0 ? .35 : 1,
                  }}
                >−</button>
                <button
                  onClick={handleDeal}
                  disabled={phase !== 'bet' || bet === 0 || balance < bet || isSettling}
                  style={{
                    width: 52, height: 52, borderRadius: '50%',
                    background: 'linear-gradient(145deg,#2a2a2a,#111)',
                    border: '2px solid rgba(255,255,255,.15)', color: '#fff',
                    fontSize: 12, fontWeight: 700, letterSpacing: '.5px',
                    cursor: phase === 'bet' && bet > 0 && !isSettling ? 'pointer' : 'not-allowed',
                    boxShadow: '0 3px 10px rgba(0,0,0,.5)',
                    opacity: phase !== 'bet' || bet === 0 || balance < bet || isSettling ? .5 : 1,
                  }}
                >DEAL</button>
                <button
                  onClick={() => { if (phase === 'bet' && balance - bet >= selectedChip) setBet(b => b + selectedChip); }}
                  disabled={phase !== 'bet' || balance - bet < selectedChip}
                  style={{
                    width: 30, height: 30, borderRadius: '50%', background: 'transparent',
                    border: '2px solid #00FF88', color: '#00FF88', fontSize: 20,
                    cursor: phase === 'bet' ? 'pointer' : 'not-allowed',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    opacity: phase !== 'bet' || balance - bet < selectedChip ? .35 : 1,
                  }}
                >+</button>
              </div>
              <div style={{ color: 'rgba(255,255,255,.4)', fontSize: 11, letterSpacing: '.5px' }}>Jugador</div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
