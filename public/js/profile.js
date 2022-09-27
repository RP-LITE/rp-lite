// forEach creature render card
// Creature Name
// image
// lvl
// experience (progress bar)
// experience/experience_threshold

// forEach challenge
// challenger user_name
// type
// level

// challenge button
// select your creature
// select opponent
const $progressBars = document.querySelectorAll('.progress-bar');
const sizeProgressBar = ($bar) => {
  const curr = +$bar.dataset['aria-valuenow'] || 0;
  const max = +$bar.dataset['aria-valuemax'] || 1;
  $bar.style.width = `${curr / max * 100}%`;
};
$progressBars.forEach(sizeProgressBar);
