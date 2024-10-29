const promoAd = document.querySelector('.promo-ad');
const signupBtn = document.querySelector('.signup-btn');

promoAd.addEventListener('mouseover', () => {
    signupBtn.style.display = 'block';
});

promoAd.addEventListener('mouseout', () => {
    signupBtn.style.display = 'none';
});