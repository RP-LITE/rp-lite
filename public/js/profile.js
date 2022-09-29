

// Element variables
const $progressBars = document.querySelectorAll('.progress-bar');
const $creatureRow = document.getElementById('creature-row');
const $$targetContainer = $('#target-select-container');
const $$defendContainer = $('#defend-select-container');
const $$multiclassContainer = $('#multiclass-select-container');
const $$challengeContainer = $('#challenges');
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

const createLevelButton = (id) => {
  const button = document.createElement('button');
  button.dataset.creature = id;
  button.append('Level up !');
  button.className = 'btn level-button';
  return button;
};

const createMCButtons = (id,type) => {
  const typeSwitch = {
    rock:'Dog',
    paper:'Squirrel',
    scissor:'Cat',
  }
  return ['rock','paper','scissor'].reduce((memo,t) => {
    if(t !== type){
      const b = document.createElement('button');
      b.dataset.creature = id;
      b.dataset.type = t;
      b.className = 'btn';
      b.append(typeSwitch[t]);
      memo.push(b);
    }
    return memo;
  },[]);
};

const levelUp = async (e) => {
  // get the actual button
  console.log(e);
  const button = e.target.tagName === 'BUTTON' ?
    e.target :
    e.target.parentElement;
    console.log(button);
  // If this wasn't an actual button, ignore it
  if(!button?.dataset.creature || !button.className.includes('level-button')) return;
  const creature = await fetch(`/api/profile/${button.dataset.creature}`)
    .then(data => data.json());
  const mainLevel = creature[`${creature.type}_lvl`];

  if((mainLevel + 1) % 4 === 0){
    // Display the multiclass modal
    const buttons = createMCButtons(creature.id,creature.type);
    const container = document.getElementById('multiclass-select-container');
    container.replaceChildren(...buttons);
    window.location.hash = '#multiclass-modal';
  }else{
    executeLevelUp(creature.id);
  }
};

const executeLevelUp = async (id,data = {})=>{
  const creatureContainer = document.getElementById(`creature-${id}`);
  const button = document.querySelector(`#creature-${id} .progress-bar + button[data-creature="${id}"]`);
  const newCard = await fetch(`/api/profile/${id}`,{
    method:'PUT',
    body:JSON.stringify(data),
    headers:{
      "Content-Type":"application/json"
    }
  })
    .then(r => r.text());
  console.log('newCard',newCard);
  $(`#creature-${id}`).replaceWith(newCard);
  const $bar = document.querySelector(`#creature-${id} .progress-bar`);
  sizeProgressBar($bar);
};

// challenge button
/**
 * Creates the list of available users to challenge and the creatures available to choose. Also opens the challenge modal.
 */
const openChallengeModal = async (e)=>{
  // get the actual button
  const button = e.target.tagName === 'BUTTON' ?
    e.target :
    e.target.parentElement;
  // If this wasn't an actual button, ignore it
  if(!button?.dataset.creature || !button.className.includes('challenge-button')) return;
  const creature = await fetch(`/api/profile/${button.dataset.creature}`)
    .then(data => data.json());
  const availableUsers = await fetch(`/api/challenges/search/${creature.id}`)
    .then(data => data.text());
  $$targetContainer.empty().append(availableUsers);
  window.location.hash = '#challenge-modal';
};

/**
 * Starts the process of selecting a creature to defend with
 * @param {object} $event - Jquery event object
 */
const openDefendModal = async ($event)=>{
  const challengeID = $event.currentTarget.dataset.challenge;
  const creatures = await fetch(`/api/challenges/defend/${challengeID}`)
    .then(data => data.text());
  console.log('defense creatures',creatures);
  $$defendContainer.empty().append(creatures);
  window.location.hash = '#defend-modal';
};

const multiclass = async ($event) => {
  await executeLevelUp($event.currentTarget.dataset.creature,{add_type:$event.currentTarget.dataset.type});
  window.location.hash = '';
};

// select opponent
const issueChallenge = async ($event)=>{
  const challengeData = {
    target_id:$event.currentTarget.dataset.user,
    challenge_object:$event.currentTarget.dataset.creature
  }
  await fetch('/api/challenges',{
    method:'POST',
    body:JSON.stringify(challengeData),
    headers:{
      "Content-Type":"application/json"
    }
  });
  window.location.hash = '';
};

// Select your creature to defend with
const resolveChallenge = async ($event) => {
  const challengeID = $event.currentTarget.dataset.challenge;
  const challengeData = {
    target_object:$event.currentTarget.dataset.creature
  };
  await fetch(`/api/challenges/${challengeID}`,{
    method:'PUT',
    body:JSON.stringify(challengeData),
    headers:{
      "Content-Type":"application/json"
    }
  });
  window.location.hash = '';
};

/**
 * Cancels a challenge that has been issued
 * @param {obect} $event - Jquery event object
 */
const cancelChallenge = async ($event)=>{
  const challengeID = $event.currentTarget.dataset.challenge;
  console.log('challengeID',challengeID);
  await fetch(`/api/challenges/${challengeID}`,{
    method:'DELETE'
  });
};

const sizeProgressBar = ($bar) => {
  console.log('$bar',$bar);
  const curr = +$bar.getAttribute('aria-valuenow') || 0;
  const max = +$bar.getAttribute('aria-valuemax') || 1;
  console.log('curr | max',curr,' | ',max);
  $bar.style.width = `${curr / max * 100}%`;
  if(curr >= max){
    const levelButton = createLevelButton($bar.dataset.creature);
    $bar.after(levelButton);
  }else{
    document.getElementById(`level-${$bar.dataset.creature}`)?.remove(0);
  }
};

$progressBars.forEach(sizeProgressBar);
$creatureRow.addEventListener('click',openChallengeModal);
$creatureRow.addEventListener('click',levelUp);

$$targetContainer.on('click','button',issueChallenge);
$$defendContainer.on('click','button',resolveChallenge);
$$multiclassContainer.on('click','button',multiclass);

$$challengeContainer.on('click','.recall',cancelChallenge)
$$challengeContainer.on('click','.defend',openDefendModal)