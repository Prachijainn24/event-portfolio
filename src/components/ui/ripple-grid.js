import { useEffect, useRef } from 'react';

// JavaScript/CSS equivalent of the supplied RippleGrid component.
export function RippleGrid({
  className = '',
  size = 7,
  filledCells = [{ row: 1, col: 5 }, { row: 3, col: 2 }, { row: 5, col: 4 }],
  cellSize = 46,
  cellColor = 'rgba(255,255,255,.12)',
  filledCellColor = 'rgba(21,151,220,.26)',
  pulseColor = 'rgba(118,206,250,.7)',
  borderColor = 'rgba(77,177,220,.22)',
  borderWidth = 1,
  pulseScale = 1.12,
  pulseDuration = 300,
  rippleDelay = 90,
}) {
  const gridRef = useRef(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return undefined;
    const handleClick = (event) => {
      const target = event.target;
      if (!target.classList.contains('ripple-cell')) return;
      const clickedRow = Number(target.dataset.row);
      const clickedCol = Number(target.dataset.col);
      grid.querySelectorAll('.ripple-cell').forEach((cell) => {
        const distance = Math.abs(Number(cell.dataset.row) - clickedRow) + Math.abs(Number(cell.dataset.col) - clickedCol);
        window.setTimeout(() => {
          cell.classList.add('ripple-cell-pulse');
          window.setTimeout(() => cell.classList.remove('ripple-cell-pulse'), pulseDuration + 150);
        }, distance * rippleDelay);
      });
    };
    grid.addEventListener('click', handleClick);
    return () => grid.removeEventListener('click', handleClick);
  }, [pulseDuration, rippleDelay]);

  const filled = (row, col) => filledCells.some((cell) => cell.row === row && cell.col === col);
  return <div ref={gridRef} className={`ripple-grid ${className}`} style={{ gridTemplateColumns: `repeat(${size}, ${cellSize}px)`, gridTemplateRows: `repeat(${size}, ${cellSize}px)`, '--ripple-cell-size': `${cellSize}px`, '--ripple-cell': cellColor, '--ripple-filled': filledCellColor, '--ripple-pulse': pulseColor, '--ripple-border': borderColor, '--ripple-width': `${borderWidth}px`, '--ripple-scale': pulseScale, '--ripple-duration': `${pulseDuration}ms` }} aria-label="Interactive ripple grid background">
    {Array.from({ length: size * size }, (_, index) => { const row = Math.floor(index / size); const col = index % size; return <div key={`${row}-${col}`} className={`ripple-cell ${filled(row, col) ? 'ripple-cell-filled' : ''}`} data-row={row} data-col={col} />; })}
  </div>;
}
