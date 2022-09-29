const $challengeDiv = $('#challenges');
const $challengeList = $('#challenge-list');
const availableContent = (id) => `
<h5>Status: Available</h5>
<button class="challenge-button d-flex btn p-5 align-self-center border-0" data-creature="${id}" style="height:auto;">
    <img style="width:4.4rem;" src="portraits/icons/rock-paper-scissors.png" alt="Send to Charm">
</button>`;
const isCharmingContent = ()=>`
<h5>Status: Currently Engaged</h5>`;

socket.on('challengeUpdate',data => {
  console.log('data',data);
  console.log('data',data);
  const $charmContainer = $(`#creature-${data.attackCreature} .is-charming`);
  const $existingCard = $(`#challenge-${data.cardID}`);
  if(data.delete){
    $existingCard?.remove();
    $charmContainer.empty().append(availableContent(data.attackCreature));
    $charmContainer.addClass('justify-content-around');
  }else if($existingCard[0]){
    $existingCard.replaceWith(data.card);
  }else{
    const $topChallenge = $('#challenge-list > :first-child');
    if($topChallenge.length){
      $topChallenge.before(data.card);
    }else{
      $challengeList.append(data.card);
    }
    $charmContainer.empty().append(isCharmingContent());
    $charmContainer.removeClass('justify-content-around');
  }
  ['defender','attacker'].forEach(key => {
    console.log('key',key);
    if(data.data[key]){
      const $progressBar = $(`#creature-${data.data[key].id} .progress-bar`);
      if($progressBar[0]){
        const experience = data.data[key].experience;
        $progressBar.attr('aria-valuenow',experience);
        console.log('arianow',$progressBar[0].getAttribute('aria-valuenow'));
        sizeProgressBar($progressBar[0]);
      }
    }
  });
});