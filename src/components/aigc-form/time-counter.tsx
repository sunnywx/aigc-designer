import { useEffect, useRef, useState } from "react";
import styles from "./form.module.scss";

export default function TimeCounter() {
  const start = useRef(Date.now())
  const [time, setTime] = useState(0)
  
  useEffect(() => {
    const timer = setInterval(() => {
      const delta = (Date.now() - start.current) / 1000
      setTime(delta)
    }, 50)
    
    return () => {
      clearInterval(timer);
    }
  }, [])
  
  return (
    <div className={styles.counter}>Elapsed time: {time.toFixed(2)} seconds</div>
  )
}