var anim;
var elem = document.getElementById('anim_05')
var animData = {
    container: elem,
    renderer: 'svg',
    loop: true,
    autoplay: !pauseAnimation,
    rendererSettings: {
        progressiveLoad:true,
        preserveAspectRatio:'xMidYMid meet'
    },
    path: 'js/animations/anim_05.json'
};
anim = lottie.loadAnimation(animData);
anim.setSubframe(false);
anim.setSpeed(0.7);
