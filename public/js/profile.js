// Element variables
const $progressBars = document.querySelectorAll('.progress-bar');
const $challengeButton = document.getElementById('start-challenge');
const $chalCreatureSel = document.getElementById('challenge-creature');
const $chalTargetSel = document.getElementById('challenge-target');
const $creatureRow = document.getElementById('creature-row');
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
/**
 * Creates the list of available users to challenge and the creatures available to choose. Also opens the challenge modal.
 */
const openChallengeModal = async (e)=>{
  // get the actual button
  const button = e.target.tagName === 'button' ?
    e.target :
    e.target.parentElement;
  // If this wasn't an actual button, ignore it

  if(!button?.dataset.creature) return;
  const creature = await fetch(`/api/profile/${button.dataset.creature}`)
    .then(data => data.json());
  const availableUsers = await fetch('/api/challenges/search')
    .then(data => data.text());
  console.log('availableUsers',availableUsers);
  console.log('creature',creature);
  // const defaultUserOpt = document.createElement();
  // window.location.hash = '#challenge-modal';
};
// select your creature
// select opponent

const sizeProgressBar = ($bar) => {
  const curr = +$bar.dataset['aria-valuenow'] || 0;
  const max = +$bar.dataset['aria-valuemax'] || 1;
  $bar.style.width = `${curr / max * 100}%`;
};

$progressBars.forEach(sizeProgressBar);
$creatureRow.addEventListener('click',openChallengeModal);