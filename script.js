squares.forEach((square, index) => {
  const row = Math.floor(index / 8);
  const isEven = (row + (index % 8)) % 2 === 0;
  if (isEven) {
    if(! square.classList.contains("light"))console.log(index)
  } else {
    if(! square.classList.contains("dark"))console.log(index)
  }
});