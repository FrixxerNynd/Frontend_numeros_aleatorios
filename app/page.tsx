export default function Home() {
  if (typeof window !== 'undefined') {
    window.location.replace('/wallet');
  }
  return null;
}